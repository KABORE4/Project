require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/Auth');
const { authorize } = require('./middleware/Authorization');
require('express-async-errors');

// Import models (this also initializes associations)
require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const plotRoutes = require('./routes/plotRoutes');
const harvestRoutes = require('./routes/harvestRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const equipmentBookingRoutes = require('./routes/equipmentBookingRoutes');
const sharedExpenseRoutes = require('./routes/sharedExpenseRoutes');
const saleRoutes = require('./routes/saleRoutes');
const profitDistributionRoutes = require('./routes/profitDistributionRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: true, // Accept all origins for development
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // Debug pour les requêtes d'authentification
  if (req.path.includes('/auth/')) {
    console.log('\n=== DEBUG AUTH REQUEST ===');
    console.log('🔗 URL:', req.url);
    console.log('📝 Method:', req.method);
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    console.log('📋 Headers:', {
      'content-type': req.headers['content-type'],
      'origin': req.headers.origin,
      'user-agent': req.headers['user-agent']
    });
    console.log('========================\n');
  }
  
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cooperative Farming Management Platform API',
    version: '1.0.0',
    database: 'PostgreSQL',
    authentication: 'JWT',
    endpoints: {
      auth: '/api/auth',
      members: '/api/members',
      plots: '/api/plots',
      harvests: '/api/harvests',
      equipment: '/api/equipment',
      bookings: '/api/bookings',
      expenses: '/api/expenses',
      sales: '/api/sales',
      distributions: '/api/distributions',
      health: '/api/health'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Farming Cooperative Backend is running',
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL',
    authentication: 'JWT'
  });
});

// Public API Routes
app.use('/api/auth', authRoutes);

// Protected API Routes with authentication
app.use('/api/members', memberRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api/harvests', harvestRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bookings', equipmentBookingRoutes);
app.use('/api/expenses', sharedExpenseRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/distributions', profitDistributionRoutes);

// Root endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cooperative Farming Management Platform API',
    version: '1.0.0',
    database: 'PostgreSQL',
    authentication: 'JWT',
    endpoints: {
      auth: '/api/auth',
      members: '/api/members',
      plots: '/api/plots',
      harvests: '/api/harvests',
      equipment: '/api/equipment',
      bookings: '/api/bookings',
      expenses: '/api/expenses',
      sales: '/api/sales',
      distributions: '/api/distributions',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✓ PostgreSQL connected successfully');

    // Start listening
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API Documentation: http://localhost:${PORT}/api`);
      console.log(`✓ Health Check: http://localhost:${PORT}/api/health`);
      console.log(`✓ Authentication: JWT enabled`);
      console.log(`✓ Role-Based Access Control: Enabled`);
      console.log(`\nFeatures:`);
      console.log('  - REST API with 62+ endpoints');
      console.log('  - JWT Authentication');
      console.log('  - Role-based permissions (admin, treasurer, member)');
      console.log('  - PostgreSQL database');
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('✗ Unhandled Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;

