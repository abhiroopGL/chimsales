# CHIM Sales Application

A comprehensive e-commerce platform for metal and steel products with enhanced security, real-time notifications, and comprehensive error handling.

## 🚀 New Features Added

### 1. Global Loader
- Automatic loading indicator for all API requests
- Prevents multiple simultaneous requests
- Customizable loading text

### 2. Enhanced Security
- Rate limiting (100 requests/15min for general, 5/15min for auth)
- XSS protection and input sanitization
- Security headers with Helmet.js
- CORS protection

### 3. Real-time Notifications
- Socket.IO integration for live updates
- Notifications for new orders, bookings, low stock
- Admin dashboard real-time updates
- Offline notification storage

### 4. Comprehensive Error Handling
- Custom error classes with proper HTTP status codes
- Structured error logging
- Production-safe error responses
- Async error wrapper

### 5. Advanced Logging
- Multi-level logging (ERROR, WARN, INFO, DEBUG)
- Request/response logging
- Database operation tracking
- Business event logging

## 🛠️ Installation

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=security
```

### Test Coverage
- **Security Middleware**: Rate limiting, input sanitization, security headers
- **Error Handling**: Custom error classes, error handler middleware
- **Logging**: Logger utility functions
- **Notification Service**: Real-time notification management
- **Integration Tests**: Health endpoint, CORS, rate limiting

## 🔧 Configuration

### Environment Variables (Backend)
```bash
NODE_ENV=development
PORT=8000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

### Environment Variables (Frontend)
```bash
VITE_API_URL=http://localhost:8000
```

## 🚀 Running the Application

### Development Mode
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Production Mode
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## 📱 Features

### User Features
- Product browsing and search
- Shopping cart management
- Order placement and tracking
- User profile management
- Real-time notifications

### Admin Features
- Product management (CRUD)
- Order management
- User management
- Dashboard with analytics
- Real-time admin notifications

### Security Features
- JWT authentication
- Role-based access control
- Rate limiting
- Input validation and sanitization
- CORS protection

## 🔌 Real-time Features

### Socket.IO Events
- `notification` - General user notifications
- `adminNotification` - Admin-specific notifications
- `pendingNotifications` - Offline notifications
- `markNotificationRead` - Mark notification as read

### Notification Types
- New orders
- New bookings
- Low stock alerts
- Payment confirmations
- System announcements

## 📊 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /api/products/public` - Public products
- `GET /api/products/featured` - Featured products
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Protected Endpoints
- `GET /api/cart` - User cart
- `POST /api/orders` - Create order
- `GET /api/profile` - User profile

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard
- `POST /api/products/create` - Create product
- `PUT /api/products/update/:id` - Update product
- `DELETE /api/products/delete/:id` - Delete product

## 🛡️ Security Measures

### Rate Limiting
- General API: 100 requests per 15 minutes
- Authentication: 5 attempts per 15 minutes
- Configurable limits per endpoint

### Input Validation
- XSS protection
- SQL injection prevention
- File upload validation
- Request size limits

### Headers
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

## 📝 Logging

### Log Levels
- **ERROR**: Application errors and failures
- **WARN**: Warning conditions
- **INFO**: General information and requests
- **DEBUG**: Debug information (development only)

### Log Categories
- HTTP requests and responses
- Database operations
- Authentication events
- Business events
- System events

## 🚨 Error Handling

### Error Types
- **ValidationError** (400) - Invalid input data
- **AuthenticationError** (401) - Invalid credentials
- **AuthorizationError** (403) - Insufficient permissions
- **NotFoundError** (404) - Resource not found
- **ConflictError** (409) - Resource conflicts
- **AppError** (500) - Internal server errors

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "details": {
    "name": "ErrorType",
    "statusCode": 400,
    "isOperational": true
  }
}
```

## 🔄 State Management

### Redux Slices
- **authorization**: User authentication state
- **products**: Product catalog management
- **cart**: Shopping cart state
- **orders**: Order management
- **notifications**: Notification system
- **loading**: Global loading state

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS for styling
- Responsive navigation
- Touch-friendly interfaces

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📚 Documentation

- [Technical Documentation](./TECHNICAL_DOCUMENTATION.md)
- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT.md)
- API documentation in code comments
- Component documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the test cases
- Open an issue on GitHub

---

**Note**: This application is production-ready with comprehensive security, error handling, and real-time features. Follow the production deployment guide for secure deployment.
