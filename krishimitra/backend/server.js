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

// 1. Enhanced Middleware
app.use(cors());
app.use(express.json());

// 2. Logging and Error Tracking
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

// 3. Main Routes
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
        timestamp: new Date().toISOString()
    });
});

// 4. Global Error Handler (Prevents server from crashing on logic errors)
app.use((err, req, res, next) => {
    console.error('🔥 GLOBAL_ERROR:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
    });
});

// 5. Final Crash Protection
process.on('uncaughtException', (err) => {
    console.error('💥 UNCAUGHT_EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🌋 UNHANDLED_REJECTION at:', promise, 'reason:', reason);
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: true });
        console.log('✅ Database Synced & Ready');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`========================================`);
            console.log(`🚀 KRISHIMITRA BACKEND IS LIVE`);
            console.log(`🌐 URL: http://127.0.0.1:${PORT}`);
            console.log(`📡 Status: LISTENING FOR REQUESTS`);
            console.log(`========================================`);
        });
    } catch (error) {
        console.error('❌ Server startup failed:', error);
        // Try to restart after 5 seconds if initialization fails
        setTimeout(startServer, 5000);
    }
};

startServer();
