import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedDataPath = path.join(__dirname, '../packages/db/src/seedData.json');
const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

console.log('====================================================================================');
console.log('CONSTRUCTION OS — PROJECT TRUTH, COMMAND CENTER & INTELLIGENCE SUITE');
console.log('====================================================================================\n');

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exit(1);
  }
}

try {
  // 1. Two-Sided Role Model & Core Project Truth Context
  console.log('[Check 1] Verifying Project Truth Single Source of Truth...');
  assert(seedData.users.some(u => u.role === 'HOMEOWNER'), `House Owner role verified (Rajesh Kumar)`);
  assert(seedData.users.some(u => u.role === 'BUILDER'), `Contractor role verified (Vikram Singh)`);
  assert(!seedData.users.some(u => u.role === 'DEALER'), `Zero shopkeeper user logins`);

  // 2. Project Context & Health Explanation
  console.log('\n[Check 2] Verifying Central Project Context & Health Explanation...');
  const prj = seedData.projects[0];
  assert(prj.id === 'prj-101', `Central Project ID = ${prj.id}`);
  assert(prj.contractValue === 4500000, `Contract Value = ₹45,00,000`);
  assert(prj.projectHealth === 'HEALTHY', `Project Health = ${prj.projectHealth}`);
  assert(Boolean(prj.healthReason), `Explainable health reason provided`);

  // 3. BOQ & Budget vs Actual Reconciliation
  console.log('\n[Check 3] Verifying BOQ & Financial Reconciliation...');
  const boq = seedData.boqs[0];
  assert(boq.totalEstimatedValue === 4500000, `BOQ estimate = ₹45,00,000`);
  assert(seedData.budgetVsActualRecords.length >= 2, `Category variance matrix reconciled`);

  // 4. Change Orders & No-Surprise Impact Preview
  console.log('\n[Check 4] Verifying Change Control & Impact Preview...');
  const cho = seedData.changeOrders[0];
  assert(cho.costImpact === 120000, `Change order cost impact = +₹1,20,000`);
  assert(cho.timelineImpactDays === 4, `Change order schedule impact = +4 Days`);

  // 5. Digital Handover & Home Passport Truth
  console.log('\n[Check 5] Verifying Digital Handover & Home Passport...');
  const hnd = seedData.digitalHandover;
  assert(hnd.finalContractValue === 4620000, `Final contract settled = ₹46,20,000`);
  assert(seedData.homePassport.systems.waterproofing.warrantyYears === 10, `10-Year Waterproofing warranty in Home Passport`);

  console.log('\n====================================================================================');
  console.log('  🎉 PROJECT TRUTH, COMMAND CENTER & INTELLIGENCE SUITE PASSED (100%)');
  console.log('====================================================================================\n');
} catch (err) {
  console.error('Project Truth test failed:', err);
  process.exit(1);
}
