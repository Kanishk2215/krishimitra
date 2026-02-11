require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Added
const { connectDB, sequelize } = require('./src/config/database');
// Routes
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
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

// Serve STATIC FILES (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// ========================================
// API ROUTES
// ========================================
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/recommend', recommendationRoutes);
app.use('/api/online', onlineRoutes);
app.use('/api/fertilizer', fertilizerRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        database: sequelize ? 'connected' : 'disconnected',
        timestamp: new Date()
    });
});

// Serve Frontend for ALL other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
            await sequelize.sync({ alter: true });
            console.log('✅ Database Synced & Ready');
        } else {
            console.warn('⚠️ Sequlize instance missing - Running in Offline Mode');
        }

    } catch (error) {
        console.error('❌ Database Connection Failed (APP WILL START ANYWAY):', error.message);
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
const shutdown = async () => {
    if (sequelize) await sequelize.close();
    process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();

module.exports = { app, sequelize };
