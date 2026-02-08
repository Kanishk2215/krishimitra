const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FertilizerRecommendation = sequelize.define('FertilizerRecommendation', {
    recommendation_id: {
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
    crop_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    growth_stage: {
        type: DataTypes.STRING(50)
    },
    soil_test_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    recommendation_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    fertilizer_plan: {
        type: DataTypes.JSON // Changed from JSONB for SQLite compatibility
    },
    total_cost: DataTypes.DECIMAL(10, 2),
    expected_yield_increase: DataTypes.DECIMAL(5, 2),
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'suggested'
    },
    farmer_feedback: DataTypes.STRING(20)
}, {
    tableName: 'fertilizer_recommendations',
    timestamps: true,
    underscored: true
});

module.exports = FertilizerRecommendation;
