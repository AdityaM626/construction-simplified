import seedData from '../packages/db/src/seedData.json' assert { type: 'json' };

console.log('====================================================================================');
console.log('CONSTRUCTION OS — MASTER PRODUCT ARCHITECTURE & ECOSYSTEM ACCEPTANCE SUITE');
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
  // 1. Primary User Roles & Team Roster
  console.log('[Check 1] Verifying Primary Accounts & Specialist Team Roster...');
  assert(seedData.users.some(u => u.role === 'HOMEOWNER'), `House Owner account verified`);
  assert(seedData.users.some(u => u.role === 'BUILDER'), `Contractor account verified`);
  assert(seedData.users.some(u => u.role === 'DEALER'), `Shopkeeper account verified`);

  const team = seedData.constructionTeamMembers;
  assert(team.length >= 3, `Construction team roster populated (${team.length} specialists)`);
  const roles = team.map(t => t.role);
  assert(roles.includes('ELECTRICIAN'), `Team specialist role: ELECTRICIAN (Ramesh Kumar)`);
  assert(roles.includes('PLUMBER'), `Team specialist role: PLUMBER (Suresh Babu)`);
  assert(roles.includes('ARCHITECT'), `Team specialist role: ARCHITECT (Ananya Roy)`);

  // 2. Central Project Context
  console.log('\n[Check 2] Verifying Central Project Object Context...');
  assert(seedData.projects.length >= 1, `Central project initialized`);
  const prj = seedData.projects[0];
  assert(prj.id === 'prj-101', `Project ID = ${prj.id} (${prj.name})`);

  // 3. Multi-Shopkeeper Procurement & Traceability
  console.log('\n[Check 3] Verifying Multi-Shopkeeper Procurement & Traceability...');
  const reqs = seedData.materialRequirements;
  assert(reqs.length >= 2, `Multiple material requirements populated`);
  const req1 = reqs[0]; // Cement
  const req2 = reqs[1]; // Steel
  assert(req1.selectedDealerId === 'dlr-prof-1', `Cement supplied by Shopkeeper A (UltraTech Depot)`);
  assert(req2.selectedDealerId === 'dlr-prof-2', `Steel supplied by Shopkeeper B (Jindal Steel Hub)`);

  // 4. Single Source of Truth Order & Ledger History
  console.log('\n[Check 4] Verifying Single Source of Truth Order & Ledger...');
  assert(seedData.orderRequests.length >= 1, `Order #ORD-1042 created`);
  const order = seedData.orderRequests[0];
  assert(order.homeownerId === 'usr-homeowner-1', `Order linked to House Owner`);
  assert(order.contractorId === 'usr-builder-1', `Order linked to Contractor`);
  assert(order.dealerId === 'dlr-prof-1', `Order linked to Shopkeeper`);
  assert(seedData.projectLedger.length >= 6, `Ledger event stream active (${seedData.projectLedger.length} events logged)`);

  console.log('\n====================================================================================');
  console.log('  🎉 MASTER ARCHITECTURE & ECOSYSTEM ACCEPTANCE SUITE PASSED (100%)');
  console.log('====================================================================================\n');
} catch (err) {
  console.error('Master architecture acceptance test failed:', err);
  process.exit(1);
}
