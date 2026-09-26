import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const webOrigin = 'http://127.0.0.1:4173';
const apiOrigin = 'http://127.0.0.1:4000';
const results = 'test-results/browser-flow';
const suffix = randomUUID().slice(0, 8);
const password = 'browser-test-password-12345';
const account = role => ({
  name: `E2E ${role.toLowerCase()} ${suffix}`,
  email: `e2e-${role.toLowerCase()}-${suffix}@example.test`,
  role
});

const server = (command, args, extraEnv = {}) => {
  const child = spawn(command, args, {
    env: { ...process.env, ...extraEnv },
    shell: process.platform === 'win32',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let output = '';
  for (const stream of [child.stdout, child.stderr]) {
    stream.on('data', chunk => { output = (output + chunk.toString()).slice(-12000); });
  }
  return { child, logs: () => output };
};

async function ready(url, processInfo) {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (processInfo.child.exitCode !== null) throw new Error(`Service exited: ${processInfo.logs()}`);
    try { if ((await fetch(url, { signal: AbortSignal.timeout(3000) })).ok) return; } catch { /* starting */ }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error(`Service did not start at ${url}: ${processInfo.logs()}`);
}

let browser;
const pages = [];
const api = server(process.execPath, ['apps/api/dist/server.js'],
  { PORT: '4000', WEB_ORIGIN: webOrigin });
const web = server(process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['run', 'preview', '--workspace=@construction-os/web', '--', '--host', '127.0.0.1', '--port', '4173']);

async function register(person) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(15000);
  page.on('pageerror', error => console.error(`${person.role} page error:`, error));
  page.on('response', response => {
    if (response.status() >= 400 && response.url().includes('/api/'))
      console.error(`${person.role} API ${response.status()}: ${response.url()}`);
  });
  pages.push(page);
  await page.goto(webOrigin);
  await page.getByRole('button', { name: 'Create account' }).first().click();
  await page.getByLabel('Full name').fill(person.name);
  await page.getByLabel('Email').fill(person.email);
  await page.getByLabel('Password').fill(password);
  await page.getByLabel('Account role').selectOption(person.role);
  await page.locator('form').getByRole('button', { name: 'Create account' }).click();
  await page.getByRole('heading', { name: 'Your projects' }).waitFor();
  console.log(`${person.role}: registered and signed in`);
  return page;
}

async function signIn(person) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(15000);
  pages.push(page);
  await page.goto(webOrigin);
  await page.getByLabel('Email').fill(person.email);
  await page.getByLabel('Password').fill(password);
  await page.locator('form').getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('heading', { name: 'Your projects' }).waitFor();
  console.log(`${person.role}: signed in`);
  return page;
}

const tab = (page, name) => page.locator('nav[aria-label="Project workflows"]')
  .getByRole('button', { name, exact: true });

try {
  await mkdir(results, { recursive: true });
  await Promise.all([ready(apiOrigin + '/api/health', api), ready(webOrigin, web)]);
  console.log('API and web servers are ready');
  browser = await chromium.launch({ headless: true });
  const homeowner = account('HOMEOWNER');
  const builder = account('BUILDER');
  const procurement = account('PROCUREMENT');
  const admin = account('ADMIN');
  execFileSync(process.execPath, ['apps/api/dist/create-admin.js'], {
    env: { ...process.env, ADMIN_EMAIL: admin.email, ADMIN_NAME: admin.name,
      ADMIN_PASSWORD: password }
  });
  const ownerPage = await register(homeowner);
  const builderPage = await register(builder);
  const procurementPage = await register(procurement);
  const adminPage = await signIn(admin);

  const project = `E2E Residence ${suffix}`;
  await ownerPage.getByLabel('Project name').fill(project);
  await ownerPage.getByLabel('Location').fill('Bengaluru');
  await ownerPage.getByLabel('Total budget').fill('1000000');
  await ownerPage.getByLabel('Target completion date').fill('2027-12-31');
  await ownerPage.getByRole('button', { name: 'Create project' }).click();
  await ownerPage.getByRole('heading', { name: project }).waitFor();
  for (const person of [builder, procurement]) {
    await ownerPage.getByLabel('Member email').fill(person.email);
    await ownerPage.getByLabel('Member role').selectOption(person.role);
    await ownerPage.getByRole('button', { name: 'Add member' }).click();
    await ownerPage.locator('ul').getByText(person.name).waitFor();
  }
  console.log('HOMEOWNER: created project and added builder and procurement');
  assert.equal(await tab(ownerPage, 'Overview').getAttribute('aria-pressed'), 'true');
  await ownerPage.screenshot({ path: `${results}/homeowner-overview.png`, fullPage: true });

  await adminPage.reload();
  await adminPage.getByRole('heading', { name: project }).waitFor();
  await tab(adminPage, 'Activity').click();
  await adminPage.getByRole('heading', { name: 'Activity' }).waitFor();
  console.log('ADMIN: viewed the project and activity without membership');
  await adminPage.screenshot({ path: `${results}/admin-activity.png`, fullPage: true });

  await builderPage.reload();
  await builderPage.getByRole('heading', { name: project }).waitFor();
  await tab(builderPage, 'BOQ').click();
  await builderPage.getByLabel('Item description').fill('Cement');
  await builderPage.getByLabel('Category').fill('MATERIALS');
  await builderPage.getByLabel('Quantity').fill('10');
  await builderPage.getByLabel('Unit').fill('bags');
  await builderPage.getByLabel('Estimated rate (₹)').fill('450');
  await builderPage.getByRole('button', { name: 'Add boq' }).click();
  await builderPage.getByRole('heading', { name: 'Cement' }).waitFor();
  console.log('BUILDER: created BOQ item');

  await tab(builderPage, 'Milestones').click();
  await builderPage.getByLabel('Milestone title').fill('Foundation');
  await builderPage.getByLabel('Planned date').fill('2027-05-01');
  await builderPage.getByLabel('Allocated budget (₹)').fill('200000');
  await builderPage.getByRole('button', { name: 'Add milestone' }).click();
  await builderPage.getByRole('button', { name: 'Submit for approval' }).click();
  await builderPage.getByText('AWAITING APPROVAL').waitFor();
  console.log('BUILDER: submitted milestone');

  await tab(builderPage, 'Materials').click();
  await builderPage.getByLabel('BOQ item').selectOption({ index: 1 });
  await builderPage.getByLabel('Quantity').fill('10');
  await builderPage.getByRole('button', { name: 'Create request' }).click();
  await builderPage.getByRole('status').getByText('Material request created').waitFor();
  assert.equal(await builderPage.getByRole('button', { name: 'Add supplier' }).count(), 0);
  console.log('BUILDER: created material request');

  await procurementPage.reload();
  await procurementPage.getByRole('heading', { name: project }).waitFor();
  await tab(procurementPage, 'Materials').click();
  await procurementPage.getByRole('button', { name: 'Accept request' }).click();
  await procurementPage.getByRole('status').getByText('Request accepted').waitFor();
  await procurementPage.getByLabel('Supplier name').fill('E2E Cement Supply');
  await procurementPage.getByRole('button', { name: 'Add supplier' }).click();
  await procurementPage.getByRole('status').getByText('Supplier recorded').waitFor();
  await procurementPage.getByLabel('Supplier', { exact: true }).selectOption({ index: 1 });
  await procurementPage.getByLabel('Unit price').fill('400');
  await procurementPage.getByLabel('Lead time in days').fill('3');
  await procurementPage.getByRole('button', { name: 'Record quotation' }).click();
  await procurementPage.getByRole('button', { name: 'Issue purchase order' }).click();
  await procurementPage.getByRole('status').getByText('Purchase order issued').waitFor();
  await procurementPage.getByLabel('Tracking reference').fill('E2E-TRK-001');
  await procurementPage.getByRole('button', { name: 'Record dispatch' }).click();
  await procurementPage.getByRole('status').getByText('Dispatch recorded').waitFor();
  console.log('PROCUREMENT: accepted request, quoted, ordered, and dispatched');
  assert.equal(await procurementPage.getByRole('button', { name: 'Record site receipt' }).count(), 0);
  await procurementPage.screenshot({ path: `${results}/procurement-dispatch.png`, fullPage: true });

  await builderPage.reload();
  await builderPage.getByRole('heading', { name: project }).waitFor();
  await tab(builderPage, 'Materials').click();
  await builderPage.getByLabel('Accepted quantity').fill('10');
  await builderPage.getByLabel('Receipt evidence reference').fill('E2E-photo-reference');
  await builderPage.getByRole('button', { name: 'Record site receipt' }).click();
  await builderPage.getByRole('status').getByText('Site receipt recorded').waitFor();
  await builderPage.getByText('RECEIVED').first().waitFor();
  console.log('BUILDER: recorded site receipt');
  await builderPage.screenshot({ path: `${results}/builder-receipt.png`, fullPage: true });

  await ownerPage.reload();
  await ownerPage.getByRole('heading', { name: project }).waitFor();
  await tab(ownerPage, 'Milestones').click();
  await ownerPage.getByRole('button', { name: 'Approve completion' }).click();
  await ownerPage.getByText('COMPLETED').first().waitFor();
  await tab(ownerPage, 'Overview').click();
  await ownerPage.getByText('1 / 1').waitFor();
  const summary = await ownerPage.getByText('purchase commitments', { exact: false }).textContent();
  assert.match(summary || '', /₹4,000/);
  console.log('HOMEOWNER: approved milestone and verified budget');
  await ownerPage.screenshot({ path: `${results}/homeowner-complete.png`, fullPage: true });

  console.log('Browser flow passed: four roles, registration, membership, BOQ, milestone approval, sourcing, dispatch, receipt, and homeowner overview.');
} catch (error) {
  console.error(error);
  for (let index = 0; index < pages.length; index++) {
    try { await pages[index].screenshot({ path: `${results}/failure-page-${index + 1}.png`, fullPage: true, timeout: 10000 }); }
    catch { /* page may already be closed */ }
  }
  console.error('API logs:', api.logs());
  console.error('Web logs:', web.logs());
  process.exitCode = 1;
} finally {
  await browser?.close();
  for (const service of [api, web]) {
    service.child.kill();
    service.child.stdout?.destroy();
    service.child.stderr?.destroy();
  }
  // The web server may leave a child process behind after its npm wrapper exits.
  // The browser assertions are complete, so finish this CI-only runner explicitly.
  await new Promise(resolve => setTimeout(resolve, 200));
  process.exit(process.exitCode || 0);
}

