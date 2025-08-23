#!/usr/bin/env node

/**
 * Test Runner Script for CHIM Sales Backend
 * 
 * Usage:
 *   node run-tests.js                    # Run all tests
 *   node run-tests.js --watch            # Run tests in watch mode
 *   node run-tests.js --coverage         # Run tests with coverage
 *   node run-tests.js --ci               # Run tests for CI environment
 *   node run-tests.js --debug            # Run tests with debugging
 */

const { spawn } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const isWatch = args.includes('--watch');
const isCoverage = args.includes('--coverage');
const isCI = args.includes('--ci');
const isDebug = args.includes('--debug');

// Build Jest command
let jestArgs = ['jest'];

if (isWatch) {
  jestArgs.push('--watch');
}

if (isCoverage) {
  jestArgs.push('--coverage');
}

if (isCI) {
  jestArgs.push('--ci', '--coverage', '--watchAll=false');
}

if (isDebug) {
  jestArgs = ['node', '--inspect-brk', path.join(__dirname, 'node_modules', '.bin', 'jest'), '--runInBand'];
}

// Display test configuration
console.log('🧪 CHIM Sales - Test Runner');
console.log('============================');
console.log(`Mode: ${isWatch ? 'Watch' : isCoverage ? 'Coverage' : isCI ? 'CI' : isDebug ? 'Debug' : 'Standard'}`);
console.log(`Command: ${jestArgs.join(' ')}`);
console.log('');

// Run tests
const testProcess = spawn(jestArgs[0], jestArgs.slice(1), {
  stdio: 'inherit',
  cwd: __dirname,
  env: {
    ...process.env,
    NODE_ENV: 'test',
    FORCE_COLOR: 'true'
  }
});

// Handle process exit
testProcess.on('close', (code) => {
  console.log('');
  if (code === 0) {
    console.log('✅ All tests passed successfully!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please check the output above.');
    process.exit(code);
  }
});

// Handle process errors
testProcess.on('error', (error) => {
  console.error('❌ Failed to start test process:', error.message);
  process.exit(1);
});

// Handle process interruption
process.on('SIGINT', () => {
  console.log('\n🛑 Tests interrupted by user');
  testProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Tests terminated');
  testProcess.kill('SIGTERM');
});
