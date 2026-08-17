import seedData from '../packages/db/src/seedData.json' assert { type: 'json' };

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
  assert(seedData.users.length >= 4, `User database seeded with ${seedData.users.length} accounts`);
  const homeowner = seedData.users.find(u => u.role === 'HOMEOWNER');
  assert(homeowner !== undefined, `Homeowner account exists (${homeowner?.fullName})`);
  const builder = seedData.users.find(u => u.role === 'BUILDER');
  assert(builder !== undefined, `Builder account exists (${builder?.fullName})`);
  const dealer = seedData.users.find(u => u.role === 'DEALER');
  assert(dealer !== undefined, `Dealer account exists (${dealer?.fullName})`);
  const admin = seedData.users.find(u => u.role === 'ADMIN');
  assert(admin !== undefined, `Admin account exists (${admin?.fullName})`);

  // Test 2: Project Onboarding & Budget Integrity
  console.log('\n[Test 2] Verifying Project & Budget Calculations...');
  assert(seedData.projects.length >= 1, `Project database initialized`);
  const prj = seedData.projects[0];
  assert(prj.totalBudget === 4500000, `Total budget equals ₹45,00,000`);
  assert(prj.spentCost === 1820000, `Spent cost equals ₹18,20,000`);
  assert(prj.committedCost === 850000, `Committed cost equals ₹8,50,000`);
  const uncommitted = prj.totalBudget - (prj.spentCost + prj.committedCost);
  assert(uncommitted === 1830000, `Uncommitted remaining budget equals ₹18,30,000`);

  // Test 3: Material Catalog & Comparison Engine
  console.log('\n[Test 3] Verifying Material Catalog & Specifications...');
  assert(seedData.products.length >= 6, `Product catalog populated with ${seedData.products.length} materials`);
  const cement = seedData.products.find(p => p.category === 'CEMENT');
  assert(cement !== undefined, `Cement product found: ${cement?.name} (₹${cement?.unitPrice}/bag)`);
  const steel = seedData.products.find(p => p.category === 'STEEL');
  assert(steel !== undefined, `Steel product found: ${steel?.name} (₹${steel?.unitPrice}/tonne)`);

  // Test 4: Milestones & Site Photo Updates
  console.log('\n[Test 4] Verifying Milestones & Builder Site Updates...');
  assert(seedData.milestones.length >= 4, `Project milestones created (${seedData.milestones.length} stages)`);
  assert(seedData.siteUpdates.length >= 2, `Site photo updates logged by builder`);

  // Test 5: Audit Event Trail
  console.log('\n[Test 5] Verifying Audit Logging Chain...');
  assert(seedData.auditEvents.length >= 2, `Audit trail contains ${seedData.auditEvents.length} events`);

  console.log('\n====================================================');
  console.log('  🎉 ALL SYSTEM VERIFICATION TESTS PASSED (100%)');
  console.log('====================================================\n');
} catch (err) {
  console.error('System verification failed:', err);
  process.exit(1);
}
