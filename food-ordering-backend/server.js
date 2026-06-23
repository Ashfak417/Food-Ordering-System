require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { autoSeed } = require('./utils/seeder');

// Routes
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const startServer = async () => {
  // Connect DB then auto-seed
  await connectDB();
  await autoSeed();

  const app = express();

  app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: '🚀 Foodie API is running', timestamp: new Date() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/food', foodRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/payment', paymentRoutes);
  app.use('/api/admin', adminRoutes);

  app.use((req, res) => res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` }));
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api\n`);
  });
};

startServer();
