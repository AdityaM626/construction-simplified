const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'sprint-zero-role-boundary-test';

const app = require('../apps/api/dist/server.js').default;
const { db } = require('@construction-os/db');

async function main() {
  const project = db.projects[0];
  assert.ok(project, 'seed project is required');

  const server = app.listen(0);
  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const requestAs = async (id, role) => {
      const token = jwt.sign({ id, role, email: 'test@example.com', fullName: 'Test User' }, process.env.JWT_SECRET);
      const response = await fetch(`${baseUrl}/api/projects/${project.id}/health`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.status;
    };

    assert.equal(await requestAs(project.homeownerId, 'HOMEOWNER'), 200);
    assert.equal(await requestAs('unrelated-homeowner', 'HOMEOWNER'), 403);
    if (project.builderId) {
      assert.equal(await requestAs(project.builderId, 'BUILDER'), 200);
      assert.equal(await requestAs('unrelated-builder', 'BUILDER'), 403);
    }
    assert.equal(await requestAs('legacy-dealer', 'DEALER'), 403);
    assert.equal(await requestAs('future-procurement', 'PROCUREMENT'), 403);
    console.log('Project access role boundary passed');
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
