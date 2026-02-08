const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Crop = sequelize.define('Crop', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    season: {
        type: DataTypes.STRING
    },
    soil_suitability: {
        type: DataTypes.TEXT, // Store as JSON string for SQLite
        get() {
            const rawValue = this.getDataValue('soil_suitability');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('soil_suitability', JSON.stringify(value));
        }
    },
    duration_days: {
        type: DataTypes.INTEGER
    },
    min_rainfall: DataTypes.FLOAT,
    max_rainfall: DataTypes.FLOAT,
    min_temp: DataTypes.FLOAT,
    max_temp: DataTypes.FLOAT,
    expected_yield: DataTypes.STRING,
    avg_profit_per_acre: DataTypes.FLOAT,
    image_url: DataTypes.STRING
}, {
    timestamps: true
});

module.exports = Crop;
