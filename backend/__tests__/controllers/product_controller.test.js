const request = require('supertest');
const { app } = require('../../server');

// Mock cloudinary
jest.mock('../../config/cloudinary', () => ({
  uploader: {
    upload: jest.fn().mockResolvedValue({
      secure_url: 'https://example.com/image.jpg',
      public_id: 'test_public_id'
    }),
    destroy: jest.fn().mockResolvedValue(true)
  }
}));

describe('Product Controller', () => {
  let adminToken, userToken;
  let Product, ProductImage;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Get the mocked models
    const models = require('../../models');
    Product = models.Product;
    ProductImage = models.ProductImage;
    
    // Generate test tokens
    adminToken = global.testUtils.generateTestToken(1, 'admin');
    userToken = global.testUtils.generateTestToken(2, 'user');

    // Mock sequelize transaction
    const mockTransaction = {
      commit: jest.fn().mockResolvedValue(true),
      rollback: jest.fn().mockResolvedValue(true)
    };
    Product.sequelize.transaction.mockResolvedValue(mockTransaction);
    
    // Mock cloudinary
    const cloudinary = require('../../config/cloudinary');
    cloudinary.uploader.upload.mockResolvedValue({
      secure_url: 'https://example.com/image.jpg',
      public_id: 'test_public_id'
    });
    cloudinary.uploader.destroy.mockResolvedValue(true);
  });

  describe('GET /api/products/public', () => {
    it('should return all public products', async () => {
      const mockProducts = [
        global.testUtils.createTestProduct({ id: 1, status: 'published', deleted: false }),
        global.testUtils.createTestProduct({ id: 2, status: 'published', deleted: false })
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/products/public')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });

    it('should return empty array when no products exist', async () => {
      Product.findAll.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/products/public')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/products/featured', () => {
    it('should return featured products', async () => {
      const mockProducts = [
        global.testUtils.createTestProduct({ id: 1, featured: true, status: 'published', deleted: false })
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/products/featured')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/products/find/:id', () => {
    it('should return product by ID', async () => {
      const mockProduct = global.testUtils.createTestProduct({ id: 1, status: 'published', deleted: false });
      Product.findByPk.mockResolvedValue(mockProduct);

      const response = await request(app)
        .get('/api/products/find/1')
        .expect(200);

      expect(response.body).toEqual(mockProduct);
    });

    it('should return 404 for non-existent product', async () => {
      Product.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/products/find/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });
  });

  describe('GET /api/products/admin (Admin Only)', () => {
    it('should return all products for admin', async () => {
      const mockProducts = [
        global.testUtils.createTestProduct({ id: 1 }),
        global.testUtils.createTestProduct({ id: 2 })
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/products/admin')
        .set('Cookie', `token=${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get('/api/products/admin')
        .set('Cookie', `token=${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. Admins only.');
    });

    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .get('/api/products/admin')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/products/create (Admin Only)', () => {
    it('should create new product successfully', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test description',
        price: 99.99,
        stock: 10,
        featured: false,
        category: 'test'
      };

      const mockProduct = { id: 3, ...productData };
      Product.create.mockResolvedValue(mockProduct);
      Product.findByPk.mockResolvedValue(mockProduct);

      const response = await request(app)
        .post('/api/products/create')
        .set('Cookie', `token=${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.product).toHaveProperty('id', 3);
      expect(response.body.product.name).toBe(productData.name);
    });

    it('should return 403 for non-admin users', async () => {
      const productData = { name: 'Test Product' };

      const response = await request(app)
        .post('/api/products/create')
        .set('Cookie', `token=${userToken}`)
        .send(productData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. Admins only.');
    });

    it('should return error for invalid product data', async () => {
      // Mock Product.create to throw an error
      Product.create.mockRejectedValue(new Error('Validation error'));

      const response = await request(app)
        .post('/api/products/create')
        .set('Cookie', `token=${adminToken}`)
        .send({})
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });
  });

  describe('PUT /api/products/update/:id (Admin Only)', () => {
    it('should update product successfully', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 299.99,
        imagesToDelete: null // Add this to prevent undefined error
      };

      const existingProduct = global.testUtils.createTestProduct({ id: 1 });
      const updatedProduct = { ...existingProduct, ...updateData };

      // Mock the transaction
      const mockTransaction = {
        commit: jest.fn().mockResolvedValue(true),
        rollback: jest.fn().mockResolvedValue(true)
      };
      Product.sequelize.transaction.mockResolvedValue(mockTransaction);

      // Mock Product.findByPk calls
      Product.findByPk
        .mockResolvedValueOnce(existingProduct) // First call for existing product
        .mockResolvedValueOnce(updatedProduct); // Second call for updated product

      // Mock ProductImage operations
      ProductImage.findAll.mockResolvedValue([]);
      ProductImage.bulkCreate.mockResolvedValue([]);

      // Mock the existingProduct.update method
      existingProduct.update = jest.fn().mockResolvedValue(updatedProduct);

      try {
        const response = await request(app)
          .put('/api/products/update/1')
          .set('Cookie', `token=${adminToken}`)
          .send(updateData);

        // Log the response for debugging
        console.log('Response status:', response.status);
        console.log('Response body:', response.body);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Product updated successfully');
        expect(response.body.product).toEqual(updatedProduct);
      } catch (error) {
        console.error('Test error:', error);
        throw error;
      }
    });

    it('should return 404 for non-existent product', async () => {
      // Mock the transaction
      const mockTransaction = {
        commit: jest.fn().mockResolvedValue(true),
        rollback: jest.fn().mockResolvedValue(true)
      };
      Product.sequelize.transaction.mockResolvedValue(mockTransaction);

      Product.findByPk.mockResolvedValue(null);

      const updateData = { 
        name: 'Updated Product',
        imagesToDelete: null
      };

      const response = await request(app)
        .put('/api/products/update/999')
        .set('Cookie', `token=${adminToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });
  });

  describe('DELETE /api/products/delete/:id (Admin Only)', () => {
    it('should delete product successfully', async () => {
      const existingProduct = global.testUtils.createTestProduct({ id: 1, deleted: false });
      existingProduct.update = jest.fn().mockResolvedValue({ ...existingProduct, deleted: true });
      Product.findByPk.mockResolvedValue(existingProduct);

      const response = await request(app)
        .delete('/api/products/delete/1')
        .set('Cookie', `token=${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product deleted successfully (soft delete)');
    });

    it('should return 404 for non-existent product', async () => {
      Product.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/products/delete/999')
        .set('Cookie', `token=${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });
  });

  describe('PATCH /api/products/restore/:id (Admin Only)', () => {
    it('should restore deleted product successfully', async () => {
      const existingProduct = global.testUtils.createTestProduct({ id: 1, deleted: true });
      existingProduct.update = jest.fn().mockResolvedValue({ ...existingProduct, deleted: false });
      Product.findByPk.mockResolvedValue(existingProduct);

      const response = await request(app)
        .patch('/api/products/restore/1')
        .set('Cookie', `token=${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product restored successfully');
    });
  });
});
