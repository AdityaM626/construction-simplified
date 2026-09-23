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
    assert.equal((await request(`/api/projects/${projectId}/workspace-overview`, 'GET', undefined, outsider.token)).status, 403);
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
    const boqItem = await request(path + '/boq', 'POST', {
      description: 'Cement', category: 'MATERIALS', quantity: 10, unit: 'bags', estimatedRate: 450
    }, builder.token);
    assert.equal(boqItem.status, 201);
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
    const acceptPath = path + `/material-requests/${material.body.id}/advance`;
    assert.equal((await request(acceptPath, 'POST', undefined, outsider.token)).body.status, 'ACCEPTED');
    assert.equal((await request(acceptPath, 'POST', undefined, outsider.token)).status, 409);
    assert.equal((await request(path + '/vendors', 'POST', {
      name: 'Alpha Cement'
    }, builder.token)).status, 403);
    const vendorA = await request(path + '/vendors', 'POST', {
      name: 'Alpha Cement', contactName: 'Amrita', email: 'alpha@example.test'
    }, outsider.token);
    const vendorB = await request(path + '/vendors', 'POST', {
      name: 'Beta Supply', email: 'beta@example.test'
    }, outsider.token);
    assert.equal(vendorA.status, 201);
    assert.equal(vendorB.status, 201);
    const quotePath = path + `/material-requests/${material.body.id}/quotations`;
    const quoteA = await request(quotePath, 'POST', {
      vendorId: vendorA.body.id, unitPrice: 400, leadTimeDays: 4
    }, outsider.token);
    assert.equal(quoteA.status, 201);
    assert.equal((await request(quotePath, 'POST', {
      vendorId: vendorB.body.id, unitPrice: 430, leadTimeDays: 2
    }, outsider.token)).status, 201);
    assert.deepEqual((await request(quotePath, 'GET', undefined, owner.token)).body.map(q => q.vendor.name),
      ['Alpha Cement', 'Beta Supply']);
    const order = await request(path + `/material-requests/${material.body.id}/purchase-order`, 'POST', {
      quotationId: quoteA.body.id
    }, outsider.token);
    assert.equal(order.status, 201, JSON.stringify(order.body));
    assert.equal((await request(path + `/material-requests/${material.body.id}/purchase-order`, 'POST', {
      quotationId: quoteA.body.id
    }, outsider.token)).status, 409);
    assert.equal((await request(path + `/purchase-orders/${order.body.id}/dispatch`, 'POST', {
      trackingReference: 'TRK-1'
    }, builder.token)).status, 403);
    assert.equal((await request(path + `/purchase-orders/${order.body.id}/dispatch`, 'POST', {
      trackingReference: 'TRK-1'
    }, outsider.token)).body.status, 'DISPATCHED');
    assert.equal((await request(path + `/purchase-orders/${order.body.id}/dispatch`, 'POST', {
      trackingReference: 'TRK-1'
    }, outsider.token)).status, 409);
    assert.equal((await request(path + `/purchase-orders/${order.body.id}/receipts`, 'POST', {
      acceptedQuantity: 5, damagedQuantity: 0, finalDelivery: false, evidenceReference: 'site-photo-1'
    }, outsider.token)).status, 403);
    assert.equal((await request(path + `/purchase-orders/${order.body.id}/receipts`, 'POST', {
      acceptedQuantity: 5, damagedQuantity: 0, finalDelivery: false, evidenceReference: 'site-photo-1'
    }, builder.token)).status, 201);
    assert.equal((await request(path + `/purchase-orders/${order.body.id}/receipts`, 'POST', {
      acceptedQuantity: 6, damagedQuantity: 0, finalDelivery: true, evidenceReference: 'site-photo-2'
    }, builder.token)).status, 400);
    assert.equal((await request(path + `/purchase-orders/${order.body.id}/receipts`, 'POST', {
      acceptedQuantity: 5, damagedQuantity: 0, finalDelivery: true, evidenceReference: 'site-photo-3'
    }, builder.token)).status, 201);
    const delivered = (await request(path + '/purchase-orders', 'GET', undefined, owner.token)).body[0];
    assert.equal(delivered.status, 'RECEIVED');
    assert.equal(delivered.receipts.length, 2);
    assert.equal((await request(path + '/material-requests', 'GET', undefined, owner.token)).body[0].status, 'DELIVERED');
    const summary = (await request(path + '/procurement-summary', 'GET', undefined, owner.token)).body;
    assert.equal(Number(summary.committed), 4000);
    assert.equal(Number(summary.receivedValue), 4000);

    const exceptionRequest = await request(path + '/material-requests', 'POST', {
      itemName: 'Tiles', quantity: 10, unit: 'boxes'
    }, builder.token);
    assert.equal(exceptionRequest.status, 201);
    assert.equal((await request(path + `/material-requests/${exceptionRequest.body.id}/advance`,
      'POST', undefined, outsider.token)).status, 200);
    const exceptionQuote = await request(path + `/material-requests/${exceptionRequest.body.id}/quotations`,
      'POST', { vendorId: vendorA.body.id, unitPrice: 300, leadTimeDays: 3 }, outsider.token);
    const exceptionOrder = await request(path + `/material-requests/${exceptionRequest.body.id}/purchase-order`,
      'POST', { quotationId: exceptionQuote.body.id }, outsider.token);
    assert.equal(exceptionOrder.status, 201);
    assert.equal((await request(path + `/purchase-orders/${exceptionOrder.body.id}/dispatch`, 'POST',
      { trackingReference: 'TRK-2' }, outsider.token)).status, 200);
    assert.equal((await request(path + `/purchase-orders/${exceptionOrder.body.id}/receipts`, 'POST', {
      acceptedQuantity: 8, damagedQuantity: 2, finalDelivery: true,
      evidenceReference: 'damage-photo-1', notes: 'Two boxes damaged'
    }, builder.token)).status, 201);
    assert.equal((await request(path + '/procurement-summary', 'GET', undefined, owner.token)).body.exceptions, 1);
    assert.equal((await request(path + '/purchase-orders', 'GET', undefined, owner.token)).body
      .find(p => p.id === exceptionOrder.body.id).status, 'EXCEPTION');
    const linked = await request(path + '/material-requests', 'POST', {
      boqItemId: boqItem.body.id, quantity: 10, neededBy: '2027-06-01'
    }, builder.token);
    assert.equal(linked.status, 201);
    assert.equal(linked.body.itemName, 'Cement');
    assert.equal(linked.body.unit, 'bags');
    assert.equal((await request(path + '/material-requests', 'POST', {
      boqItemId: boqItem.body.id, quantity: 10
    }, builder.token)).status, 409);
    assert.equal((await request(path + '/material-requests', 'POST', {
      boqItemId: boqItem.body.id, quantity: 11
    }, builder.token)).status, 400);
    const expensive = await request(path + '/material-requests', 'POST', {
      itemName: 'Steel', quantity: 10000, unit: 'kg'
    }, builder.token);
    assert.equal(expensive.status, 201);
    assert.equal((await request(path + `/material-requests/${expensive.body.id}/advance`,
      'POST', undefined, outsider.token)).status, 200);
    const expensiveQuote = await request(path + `/material-requests/${expensive.body.id}/quotations`,
      'POST', { vendorId: vendorA.body.id, unitPrice: 200, leadTimeDays: 1 }, outsider.token);
    assert.equal(expensiveQuote.status, 201);
    assert.equal((await request(path + `/material-requests/${expensive.body.id}/purchase-order`,
      'POST', { quotationId: expensiveQuote.body.id }, outsider.token)).status, 409);
    assert.equal((await request(path + '/procurement-summary', 'GET', undefined, owner.token)).body.committed, '7000');
    const homeownerOverview = await request(path + '/workspace-overview', 'GET', undefined, owner.token);
    const builderOverview = await request(path + '/workspace-overview', 'GET', undefined, builder.token);
    const procurementOverview = await request(path + '/workspace-overview', 'GET', undefined, outsider.token);
    assert.equal(homeownerOverview.status, 200);
    assert.equal(homeownerOverview.body.metrics.boqItems, 1);
    assert.equal(homeownerOverview.body.metrics.completedMilestones, 1);
    assert.equal(homeownerOverview.body.metrics.committed, '7000');
    assert.ok(homeownerOverview.body.recentActivity.length > 0);
    assert.deepEqual(homeownerOverview.body.attention.map(item => item.key), ['delivery-exceptions']);
    assert.deepEqual(builderOverview.body.attention.map(item => item.key), ['delivery-exceptions']);
    assert.deepEqual(procurementOverview.body.attention.map(item => item.key),
      ['material-acceptance', 'material-sourcing', 'delivery-exceptions']);
    assert.equal((await request(path + `/material-requests/${material.body.id}/advance`, 'POST', undefined, outsider.token)).status, 409);
    assert.equal((await request(path + '/documents', 'POST', {
      title: 'Drawing', category: 'PLAN', storageKey: 'drawing-001'
    }, outsider.token)).status, 201);
    assert.ok((await request(path + '/activity', 'GET', undefined, owner.token)).body.length >= 10);
  } finally {
    if (projectId) {
      await prisma.goodsReceipt.deleteMany({ where: { projectId } });
      await prisma.purchaseOrder.deleteMany({ where: { projectId } });
      await prisma.quotation.deleteMany({ where: { projectId } });
      await prisma.vendor.deleteMany({ where: { projectId } });
      await prisma.project.delete({ where: { id: projectId } });
    }
    await prisma.auditEvent.deleteMany({ where: { actorId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await new Promise(resolve => server.close(resolve));
    await prisma.$disconnect();
  }
});
