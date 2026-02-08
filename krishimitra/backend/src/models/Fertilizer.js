const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Fertilizer = sequelize.define('Fertilizer', {
    fertilizer_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fertilizer_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    fertilizer_type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    npk_ratio: {
        type: DataTypes.STRING(20)
    },
    nitrogen_percent: DataTypes.DECIMAL(5, 2),
    phosphorus_percent: DataTypes.DECIMAL(5, 2),
    potassium_percent: DataTypes.DECIMAL(5, 2),
    application_method: {
        type: DataTypes.JSON // Changed from ARRAY for SQLite compatibility
    },
    suitable_crops: {
        type: DataTypes.JSON // Changed from ARRAY for SQLite compatibility
    },
    price_per_kg: DataTypes.DECIMAL(8, 2),
    manufacturer: DataTypes.STRING(100),
    image_url: DataTypes.STRING(500)
}, {
    tableName: 'fertilizers',
    timestamps: true,
    underscored: true
});

module.exports = Fertilizer;
