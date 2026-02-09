require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const farmRoutes = require('./src/routes/farmRoutes');
const recommendationRoutes = require('./src/routes/recommendationRoutes');
const onlineRoutes = require('./src/routes/onlineRoutes');
const fertilizerRoutes = require('./src/routes/fertilizerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'https://krishimitra-frontend.vercel.app', 'https://krishimitra-frontend-giiqrk3ti-kanishkars-projects-78b63bcc.vercel.app'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

// ========================================
// ROUTES
// ========================================

app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/recommend', recommendationRoutes);
app.use('/api/online', onlineRoutes);
app.use('/api/fertilizer', fertilizerRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🌾 Krishimitra API is running...',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        database: sequelize ? 'connected' : 'disconnected',
        timestamp: new Date()
    });
});

// ========================================
// ERROR HANDLING
// ========================================

app.use((err, req, res, next) => {
    console.error('🔥 GLOBAL_ERROR:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
    });
});

// Crash Protection
process.on('uncaughtException', (err) => {
    console.error('💥 UNCAUGHT_EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🌋 UNHANDLED_REJECTION at:', promise, 'reason:', reason);
});

// ========================================
// DATABASE SYNC & SERVER START
// ========================================

const startServer = async () => {
    try {
        await connectDB();

        if (process.env.NODE_ENV === 'production') {
            console.log('📊 Production mode - verifying schema');
            await sequelize.sync({ alter: false });
        } else {
            console.log('📊 Development mode - syncing schema');
            await sequelize.sync({ force: false, alter: true });
        }

        console.log('✅ Database Synced & Ready');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`========================================`);
            console.log(`🚀 KRISHIMITRA BACKEND IS LIVE`);
            console.log(`🌐 URL: http://127.0.0.1:${PORT}`);
            console.log(`📡 Status: LISTENING FOR REQUESTS`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`========================================`);
        });
    } catch (error) {
        console.error('❌ Server startup failed:', error);
        setTimeout(startServer, 5000);
    }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing server...');
    await sequelize.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, closing server...');
    await sequelize.close();
    process.exit(0);
});

startServer();

module.exports = { app, sequelize };
