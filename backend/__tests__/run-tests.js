#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running CHIM Sales Backend Tests...\n');

try {
  // Run tests with coverage
  console.log('📊 Running tests with coverage...');
  execSync('npm run test:coverage', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('\n✅ All tests passed successfully!');
  console.log('📁 Coverage report generated in coverage/ directory');
  
} catch (error) {
  console.error('\n❌ Tests failed!');
  console.error('Error:', error.message);
  process.exit(1);
}
