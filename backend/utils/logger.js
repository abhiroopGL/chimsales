// Simple logger utility
const logger = {
    error: (message, data = null) => {
        const timestamp = new Date().toISOString();
        if (data) {
            console.error(`[ERROR] ${timestamp} ${message}`, data);
        } else {
            console.error(`[ERROR] ${timestamp} ${message}`);
        }
    },
    
    warn: (message, data = null) => {
        const timestamp = new Date().toISOString();
        if (data) {
            console.warn(`[WARN] ${timestamp} ${message}`, data);
        } else {
            console.warn(`[WARN] ${timestamp} ${message}`);
        }
    },
    
    info: (message, data = null) => {
        const timestamp = new Date().toISOString();
        if (data) {
            console.info(`[INFO] ${timestamp} ${message}`, data);
        } else {
            console.info(`[INFO] ${timestamp} ${message}`);
        }
    },
    
    debug: (message, data = null) => {
        if (process.env.NODE_ENV !== 'production') {
            const timestamp = new Date().toISOString();
            if (data) {
                console.log(`[DEBUG] ${timestamp} ${message}`, data);
            } else {
                console.log(`[DEBUG] ${timestamp} ${message}`);
            }
        }
    },
    
    // Log HTTP requests
    request: (req, res, duration) => {
        const logData = {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            userId: req.user?.id || 'anonymous'
        };
        
        if (res.statusCode >= 400) {
            logger.warn('HTTP Request', logData);
        } else {
            logger.info('HTTP Request', logData);
        }
    },
    
    // Log database operations
    db: (operation, table, duration, success = true) => {
        const level = success ? 'info' : 'error';
        const message = `Database ${operation} on ${table}`;
        const data = { operation, table, duration: `${duration}ms`, success };
        
        logger[level](message, data);
    },
    
    // Log authentication events
    auth: (event, userId, success = true, details = null) => {
        const level = success ? 'info' : 'warn';
        const message = `Authentication: ${event}`;
        const data = { event, userId, success, ...details };
        
        logger[level](message, data);
    },
    
    // Log business events
    business: (event, data = null) => {
        logger.info(`Business Event: ${event}`, data);
    }
};

module.exports = logger;
