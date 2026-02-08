const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
const path = require('path');

// Determine if we are in "Local No-Docker" mode
const isLocal = process.env.DB_DIALECT === 'sqlite';

let sequelize;

if (isLocal) {
    console.log('⚠️ Running in Local Mode with SQLite');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database.sqlite'),
        logging: false
    });
} else {
    // PostgreSQL Connection (Sequelize)
    sequelize = new Sequelize(
        process.env.DB_NAME || 'agrifarm',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || 'postgres',
        {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'postgres',
            logging: false,
        }
    );
}

const connectSQL = async () => {
    try {
        await sequelize.authenticate();
        console.log(`✅ ${isLocal ? 'SQLite' : 'PostgreSQL'} Connected...`);
        await sequelize.sync({ alter: true });
        console.log('✅ Models Synced.');
    } catch (err) {
        console.error(`❌ ${isLocal ? 'SQLite' : 'PostgreSQL'} Connection Error:`, err.message);
    }
};

// MongoDB Connection (Mongoose)
const connectMongo = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/agrifarm';
        await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ MongoDB Connected...');
    } catch (err) {
        console.error('❌ MongoDB Connection Error (Skipping for now):', err.message);
        // We don't exit process, allowing app to run without Mongo for SQL-only features
    }
};

module.exports = { sequelize, connectSQL, connectMongo };
