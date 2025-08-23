require('dotenv').config();
const path = require("path");
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');

console.log('✅ Basic imports successful');

// Import middleware
const { generalLimiter, authLimiter, securityHeaders, sanitizeInput } = require('./middleware/security');
console.log('✅ Security middleware imported');

// Import error handler middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
console.log('✅ Error handler middleware imported');

// Import Sequelize models
const { sequelize } = require('./models');
console.log('✅ Sequelize models imported');

// Import basic routes
const userRouter = require('./routes/user_routes');
const productRouter = require('./routes/product_routes');
const cartRouter = require('./routes/cart_routes');
const adminRouter = require('./routes/admin_routes');
const orderRouter = require('./routes/order_routes');
const invoiceRouter = require('./routes/invoice_routes');
const queryRouter = require('./routes/query_routes');
const bookingRouter = require('./routes/booking_routes');
const { authMiddleware } = require('./controllers/auth_controller');
const { admin } = require('./middleware/checkAdmin');
console.log('✅ All routes imported');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('✅ Express app and server created');



// Security middleware (apply early)
app.use(securityHeaders);
console.log('✅ Security headers applied');

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.resolve('./public')));
app.use(cookieParser());
console.log('✅ Basic middleware applied');

// Input sanitization
app.use(sanitizeInput);
console.log('✅ Input sanitization applied');

// Rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter);
console.log('✅ Rate limiting applied');

// CORS configuration
const allowedOrigin = process.env.CLIENT_ORIGIN;
app.use(cors({
    origin: function (origin, callback) {
        console.log('CORS origin:', origin);
        if (!origin) return callback(null, true);
        if (origin === allowedOrigin) {
            return callback(null, true);
        }
        return callback(new Error('CORS not allowed for this origin'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
console.log('✅ CORS applied');

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV
    });
});
console.log('✅ Health check route added');

// Basic routes
app.use('/api/auth', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', authMiddleware, cartRouter);
app.use('/api/admin', authMiddleware, admin, adminRouter);
app.use('/api/orders', admin, orderRouter);
app.use('/api/invoice', authMiddleware, admin, invoiceRouter);
app.use('/api/queries', queryRouter);
app.use('/api/booking', bookingRouter);
console.log('✅ All routes added');

// Simple test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});
console.log('✅ Test route added');

// Test error route for testing error handling middleware
app.get('/test-error', (req, res, next) => {
    const { error } = req.query;

    switch (error) {
        case 'AppError':
            const { AppError } = require('./middleware/errorHandler');
            const appError = new AppError('Test app error', 400);
            // Ensure stack trace is captured
            Error.captureStackTrace(appError, appError.constructor);
            next(appError);
            break;
        case 'ValidationError':
            const { ValidationError } = require('./middleware/errorHandler');
            next(new ValidationError('Validation failed'));
            break;
        case 'AuthenticationError':
            const { AuthenticationError } = require('./middleware/errorHandler');
            next(new AuthenticationError('Authentication failed'));
            break;
        case 'NotFoundError':
            const { NotFoundError } = require('./middleware/errorHandler');
            next(new NotFoundError('Resource'));
            break;
        case 'AsyncError':
            next(new Error('Async error occurred'));
            break;
        case 'DatabaseError':
            const dbError = new Error('Database connection failed');
            dbError.name = 'SequelizeConnectionError';
            next(dbError);
            break;
        case 'NoStatusError':
            const noStatusError = new Error('Error without status code');
            next(noStatusError);
            break;
        default:
            next(new Error('Unknown error type'));
    }
});
console.log('✅ Test error route added');

// 404 handler - must be before error handler
app.use(notFound);
console.log('✅ 404 handler added');

// Error handler
app.use(errorHandler);
console.log('✅ Error handler added');

console.log('�� Basic server setup completed successfully!');

// Only start the server if this file is run directly
if (require.main === module) {
    // Connect to Postgres and start server
    (async () => {
        try {
            await sequelize.authenticate();
            console.log('✅ Postgres connected successfully');

            // Optional: sync models in dev (not recommended in production)
            if (NODE_ENV !== 'production') {
                await sequelize.sync({ alter: true }); // updates tables to match models
                console.log('🔄 Database synced with models');
            }

            server.listen(PORT, () => {
                console.log(`🚀 Express server running on PORT: ${PORT}`);
                console.log(`🌍 Environment: ${NODE_ENV}`);
                console.log(`🔒 Security features enabled`);
                console.log(`🔒 Security features enabled`);
            });
        } catch (err) {
            console.error('❌ Unable to connect to Postgres:', err);
            process.exit(1);
        }
    })();
}

// Export for testing purposes
module.exports = { app, server };
