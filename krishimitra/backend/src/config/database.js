const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

if (process.env.DATABASE_URL) {
    // 🛡️ Safety Check: Ignore Internal Render URL if running Locally
    // Render Internal URLs look like: postgres://user:pass@dpg-xxxx-a:5432/db
    // Local machines cannot resolve 'dpg-'. Hostname is usually 4th part if split by '@' or just 'dpg-' check.

    // Check if we are physically on Render (Render sets RENDER=true)
    const isRender = process.env.RENDER || false;
    const isInternalUrl = process.env.DATABASE_URL.includes('dpg-');

    if (!isRender && isInternalUrl && !process.env.DATABASE_URL.includes('.render.com')) {
        console.warn('⚠️ DETECTED INTERNAL RENDER DB URL ON LOCALHOST!');
        console.warn('   Internal URLs (dpg-...) cannot be accessed locally.');
        console.warn('   Falling back to SQLite for local development.');

        // Use SQLite fallback
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: path.join(__dirname, '../../database.sqlite'),
            logging: false,
        });
    } else {
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
    }

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
