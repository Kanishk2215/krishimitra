const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FertilizerApplicationLog = sequelize.define('FertilizerApplicationLog', {
    log_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    farmer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    farm_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fertilizer_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    application_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    quantity_applied: DataTypes.DECIMAL(8, 2),
    application_method: DataTypes.STRING(50),
    growth_stage: DataTypes.STRING(50),
    cost: DataTypes.DECIMAL(10, 2),
    notes: DataTypes.TEXT
}, {
    tableName: 'fertilizer_application_log',
    timestamps: true,
    underscored: true
});

module.exports = FertilizerApplicationLog;
