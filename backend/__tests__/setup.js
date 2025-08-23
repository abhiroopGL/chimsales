// Test setup file for Jest
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.DATABASE_URL = 'sqlite::memory:';
process.env.PORT = '8001';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Increase timeout for database operations
jest.setTimeout(15000);

// Mock database models before importing server
jest.mock('../models', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true)
  },
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  Product: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
    sequelize: {
      transaction: jest.fn()
    }
  },
  ProductImage: {
    create: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    bulkCreate: jest.fn()
  },
  Invoice: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  InvoiceItem: {
    create: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    bulkCreate: jest.fn()
  },
  Order: {
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  Cart: {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  CartItem: {
    create: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn()
  },
  Booking: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  Query: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn()
  }
}));

// Mock InvoicePDFService
jest.mock('../utils/invoicePDFService', () => {
  return jest.fn().mockImplementation(() => ({
    generateInvoiceHTML: jest.fn().mockReturnValue('<html><body>Mock Invoice HTML</body></html>'),
    generatePDF: jest.fn().mockResolvedValue({
      needsPDFLibrary: true,
      pdf: null
    })
  }));
});

// Global test utilities
global.testUtils = {
  // Generate test JWT token
  generateTestToken: (userId = 1, role = 'user') => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  },

  // Create test user data
  createTestUser: (overrides = {}) => ({
    fullName: 'Test User',
    email: 'test@example.com',
    phoneNumber: '+1234567890',
    password: 'testpassword123',
    role: 'user',
    ...overrides
  }),

  // Create test product data
  createTestProduct: (overrides = {}) => ({
    name: 'Test Product',
    description: 'Test product description',
    price: 99.99,
    category: 'test-category',
    featured: false,
    ...overrides
  }),

  // Create test order data
  createTestOrder: (overrides = {}) => ({
    customerName: 'Test Customer',
    customerPhone: '+1234567890',
    customerEmail: 'customer@example.com',
    deliveryAddress: '123 Test St, Test City',
    total: 199.98,
    status: 'pending',
    ...overrides
  }),

  // Create test invoice data
  createTestInvoice: (overrides = {}) => ({
    invoiceNumber: 'INV-001',
    customerName: 'Test Customer',
    customerEmail: 'customer@example.com',
    customerPhone: '+1234567890',
    customerAddress: '123 Test St, Test City',
    subtotal: 199.98,
    taxAmount: 19.99,
    shippingCost: 10.00,
    totalAmount: 229.97,
    status: 'pending',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    ...overrides
  }),

  // Mock request object
  mockRequest: (overrides = {}) => ({
    body: {},
    params: {},
    query: {},
    headers: {},
    user: { userId: 1, role: 'user' },
    ...overrides
  }),

  // Mock response object
  mockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    return res;
  },

  // Mock next function
  mockNext: jest.fn(),

  // Clean up function
  cleanup: async () => {
    // Clean up any test data
    jest.clearAllMocks();
  }
};

// Before each test
beforeEach(async () => {
  // Reset all mocks
  jest.clearAllMocks();
  jest.resetAllMocks();
});

// After each test
afterEach(async () => {
  // Clean up after each test
  await global.testUtils.cleanup();
});

// After all tests
afterAll(async () => {
  // Clean up global test data
  jest.restoreAllMocks();
});
