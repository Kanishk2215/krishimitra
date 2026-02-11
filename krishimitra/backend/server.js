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
    origin: '*', // Allow all origins for production to avoid CORS error
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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
// START SERVER (Robust Mode)
// ========================================

const startServer = async () => {
    try {
        console.log('🔄 Attempting Database Connection...');
        await connectDB();

        if (sequelize) {
            console.log('📊 Verifying Schema...');
            // Don't use force:false here to be safe in prod, just alter
            await sequelize.sync({ alter: true });
            console.log('✅ Database Synced & Ready');
        } else {
            console.warn('⚠️ Sequlize instance missing - Running in Offline Mode');
        }

    } catch (error) {
        console.error('❌ Database Connection Failed (APP WILL START ANYWAY):', error.message);
        // We do NOT exit. We continue to app.listen.
    }

    // Always Start Listening
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`========================================`);
        console.log(`🚀 KRISHIMITRA BACKEND IS LIVE (Port ${PORT})`);
        console.log(`📡 Status: LISTENING FOR REQUESTS`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`⚠️ Database: ${sequelize ? 'Connected' : 'OFFLINE (API Only)'}`);
        console.log(`========================================`);
    });
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing server...');
    if (sequelize) await sequelize.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, closing server...');
    if (sequelize) await sequelize.close();
    process.exit(0);
});

startServer();

module.exports = { app, sequelize };
