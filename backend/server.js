require('dotenv').config();
const path = require("path");
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler')

// Import Sequelize models
const { sequelize } = require('./models'); // automatically picks up models/index.js

// Import routes
const userRouter = require('./routes/user_routes');
const productRouter = require('./routes/product_routes');
const cartRouter = require('./routes/cart_routes');
const adminRouter = require('./routes/admin_routes');
const orderRouter = require('./routes/order_routes');
const invoiceRouter = require('./routes/invoice_routes');
const queriesRouter = require('./routes/query_routes');
const bookingRouter = require('./routes/booking_routes');

// Import auth middleware
const { authMiddleware } = require('./controllers/auth_controller');

const PORT = process.env.PORT || 8000;
// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.resolve('./public')));
app.use(cookieParser());
app.use(cors({
    origin: '*',
    credentials: true,
}));

// Routes
app.use('/api/auth', userRouter);
// app.use(authMiddleware); // can enable for protected routes
app.use('/uploads', express.static('uploads'));
app.use('/api/products', productRouter);
app.use('/api/cart', authMiddleware, cartRouter);
app.use("/api/admin", adminRouter);
app.use("/api/orders", orderRouter);
app.use("/api/invoice", authMiddleware, invoiceRouter);
app.use('/api/queries', queriesRouter);
app.use('/api/booking', bookingRouter);


app.use(errorHandler)

// Error handler
app.use((err, req, res, next) => {
    console.error('💥 Error caught:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
});

// Connect to Postgres and start server
(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Postgres connected successfully');

        // Optional: sync models in dev (not recommended in production)
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync({ alter: true }); // updates tables to match models
            console.log('🔄 Database synced with models');
        }

        app.listen(PORT, () => {
            console.log(`🚀 Express server running on PORT: ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Unable to connect to Postgres:', err);
    }
})();
