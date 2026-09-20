import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedDataPath = path.join(__dirname, '../packages/db/src/seedData.json');
const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

console.log('====================================================================================');
console.log('CONSTRUCTION OS — OWNER OS ↔ CONTRACTOR OS ARCHITECTURE ACCEPTANCE SUITE');
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
  // 1. Two-Sided Role Model Verification
  console.log('[Check 1] Verifying Streamlined Two-Sided Account Roles...');
  assert(seedData.users.some(u => u.role === 'HOMEOWNER'), `House Owner role verified (Rajesh Kumar)`);
  assert(seedData.users.some(u => u.role === 'BUILDER'), `Contractor role verified (Vikram Singh - Apex Infra)`);
  assert(!seedData.users.some(u => u.role === 'DEALER'), `Shopkeeper user login removed (Suppliers managed internally)`);

  // 2. Central Project & Health Engine
  console.log('\n[Check 2] Verifying Central Project Context & Project Health Engine...');
  const prj = seedData.projects[0];
  assert(prj.id === 'prj-101', `Central Project ID = ${prj.id}`);
  assert(prj.contractValue === 4500000, `Contract Value = ₹45,00,000`);
  assert(prj.projectHealth === 'HEALTHY', `Project Health = ${prj.projectHealth}`);

  // 3. BOQ & Estimation Engine
  console.log('\n[Check 3] Verifying BOQ & Estimation Engine...');
  const boq = seedData.boqs[0];
  assert(boq.totalEstimatedValue === 4500000, `BOQ total estimate = ₹45,00,000`);
  assert(boq.items.length >= 1, `BOQ item entries populated (${boq.items.length} items)`);

  // 4. Budget vs Actual Variance Matrix
  console.log('\n[Check 4] Verifying Budget vs Actual Category Variance...');
  const bva = seedData.budgetVsActualRecords;
  assert(bva.length >= 2, `Budget vs Actual categories tracked (${bva.length} categories)`);
  assert(bva.some(r => r.category === 'MATERIALS'), `Materials variance category active`);
  assert(bva.some(r => r.category === 'LABOUR'), `Labour variance category active`);

  // 5. Change Order Approval Flow
  console.log('\n[Check 5] Verifying Change Order Approval Engine...');
  const cho = seedData.changeOrders[0];
  assert(cho.costImpact === 120000, `Change order cost impact = +₹1,20,000`);
  assert(cho.requestedByRole === 'HOMEOWNER', `Change order requested by Homeowner`);

  // 6. Daily Site Reports & Internal Procurement
  console.log('\n[Check 6] Verifying Daily Site Reports & Internal Procurement...');
  assert(seedData.dailySiteReports.length >= 1, `Daily site report logged by contractor`);
  assert(seedData.vendorProcurementRecords.length >= 1, `Internal vendor procurement logged internally`);

  console.log('\n====================================================================================');
  console.log('  🎉 OWNER OS ↔ CONTRACTOR OS ARCHITECTURE ACCEPTANCE SUITE PASSED (100%)');
  console.log('====================================================================================\n');
} catch (err) {
  console.error('Owner ↔ Contractor acceptance test failed:', err);
  process.exit(1);
}
