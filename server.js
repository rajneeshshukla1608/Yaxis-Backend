import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectDB from './config/database.js';
import config from './config/env.js';
import cookieParser from 'cookie-parser';

// Import routes
import productRoutes from './services/product-service/routes/productRoutes.js';
import cartRoutes from './services/cart-service/routes/cartRoutes.js';
import checkoutRoutes from './services/payment-service/routes/checkoutRoutes.js';
import authRoutes from './services/auth-service/routes/authRoutes.js';

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware for cart management
app.use(session({
  secret: config.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Add this to handle CORS with credentials
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Visa Immigration Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// // 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Products API: http://localhost:${PORT}/api/products`);
  console.log(`Cart API: http://localhost:${PORT}/api/cart`);
  console.log(`Checkout API: http://localhost:${PORT}/api/checkout`);
  console.log(`Auth API: http://localhost:${PORT}/api/auth`);
});