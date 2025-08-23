// Custom error classes
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403);
        this.name = 'AuthorizationError';
    }
}

class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}

class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    
    // Preserve stack trace and other non-enumerable properties
    error.stack = err.stack;
    error.name = err.name;
    error.statusCode = err.statusCode;
    error.isOperational = err.isOperational;

    // Log error details
    console.error('Error occurred:', {
        error: {
            name: err.name,
            message: err.message,
            stack: err.stack,
            statusCode: err.statusCode || 500
        },
        request: {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            userId: req.user?.id || 'anonymous'
        },
        timestamp: new Date().toISOString()
    });

    // Sequelize errors
    if (err.name === 'SequelizeValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ValidationError(message);
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ConflictError(message);
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        error = new ValidationError('Referenced resource does not exist');
    }

    if (err.name === 'SequelizeDatabaseError') {
        error = new AppError('Database operation failed', 500);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new AuthenticationError('Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        error = new AuthenticationError('Token expired');
    }

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        error = new ValidationError('File too large');
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        error = new ValidationError('Too many files');
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        error = new ValidationError('Unexpected file field');
    }

    // Default error
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    // Ensure error object has statusCode for details
    error.statusCode = statusCode;

    // Don't send error stack in production
    const response = {
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && {
            stack: error.stack,
            details: {
                name: error.name,
                statusCode: error.statusCode,
                isOperational: error.isOperational
            }
        })
    };

    // Send error response
    res.status(statusCode).json(response);
};

// Async error wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Not found handler
const notFound = (req, res, next) => {
    const error = new NotFoundError(`Route ${req.originalUrl}`);
    next(error);
};

module.exports = {
    errorHandler,
    asyncHandler,
    notFound,
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError
};
