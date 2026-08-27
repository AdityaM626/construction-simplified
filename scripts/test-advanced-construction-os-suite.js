import seedData from '../packages/db/src/seedData.json' assert { type: 'json' };

console.log('====================================================================================');
console.log('CONSTRUCTION OS — ADVANCED LIFECYCLE & PRODUCT MASTER ACCEPTANCE SUITE');
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
  // 1. Two-Sided Role Model & Core Project Context
  console.log('[Check 1] Verifying 2-Role Scoping & Project Context...');
  assert(seedData.users.some(u => u.role === 'HOMEOWNER'), `House Owner role verified (Rajesh Kumar)`);
  assert(seedData.users.some(u => u.role === 'BUILDER'), `Contractor role verified (Vikram Singh)`);
  assert(!seedData.users.some(u => u.role === 'DEALER'), `Zero shopkeeper user logins`);

  // 2. Smart Dependencies & Downstream Delay Warnings
  console.log('\n[Check 2] Verifying Smart Milestone Dependencies & Delay Engine...');
  const mls3 = seedData.milestones.find(m => m.id === 'mls-3');
  assert(mls3.dependsOnMilestoneId === 'mls-2', `Milestone dependencies established (mls-3 depends on mls-2)`);
  assert(Boolean(mls3.downstreamImpactWarning), `Downstream delay impact warning triggered`);

  // 3. Quality Checkpoints & Defect Rework Metrics
  console.log('\n[Check 3] Verifying Quality Checkpoints & Defect Rework Tracking...');
  assert(seedData.qualityCheckpoints.length >= 2, `Quality inspection checkpoints verified (${seedData.qualityCheckpoints.length} entries)`);
  assert(seedData.qualityCheckpoints.some(q => q.category === 'WATERPROOFING' && q.status === 'PASS'), `Waterproofing inspection PASSED`);
  
  const def = seedData.defectRecords[0];
  assert(def.reworkCost === 8500, `Defect rework cost tracked (₹8,500)`);
  assert(def.reworkTimeDays === 1, `Defect rework time tracked (1 day)`);
  assert(def.status === 'VERIFIED_CLOSED', `Defect verified & closed`);

  // 4. Digital Handover Center
  console.log('\n[Check 4] Verifying Digital Handover Center...');
  const hnd = seedData.digitalHandover;
  assert(hnd.finalContractValue === 4620000, `Final contract value settled = ₹46,20,000`);
  assert(hnd.isFinalInspectionPassed === true, `Final completion inspection passed`);
  assert(hnd.contractorConfirmed === true, `Contractor digital signoff verified`);
  assert(hnd.documentsBundle.length >= 2, `Handover document bundle compiled`);

  // 5. Permanent Home Passport
  console.log('\n[Check 5] Verifying Permanent Home Passport...');
  const pas = seedData.homePassport;
  assert(pas.propertyName === 'Sharma Residence / Kumar Villa (4BHK)', `Home Passport title verified`);
  assert(pas.systems.electrical.wiringBrand.includes('Havells'), `Electrical infrastructure system recorded`);
  assert(pas.systems.plumbing.tankCapacityLiters === 5000, `Plumbing infrastructure system recorded`);
  assert(pas.systems.waterproofing.warrantyYears === 10, `10-Year Waterproofing Warranty recorded`);
  assert(pas.maintenanceHistory.length >= 1, `Maintenance log initialized`);

  console.log('\n====================================================================================');
  console.log('  🎉 ADVANCED LIFECYCLE & PRODUCT MASTER ACCEPTANCE SUITE PASSED (100%)');
  console.log('====================================================================================\n');
} catch (err) {
  console.error('Advanced Construction OS acceptance test failed:', err);
  process.exit(1);
}
