require('dotenv').config()
const path = require("path");
const express = require('express');
const cors = require('cors');
const { connectDatabase } = require('./database');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user_routes');
const productRouter = require('./routes/product_routes');
const cartRouter = require('./routes/cart_routes');
const adminRouter = require('./routes/admin_routes');
const { authMiddleware } = require('./controllers/auth_controller')
// const {checkForAuthentication} = require("./middlewares/auth");

const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/chimsales';
const app = express();

connectDatabase(MONGODB_URL)
    .then(()=> {console.log('MongoDB connected successfully')})
    .catch((error)=>{console.error(`Error connecting to Database: ${error}`)});

app.use(express.json());
app.use(express.static(path.resolve('./public')))
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use('/api/auth', userRouter);
// app.use(authMiddleware);
console.log("Request received");
// app.use(checkForAuthentication);
app.use('/uploads', express.static('uploads'));
app.use('/api/products', productRouter);
app.use('/api/cart', authMiddleware, cartRouter);
app.use("/api/admin", adminRouter);

app.use((err, req, res, next) => {
    console.error('💥 Error caught:', err); // Full backtrace in console
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
});

app.listen(PORT, ()=> {console.log(`Express server started successfully on PORT: ${PORT}`)});