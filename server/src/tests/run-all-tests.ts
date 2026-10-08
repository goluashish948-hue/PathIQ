import { execSync } from 'child_process';

console.log('🧪 RUNNING FULL TEST SUITE (Part 27: Safety, Golden, E2E)...');

try {
  console.log('\n--- 1. Safety & Adversarial Tests ---');
  execSync('tsx src/tests/safety.test.ts', { stdio: 'inherit' });

  console.log('\n--- 2. Golden Algorithmic Tests ---');
  execSync('tsx src/tests/golden.test.ts', { stdio: 'inherit' });

  console.log('\n--- 3. Full End-to-End Story (Part 27 R) ---');
  execSync('tsx src/tests/e2e.test.ts', { stdio: 'inherit' });

  console.log('\n===========================================');
  console.log('✅ ALL TEST SUITES PASSED WITH 100% SUCCESS');
  console.log('===========================================');
} catch (err: any) {
  console.error('❌ Test execution failed');
  process.exit(1);
}
