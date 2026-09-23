import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET ||= 'local-test-secret-must-be-at-least-32-characters';

test('accounts, project creation and membership authorization', async () => {
  const { app, prisma } = await import('../apps/api/dist/server.js');
  const server = app.listen(0);
  const origin = `http://127.0.0.1:${server.address().port}`;
  const suffix = randomUUID();
  const ids = [];
  let projectId;
  const request = async (path, method = 'GET', body, token) => {
    const response = await fetch(origin + path, {
      method,
      headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined
    });
    return { status: response.status, body: await response.json() };
  };
  try {
    const account = async role => {
      const response = await request('/api/auth/register', 'POST', {
        email: `${role.toLowerCase()}-${suffix}@example.test`,
        fullName: role, password: 'test-password-12345', role
      });
      assert.equal(response.status, 201, JSON.stringify(response.body));
      ids.push(response.body.user.id);
      return response.body;
    };
    const owner = await account('HOMEOWNER');
    const builder = await account('BUILDER');
    const outsider = await account('PROCUREMENT');
    assert.equal((await request('/api/auth/register', 'POST', {
      email: `admin-${suffix}@example.test`, fullName: 'Admin',
      password: 'test-password-12345', role: 'ADMIN'
    })).status, 400);
    assert.equal((await request('/api/auth/login', 'POST', {
      email: owner.user.email, password: 'incorrect-password'
    })).status, 401);
    assert.equal((await request('/api/projects')).status, 401);

    const created = await request('/api/projects', 'POST', {
      name: 'Test home', type: 'NEW_CONSTRUCTION', location: 'Bengaluru',
      totalBudget: 1000000, targetCompletionDate: '2027-12-31'
    }, owner.token);
    assert.equal(created.status, 201, JSON.stringify(created.body));
    projectId = created.body.id;
    assert.equal((await request(`/api/projects/${projectId}`, 'GET', undefined, outsider.token)).status, 403);
    assert.equal((await request(`/api/projects/${projectId}/members`, 'POST', {
      email: builder.user.email, role: 'BUILDER'
    }, owner.token)).status, 201);
    assert.equal((await request(`/api/projects/${projectId}`, 'GET', undefined, builder.token)).status, 200);
    assert.equal((await request(`/api/projects/${projectId}/members`, 'POST', {
      email: outsider.user.email, role: 'PROCUREMENT'
    }, builder.token)).status, 403);
    assert.equal((await request('/api/projects', 'GET', undefined, outsider.token)).body.length, 0);
    assert.equal((await request('/api/projects', 'POST', {
      name: 'Forbidden', type: 'RENOVATION', location: 'Bengaluru',
      totalBudget: 100, targetCompletionDate: '2027-12-31'
    }, builder.token)).status, 403);

    const path = `/api/projects/${projectId}`;
    assert.equal((await request(path + '/boq', 'POST', {
      description: 'Cement', category: 'MATERIALS', quantity: 10, unit: 'bags', estimatedRate: 450
    }, owner.token)).status, 403);
    assert.equal((await request(path + '/boq', 'POST', {
      description: 'Cement', category: 'MATERIALS', quantity: 10, unit: 'bags', estimatedRate: 450
    }, builder.token)).status, 201);
    const milestone = await request(path + '/milestones', 'POST', {
      title: 'Foundation', plannedEndDate: '2027-05-01', allocatedBudget: 200000
    }, builder.token);
    assert.equal(milestone.status, 201);
    assert.equal((await request(path + `/milestones/${milestone.body.id}/approve`, 'POST', undefined, owner.token)).status, 409);
    assert.equal((await request(path + `/milestones/${milestone.body.id}/submit`, 'POST', undefined, builder.token)).status, 200);
    assert.equal((await request(path + `/milestones/${milestone.body.id}/approve`, 'POST', undefined, owner.token)).status, 200);

    const change = await request(path + '/change-orders', 'POST', {
      title: 'Add room', description: 'Increase floor area', costImpact: 100000, timelineImpactDays: 14
    }, builder.token);
    assert.equal(change.status, 201);
    assert.equal((await request(path + `/change-orders/${change.body.id}/decision`, 'POST', {
      decision: 'APPROVED'
    }, builder.token)).status, 403);
    const decisions = await Promise.all([1, 2].map(() => request(
      path + `/change-orders/${change.body.id}/decision`, 'POST', { decision: 'APPROVED' }, owner.token
    )));
    assert.deepEqual(decisions.map(result => result.status).sort(), [200, 409]);
    assert.equal(Number((await request(path, 'GET', undefined, owner.token)).body.totalBudget), 1100000);

    assert.equal((await request(path + '/site-reports', 'POST', {
      reportDate: '2027-05-02', workCompleted: 'Foundation poured'
    }, builder.token)).status, 201);
    const defect = await request(path + '/defects', 'POST', {
      title: 'Crack', description: 'Hairline crack on wall', severity: 'MEDIUM'
    }, owner.token);
    assert.equal(defect.status, 201);
    assert.equal((await request(path + `/defects/${defect.body.id}/verify`, 'POST', undefined, owner.token)).status, 409);
    assert.equal((await request(path + `/defects/${defect.body.id}/resolve`, 'POST', undefined, builder.token)).status, 200);
    assert.equal((await request(path + `/defects/${defect.body.id}/verify`, 'POST', undefined, owner.token)).status, 200);

    const material = await request(path + '/material-requests', 'POST', {
      itemName: 'Cement', quantity: 10, unit: 'bags'
    }, builder.token);
    assert.equal(material.status, 201);
    assert.equal((await request(path + `/material-requests/${material.body.id}/advance`, 'POST', undefined, outsider.token)).status, 403);
    assert.equal((await request(path + '/members', 'POST', {
      email: outsider.user.email, role: 'PROCUREMENT'
    }, owner.token)).status, 201);
    for (const expected of ['ACCEPTED', 'DISPATCHED', 'DELIVERED']) {
      const advanced = await request(path + `/material-requests/${material.body.id}/advance`, 'POST', undefined, outsider.token);
      assert.equal(advanced.status, 200);
      assert.equal(advanced.body.status, expected);
    }
    assert.equal((await request(path + `/material-requests/${material.body.id}/advance`, 'POST', undefined, outsider.token)).status, 409);
    assert.equal((await request(path + '/documents', 'POST', {
      title: 'Drawing', category: 'PLAN', storageKey: 'drawing-001'
    }, outsider.token)).status, 201);
    assert.ok((await request(path + '/activity', 'GET', undefined, owner.token)).body.length >= 10);
  } finally {
    if (projectId) await prisma.project.delete({ where: { id: projectId } });
    await prisma.auditEvent.deleteMany({ where: { actorId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await new Promise(resolve => server.close(resolve));
    await prisma.$disconnect();
  }
});
