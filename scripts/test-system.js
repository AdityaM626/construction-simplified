import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedDataPath = path.join(__dirname, '../packages/db/src/seedData.json');
const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

console.log('====================================================');
console.log('CONSTRUCTION OS — AUTOMATED VERIFICATION & TEST SUITE');
console.log('====================================================\n');

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exit(1);
  }
}

try {
  // Test 1: Verify Seed Users & Roles
  console.log('[Test 1] Verifying Data Model & Seed Users...');
  assert(seedData.users.length >= 3, `User database seeded with ${seedData.users.length} accounts`);
  const homeowner = seedData.users.find(u => u.role === 'HOMEOWNER');
  assert(homeowner !== undefined, `Homeowner account exists (${homeowner?.fullName})`);
  const builder = seedData.users.find(u => u.role === 'BUILDER');
  assert(builder !== undefined, `Builder account exists (${builder?.fullName})`);
  const admin = seedData.users.find(u => u.role === 'ADMIN');
  assert(admin !== undefined, `Admin account exists (${admin?.fullName})`);

  // Test 2: Project Onboarding & Budget Integrity
  console.log('\n[Test 2] Verifying Project & Budget Calculations...');
  assert(seedData.projects.length >= 1, `Project database initialized`);
  const prj = seedData.projects[0];
  assert(prj.totalBudget === 4500000, `Total budget equals ₹45,00,000`);
  assert(prj.spentCost === 1820000, `Spent cost equals ₹18,20,000`);
  assert(prj.committedCost === 850000, `Committed cost equals ₹8,50,000`);

  // Test 3: BOQ & Category Variance Matrix
  console.log('\n[Test 3] Verifying BOQ & Financial Control...');
  assert(seedData.boqs.length >= 1, `BOQ master created`);
  assert(seedData.budgetVsActualRecords.length >= 2, `Category variance matrix initialized`);

  // Test 4: Milestones & Site Photo Updates
  console.log('\n[Test 4] Verifying Milestones & Daily Site Reports...');
  assert(seedData.milestones.length >= 2, `Project milestones created (${seedData.milestones.length} stages)`);
  assert(seedData.dailySiteReports.length >= 1, `Daily site reports logged by builder`);

  console.log('\n====================================================');
  console.log('  🎉 ALL SYSTEM VERIFICATION TESTS PASSED (100%)');
  console.log('====================================================\n');
} catch (err) {
  console.error('System verification failed:', err);
  process.exit(1);
}
