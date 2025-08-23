# CHIM Sales - Technical Documentation

## 🏗️ **Architecture Overview**

### **Frontend Architecture**
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Tailwind CSS with custom components
- **Routing**: React Router v6
- **Build Tool**: Vite for fast development and optimized builds

### **Backend Architecture**
- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with secure HTTP-only cookies
- **File Storage**: Cloudinary for image management
- **Real-time**: Socket.IO for notifications

## 🔒 **Security Features Implemented**

### **1. Rate Limiting**
```javascript
// Configurable rate limiting per endpoint
const rateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
```

### **2. Security Headers (Helmet.js)**
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Basic XSS protection
- **Strict-Transport-Security**: Enforces HTTPS
- **Content-Security-Policy**: Controls resource loading

### **3. Input Sanitization**
```javascript
// Sanitizes user input to prevent XSS and injection attacks
const sanitizeInput = (req, res, next) => {
  // Removes potentially dangerous characters
  // Escapes HTML entities
  // Validates input types
};
```

### **4. CORS Configuration**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### **5. JWT Security**
- **HTTP-Only Cookies**: Prevents XSS attacks on tokens
- **Secure Flag**: Ensures HTTPS-only transmission
- **SameSite**: Prevents CSRF attacks
- **Expiration**: Configurable token lifetime

## 🚀 **Loading System Implementation**

### **Global Loading State**
```javascript
// Custom event system to avoid circular dependencies
const loadingEvents = {
  start: (text = 'Loading...') => {
    window.dispatchEvent(new CustomEvent('loading:start', { detail: { text } }));
  },
  stop: () => {
    window.dispatchEvent(new CustomEvent('loading:stop'));
  }
};
```

### **Redux Integration**
```javascript
// Loading slice manages global loading state
const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false,
    loadingText: 'Loading...',
    loadingRequests: 0
  },
  reducers: {
    startLoading: (state, action) => {
      state.loadingRequests += 1;
      state.isLoading = true;
      state.loadingText = action.payload || 'Loading...';
    },
    stopLoading: (state) => {
      state.loadingRequests = Math.max(0, state.loadingRequests - 1);
      if (state.loadingRequests === 0) {
        state.isLoading = false;
      }
    }
  }
});
```

### **Usage in Components**
```javascript
// Automatically shows/hides loader for all API requests
const GlobalLoader = () => {
  const { isLoading, loadingText } = useSelector((state) => state.loading);
  
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div className="text-lg font-medium">{loadingText}</div>
      </div>
    </div>
  );
};
```

## 🛡️ **Error Handling System**

### **Custom Error Classes**
```javascript
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
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}
```

### **Global Error Handler**
```javascript
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production error response
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Programming or unknown errors
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
};
```

### **Async Error Wrapper**
```javascript
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage in routes
router.get('/products', asyncHandler(async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
}));
```

## 📡 **Real-time Notification System**

### **Socket.IO Implementation**
```javascript
// Backend setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  }
});

// Notification service
const notificationService = {
  subscribe: (userId, socketId) => {
    // Store user-socket mapping
  },
  
  sendNotification: (userId, notification) => {
    // Send real-time notification
    io.to(socketId).emit('notification', notification);
  }
};
```

### **Frontend Integration**
```javascript
// Socket connection and event handling
useEffect(() => {
  const socket = io(process.env.VITE_API_URL || 'http://localhost:8000', {
    withCredentials: true
  });

  socket.on('notification', (notification) => {
    dispatch(showNotification({
      type: notification.type,
      message: notification.message
    }));
  });

  return () => socket.disconnect();
}, []);
```

## 🧪 **Testing Infrastructure**

### **Backend Testing (Jest + Supertest)**
```javascript
// Test configuration
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js']
};

// Example test
describe('Security Middleware', () => {
  test('should apply rate limiting', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);
    
    expect(response.headers).toHaveProperty('x-ratelimit-limit');
  });
});
```

### **Test Coverage Areas**
- ✅ Security middleware (rate limiting, headers, sanitization)
- ✅ Error handling (custom errors, middleware, async wrapper)
- ✅ Loading system (Redux state, event listeners)
- ✅ Notification system (Socket.IO, Redux integration)
- ✅ API endpoints (authentication, products, orders)

## 🚀 **Production Deployment Guide**

### **Environment Variables**
```bash
# Backend (.env)
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://yourdomain.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend (.env)
VITE_API_URL=https://api.yourdomain.com
```

### **Security Checklist**
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables properly configured
- [ ] Database connection secured
- [ ] Rate limiting configured for production
- [ ] Error logging and monitoring enabled
- [ ] Regular security updates and patches

### **Performance Optimization**
- [ ] Database indexing for frequently queried fields
- [ ] Image optimization and CDN usage
- [ ] API response caching where appropriate
- [ ] Frontend bundle optimization with Vite
- [ ] Database connection pooling

## 📊 **Monitoring and Logging**

### **Structured Logging**
```javascript
const logger = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    }));
  },
  
  error: (message, error = {}, meta = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      error: error.message,
      stack: error.stack,
      ...meta
    }));
  }
};
```

### **Health Check Endpoint**
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

## 🔧 **Development Setup**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

### **Installation**
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### **Database Setup**
```bash
# Run migrations
npx sequelize-cli db:migrate

# Seed data (if available)
npx sequelize-cli db:seed:all
```

## 📈 **Future Enhancements**

### **Planned Features**
1. **Advanced Analytics Dashboard**
   - Sales performance metrics
   - Customer behavior analysis
   - Inventory optimization insights

2. **Multi-language Support**
   - Internationalization (i18n)
   - RTL language support
   - Localized content

3. **Advanced Security**
   - Two-factor authentication (2FA)
   - IP whitelisting
   - Advanced threat detection

4. **Performance Improvements**
   - Redis caching layer
   - GraphQL API
   - Service worker for offline support

5. **Mobile App**
   - React Native application
   - Push notifications
   - Offline-first architecture

## 🆘 **Troubleshooting**

### **Common Issues**
1. **Circular Dependency Error**
   - Solution: Use service layer pattern
   - Avoid importing store in slices

2. **CORS Issues**
   - Check FRONTEND_URL environment variable
   - Verify credentials configuration

3. **Database Connection**
   - Verify DATABASE_URL format
   - Check PostgreSQL service status

4. **JWT Token Issues**
   - Clear browser cookies
   - Verify JWT_SECRET configuration

## 📞 **Support and Maintenance**

### **Contact Information**
- **Technical Support**: [Your Email]
- **Documentation**: [Repository Wiki]
- **Issue Tracking**: [GitHub Issues]

### **Maintenance Schedule**
- **Security Updates**: Monthly
- **Dependency Updates**: Bi-weekly
- **Performance Reviews**: Quarterly
- **Backup Verification**: Weekly

---

*This documentation is maintained by the CHIM Sales development team. Last updated: [Current Date]*
