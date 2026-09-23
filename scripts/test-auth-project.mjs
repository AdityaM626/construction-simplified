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
  } finally {
    if (projectId) await prisma.project.delete({ where: { id: projectId } });
    await prisma.auditEvent.deleteMany({ where: { actorId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await new Promise(resolve => server.close(resolve));
    await prisma.$disconnect();
  }
});
