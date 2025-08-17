// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error('💥 Error caught:', err);

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
};
