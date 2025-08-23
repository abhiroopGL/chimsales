const request = require('supertest');
const { app } = require('../../server');
const { Invoice, InvoiceItem, User } = require('../../models');

// Mock the models
jest.mock('../../models', () => ({
  Invoice: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
    bulkCreate: jest.fn(),
    findOne: jest.fn()
  },
  InvoiceItem: {
    create: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn()
  },
  User: {
    findByPk: jest.fn()
  }
}));

describe('Invoice Controller', () => {
  let mockInvoice;
  let mockInvoiceItems;
  let mockInvoices;
  let adminToken;
  let userToken;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockInvoice = {
      id: 1,
      invoiceNumber: 'INV-001',
      customerName: 'Test Customer',
      customerEmail: 'customer@example.com',
      customerPhone: '+1234567890',
      subtotal: 199.98,
      taxAmount: 19.99,
      total: 229.97,
      status: 'draft',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockInvoiceItems = [
      {
        id: 1,
        productName: 'Test Product 1',
        description: 'Test description 1',
        quantity: 2,
        unitPrice: 99.99,
        total: 199.98
      }
    ];

    mockInvoices = [mockInvoice, { ...mockInvoice, id: 2, invoiceNumber: 'INV-002' }];

    adminToken = global.testUtils.generateTestToken(1, 'admin');
    userToken = global.testUtils.generateTestToken(2, 'user');
  });

  describe('GET /api/invoice (Admin Only)', () => {
    it('should return all invoices for admin', async () => {
      Invoice.count.mockResolvedValue(2);
      Invoice.findAll.mockResolvedValue(mockInvoices);

      const response = await request(app)
        .get('/api/invoice')
        .set('Cookie', `token=${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.invoices).toHaveLength(2);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get('/api/invoice')
        .set('Cookie', `token=${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. Admins only.');
    });
  });

  describe('GET /api/invoice/:id', () => {
    it('should return invoice by ID', async () => {
      Invoice.findByPk.mockResolvedValue({ ...mockInvoice, items: mockInvoiceItems });

      const response = await request(app)
        .get('/api/invoice/1')
        .set('Cookie', `token=${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.invoice).toHaveProperty('id', 1);
      expect(response.body.invoice.invoiceNumber).toBe('INV-001');
    });

    it('should return 404 for non-existent invoice', async () => {
      Invoice.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/invoice/999')
        .set('Cookie', `token=${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invoice not found');
    });
  });

  describe('POST /api/invoice (Admin Only)', () => {
    it('should create new invoice successfully', async () => {
      // Mock Invoice.findOne to return the last invoice for number generation
      Invoice.findOne.mockResolvedValue({ id: 2, invoiceNumber: 'INV-002' });
      
      // Mock Invoice.create to handle the association include
      Invoice.create.mockImplementation((data, options) => {
        // Simulate creating an invoice with items
        const createdInvoice = { 
          ...data, 
          id: 3, 
          invoiceNumber: 'INV-003',
          items: data.items || []
        };
        return Promise.resolve(createdInvoice);
      });

      const response = await request(app)
        .post('/api/invoice')
        .set('Cookie', `token=${adminToken}`)
        .send({ customerName: 'New Customer', total: 100 })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.invoice).toHaveProperty('id', 3);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .post('/api/invoice')
        .set('Cookie', `token=${userToken}`)
        .send({ customerName: 'New Customer', total: 100 })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. Admins only.');
    });
  });

  describe('PUT /api/invoice/:id (Admin Only)', () => {
    it('should update invoice successfully', async () => {
      Invoice.update.mockResolvedValue([1, [{ ...mockInvoice, customerName: 'Updated' }]]);
      Invoice.findByPk.mockResolvedValue({ ...mockInvoice, items: mockInvoiceItems });

      const response = await request(app)
        .put('/api/invoice/1')
        .set('Cookie', `token=${adminToken}`)
        .send({ customerName: 'Updated' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 for non-existent invoice', async () => {
      Invoice.update.mockResolvedValue([0, []]);

      const response = await request(app)
        .put('/api/invoice/999')
        .set('Cookie', `token=${adminToken}`)
        .send({ customerName: 'Updated' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invoice not found');
    });
  });

  describe('DELETE /api/invoice/:id (Admin Only)', () => {
    it('should delete invoice successfully', async () => {
      Invoice.destroy.mockResolvedValue(1);

      const response = await request(app)
        .delete('/api/invoice/1')
        .set('Cookie', `token=${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 for non-existent invoice', async () => {
      Invoice.destroy.mockResolvedValue(0);

      const response = await request(app)
        .delete('/api/invoice/999')
        .set('Cookie', `token=${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invoice not found');
    });
  });

//   describe('GET /api/invoice/:id/download', () => {
//     it('should download invoice as HTML', async () => {
//       Invoice.findByPk.mockResolvedValue({ ...mockInvoice, items: mockInvoiceItems });

//       const response = await request(app)
//         .get('/api/invoice/1/download')
//         .set('Cookie', `token=${adminToken}`)
//         .expect(200);

//       expect(response.headers['content-type']).toContain('text/html');
//       expect(response.text).toContain('INV-001');
//     });
//   });

//   describe('GET /api/invoice/:id/download-pdf', () => {
//     it('should download invoice as PDF (falls back to HTML)', async () => {
//       Invoice.findByPk.mockResolvedValue({ ...mockInvoice, items: mockInvoiceItems });

//       const response = await request(app)
//         .get('/api/invoice/1/download-pdf')
//         .set('Cookie', `token=${adminToken}`)
//         .expect(200);

//       expect(response.headers['content-type']).toContain('text/html');
//     });
//   });
});
