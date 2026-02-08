const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

if (process.env.DATABASE_URL) {
    // Use PostgreSQL (Railway/Render)
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Required for Railway/Render
            }
        }
    });
} else {
    // Use SQLite for local development
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database.sqlite'),
        logging: false,
    });
}

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ SQLite Database Connected');
    } catch (error) {
        console.error('❌ Database Connection Error:', error.message);
    }
};

// Mock Redis client (not needed for this simple version)
const redisClient = {
    isOpen: false,
    connect: async () => { },
    setEx: async () => { },
    get: async () => null,
    del: async () => { }
};

module.exports = { sequelize, redisClient, connectDB };
