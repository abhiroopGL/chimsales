# 🧪 CHIM Sales - Testing Documentation

## 📋 **Table of Contents**
1. [Overview](#overview)
2. [Test Structure](#test-structure)
3. [How Tests Work](#how-tests-work)
4. [Test Flow](#test-flow)
5. [Writing New Tests](#writing-new-tests)
6. [Running Tests](#running-tests)
7. [Continuous Integration](#continuous-integration)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## 🎯 **Overview**

This document explains the testing architecture for the CHIM Sales backend application. We use **Jest** as our testing framework and **Supertest** for HTTP assertions. All tests are organized by controller/route to ensure easy maintenance and clear separation of concerns.

### **Testing Stack**
- **Framework**: Jest (JavaScript testing framework)
- **HTTP Testing**: Supertest (HTTP assertions)
- **Mocking**: Jest built-in mocking
- **Coverage**: Jest coverage reports
- **Database**: SQLite in-memory for testing

## 🏗️ **Test Structure**

```
backend/__tests__/
├── setup.js                           # Global test configuration
├── controllers/                       # Controller-specific tests
│   ├── auth_controller.test.js       # Authentication tests
│   ├── product_controller.test.js    # Product management tests
│   ├── invoice_controller.test.js    # Invoice management tests
│   ├── order_controller.test.js      # Order management tests
│   ├── cart_controller.test.js       # Shopping cart tests
│   ├── booking_controller.test.js    # Booking system tests
│   ├── queries_controller.test.js    # Customer queries tests
│   └── admin_controller.test.js      # Admin functionality tests
├── middleware/                        # Middleware tests
│   ├── security.test.js              # Security middleware tests
│   ├── errorHandler.test.js          # Error handling tests
│   └── checkAdmin.test.js            # Admin authorization tests
├── routes/                           # Route-specific tests
│   ├── auth_routes.test.js           # Auth route tests
│   ├── product_routes.test.js        # Product route tests
│   └── invoice_routes.test.js        # Invoice route tests
├── integration/                      # Integration tests
│   ├── health.test.js                # Health check tests
│   └── api_flow.test.js              # End-to-end API flow tests
└── utils/                           # Utility function tests
    ├── invoicePDFService.test.js     # PDF generation tests
    └── generate_token.test.js        # Token generation tests
```

## 🔄 **How Tests Work**

### **1. Test Setup (setup.js)**
```javascript
// Global test configuration
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.DATABASE_URL = 'sqlite::memory:';

// Global test utilities
global.testUtils = {
  generateTestToken: (userId, role) => { /* ... */ },
  createTestUser: (overrides) => { /* ... */ },
  mockRequest: (overrides) => { /* ... */ },
  mockResponse: () => { /* ... */ },
  mockNext: jest.fn()
};
```

### **2. Test Lifecycle**
```javascript
describe('Test Suite', () => {
  beforeEach(() => {
    // Runs before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Runs after each test
    // Clean up test data
  });

  afterAll(() => {
    // Runs after all tests in suite
    // Global cleanup
  });
});
```

### **3. Mocking Strategy**
```javascript
// Mock database models
jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  }
}));

// Use mocks in tests
User.findOne.mockResolvedValue(mockUser);
User.create.mockResolvedValue(newUser);
```

## 🔄 **Test Flow**

### **1. Test Execution Flow**
```
1. Jest starts up
   ↓
2. Loads setup.js (environment, utilities)
   ↓
3. Loads test files
   ↓
4. For each test file:
   - Mocks are set up
   - beforeEach runs
   - Individual tests execute
   - afterEach runs
   ↓
5. afterAll runs
   ↓
6. Coverage report generated
   ↓
7. Jest exits
```

### **2. Individual Test Flow**
```
1. Test starts
   ↓
2. beforeEach() executes
   ↓
3. Test function runs
   ↓
4. Assertions are made
   ↓
5. afterEach() executes
   ↓
6. Test completes
```

### **3. HTTP Test Flow**
```
1. Create test request
   ↓
2. Set headers/authentication
   ↓
3. Send request to app
   ↓
4. App processes request
   ↓
5. Response received
   ↓
6. Assertions made on response
```

## ✍️ **Writing New Tests**

### **1. Controller Test Template**
```javascript
const request = require('supertest');
const { app } = require('../../server');
const { ModelName } = require('../../models');

// Mock the models
jest.mock('../../models', () => ({
  ModelName: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  }
}));

describe('ModelName Controller', () => {
  let mockData;
  let adminToken;
  let userToken;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock data
    mockData = {
      id: 1,
      name: 'Test Item',
      // ... other properties
    };

    // Create tokens
    adminToken = global.testUtils.generateTestToken(1, 'admin');
    userToken = global.testUtils.generateTestToken(2, 'user');
  });

  describe('GET /api/endpoint', () => {
    it('should return data successfully', async () => {
      // Mock model method
      ModelName.findAll.mockResolvedValue([mockData]);

      // Make request
      const response = await request(app)
        .get('/api/endpoint')
        .expect(200);

      // Assertions
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    it('should handle errors gracefully', async () => {
      // Mock error
      ModelName.findAll.mockRejectedValue(new Error('Database error'));

      // Make request
      const response = await request(app)
        .get('/api/endpoint')
        .expect(500);

      // Assertions
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('error');
    });
  });
});
```

### **2. Middleware Test Template**
```javascript
const request = require('supertest');
const { app } = require('../../server');

describe('Middleware Name', () => {
  describe('Functionality', () => {
    it('should apply middleware correctly', async () => {
      // Test middleware behavior
      const response = await request(app)
        .get('/test-endpoint')
        .expect(200);

      // Check middleware effects
      expect(response.headers).toHaveProperty('expected-header');
    });

    it('should handle edge cases', async () => {
      // Test edge cases
      const response = await request(app)
        .get('/test-endpoint')
        .set('malicious-header', '<script>alert("xss")</script>')
        .expect(400);

      // Verify security measures
      expect(response.body.message).not.toContain('<script>');
    });
  });
});
```

### **3. Route Test Template**
```javascript
const request = require('supertest');
const { app } = require('../../server');

describe('Route Name', () => {
  describe('HTTP Methods', () => {
    it('should handle GET requests', async () => {
      const response = await request(app)
        .get('/api/route')
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('should handle POST requests', async () => {
      const data = { name: 'Test' };
      
      const response = await request(app)
        .post('/api/route')
        .send(data)
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should reject invalid methods', async () => {
      const response = await request(app)
        .patch('/api/route') // Method not supported
        .expect(404);

      expect(response.body.message).toBe('Route not found');
    });
  });
});
```

## 🚀 **Running Tests**

### **1. Basic Commands**
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- __tests__/controllers/auth_controller.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should login user"
```

### **2. Test Scripts (package.json)**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

### **3. Environment Variables**
```bash
# Test environment
NODE_ENV=test
JWT_SECRET=test-secret-key-for-testing-only
DATABASE_URL=sqlite::memory:
PORT=8001
```

## 🔄 **Continuous Integration**

### **1. Pre-commit Hook**
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test",
      "pre-push": "npm run test:coverage"
    }
  }
}
```

### **2. GitHub Actions Workflow**
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test:ci
      
    - name: Upload coverage
      uses: codecov/codecov-action@v1
```

### **3. Local Pre-commit Setup**
```bash
# Install husky
npm install --save-dev husky

# Install lint-staged
npm install --save-dev lint-staged

# Configure package.json
{
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "npm test -- --findRelatedTests"
    ]
  }
}
```

## ✅ **Best Practices**

### **1. Test Organization**
- **One test file per controller/route**
- **Group related tests with describe blocks**
- **Use descriptive test names**
- **Follow AAA pattern: Arrange, Act, Assert**

### **2. Mocking Guidelines**
- **Mock external dependencies (database, APIs)**
- **Don't mock internal functions**
- **Reset mocks between tests**
- **Use realistic mock data**

### **3. Assertion Best Practices**
- **Test one thing per test**
- **Use specific assertions**
- **Test both success and failure cases**
- **Verify response structure and content**

### **4. Test Data Management**
- **Use factory functions for test data**
- **Avoid hardcoded values**
- **Clean up test data after each test**
- **Use realistic but minimal data**

## 🐛 **Troubleshooting**

### **1. Common Issues**

#### **Test Timeout**
```javascript
// Increase timeout for specific test
it('should complete long operation', async () => {
  // Test code
}, 30000); // 30 seconds
```

#### **Mock Not Working**
```javascript
// Ensure mock is set up before test
beforeEach(() => {
  jest.clearAllMocks();
  User.findOne.mockResolvedValue(mockUser);
});
```

#### **Database Connection Issues**
```javascript
// Use in-memory SQLite for tests
process.env.DATABASE_URL = 'sqlite::memory:';
```

### **2. Debugging Tests**
```bash
# Run single test with verbose output
npm test -- --verbose --testNamePattern="specific test name"

# Run tests with console output
npm test -- --verbose --silent=false

# Debug specific test file
node --inspect-brk node_modules/.bin/jest --runInBand __tests__/controllers/auth_controller.test.js
```

### **3. Test Isolation Issues**
```javascript
// Ensure each test is independent
beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

afterEach(() => {
  // Clean up any global state
});
```

## 📊 **Test Coverage**

### **1. Coverage Goals**
- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

### **2. Coverage Reports**
```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/lcov-report/index.html
```

### **3. Coverage Configuration**
```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/server.js'
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90
    }
  }
};
```

## 🚀 **Next Steps**

1. **Run existing tests**: `npm test`
2. **Add new controller tests** following the template
3. **Set up pre-commit hooks** for automatic testing
4. **Configure CI/CD** for automated testing
5. **Monitor coverage** and improve test quality

---

*This documentation should help you understand, write, and maintain tests for the CHIM Sales application. For questions or improvements, refer to the Jest documentation or create an issue in the repository.*
