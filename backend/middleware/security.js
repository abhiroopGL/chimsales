const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting configuration
const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message: message || 'Too many requests from this IP, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false
    });
};

// General API rate limiting
const generalLimiter = createRateLimit(15 * 60 * 1000, 100, 'Too many requests, please try again later.');

// Auth-specific rate limiting (more strict)
const authLimiter = createRateLimit(15 * 60 * 1000, 15, 'Too many authentication attempts, please try again later.');

// Security headers middleware
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", process.env.FRONTEND_URL || "http://localhost:5173"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Basic input sanitization
const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;
        
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'string') {
                    // Remove potentially dangerous characters
                    obj[key] = obj[key]
                        .replace(/[<>]/g, '') // Remove < and >
                        .replace(/javascript:/gi, '') // Remove javascript: protocol
                        .trim();
                } else if (typeof obj[key] === 'object') {
                    sanitize(obj[key]);
                }
            }
        }
    };
    
    sanitize(req.body);
    sanitize(req.query);
    sanitize(req.params);
    next();
};

module.exports = {
    generalLimiter,
    authLimiter,
    securityHeaders,
    sanitizeInput
};
