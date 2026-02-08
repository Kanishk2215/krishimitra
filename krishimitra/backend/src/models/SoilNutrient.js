const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SoilNutrient = sequelize.define('SoilNutrient', {
    soil_test_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    farm_id: {
        type: DataTypes.INTEGER, // Changed to INTEGER to match Farm model if it uses INTEGER
        allowNull: false
    },
    test_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    nitrogen_level: DataTypes.DECIMAL(6, 2),
    phosphorus_level: DataTypes.DECIMAL(6, 2),
    potassium_level: DataTypes.DECIMAL(6, 2),
    organic_carbon: DataTypes.DECIMAL(5, 2),
    ph_level: DataTypes.DECIMAL(3, 1),
    ec_level: DataTypes.DECIMAL(5, 2),
    sulfur_level: DataTypes.DECIMAL(6, 2),
    zinc_level: DataTypes.DECIMAL(6, 2),
    iron_level: DataTypes.DECIMAL(6, 2),
    soil_health_score: DataTypes.INTEGER,
    recommendations: DataTypes.TEXT
}, {
    tableName: 'soil_nutrients',
    timestamps: true,
    underscored: true
});

module.exports = SoilNutrient;
