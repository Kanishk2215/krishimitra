require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectSQL, connectMongo } = require('./config/db');

// Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logger

// Database Connections
(async () => {
  try {
    // ✅ PostgreSQL connect
    await connectSQL();
    console.log('✅ PostgreSQL connected');

    // ❌ MongoDB production la skip
    if (process.env.NODE_ENV !== 'production') {
      await connectMongo();
      console.log('✅ MongoDB connected');
    } else {
      console.log('⚠️ MongoDB skipped (production)');
    }
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
})();

// Routes
app.get('/', (req, res) => {
  res.send('🌾 AgriFarm API is Running...');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
