const request = require('supertest');
const { app } = require('../../server');
const { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  NotFoundError,
  asyncHandler 
} = require('../../middleware/errorHandler');

describe('Error Handling Middleware', () => {
  describe('Custom Error Classes', () => {
    it('should handle AppError correctly', async () => {
      const response = await request(app)
        .get('/test-error')
        .query({ error: 'AppError' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Test app error');
      expect(response.body.details).toHaveProperty('statusCode', 400);
      expect(response.body.details).toHaveProperty('isOperational', true);
    });

    it('should handle ValidationError correctly', async () => {
      const response = await request(app)
        .get('/test-error')
        .query({ error: 'ValidationError' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.details.statusCode).toBe(400);
    });

    it('should handle AuthenticationError correctly', async () => {
      const response = await request(app)
        .get('/test-error')
        .query({ error: 'AuthenticationError' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Authentication failed');
      expect(response.body.details.statusCode).toBe(401);
    });

    it('should handle NotFoundError correctly', async () => {
      const response = await request(app)
        .get('/test-error')
        .query({ error: 'NotFoundError' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Resource not found');
      expect(response.body.details.statusCode).toBe(404);
    });
  });

  describe('Async Error Wrapper', () => {
    it('should catch async errors and pass them to error handler', async () => {
      const response = await request(app)
        .get('/test-error')
        .query({ error: 'AsyncError' })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Async error occurred');
    });

    it('should handle database errors gracefully', async () => {
      const response = await request(app)
        .get('/test-error')
        .query({ error: 'DatabaseError' })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Database connection failed');
    });
  });

  describe('Not Found Handler', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/undefined-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Route /undefined-route not found');
    });

    it('should return 404 for unsupported methods', async () => {
      const response = await request(app)
        .post('/health')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Route /health not found');
    });
  });

  describe('Error Response Format', () => {
    it('should return consistent error response structure', async () => {
      const response = await request(app)
        .get('/test-error')
        .query({ error: 'AppError' })
        .expect(400);

      // Check response structure
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details).toHaveProperty('statusCode');
      expect(response.body.details).toHaveProperty('isOperational');
    });

    it('should handle errors without status code', async () => {
      const response = await request(app)
        .get('/test-error')
        .query({ error: 'NoStatusError' })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error without status code');
      // Regular Error objects don't have statusCode, so it defaults to 500
      expect(response.body.details.statusCode).toBe(500);
    });
  });

  describe('Development vs Production Error Handling', () => {
    it('should include stack trace in development', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const response = await request(app)
        .get('/test-error')
        .query({ error: 'AppError' })
        .expect(400);

      expect(response.body).toHaveProperty('stack');
      expect(response.body.stack).toContain('Test app error');

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const response = await request(app)
        .get('/test-error')
        .query({ error: 'AppError' })
        .expect(400);

      expect(response.body).not.toHaveProperty('stack');
      expect(response.body.message).toBe('Test app error');

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Logging', () => {
    it('should log errors to console', async () => {
      // Create a spy for console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await request(app)
        .get('/test-error')
        .query({ error: 'AppError' })
        .expect(400);

      // Check that console.error was called
      expect(consoleSpy).toHaveBeenCalled();

      // Restore console.error
      consoleSpy.mockRestore();
    });
  });
});
