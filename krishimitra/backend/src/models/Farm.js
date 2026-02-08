const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Farm = sequelize.define('Farm', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    land_size: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    soil_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    irrigation_source: {
        type: DataTypes.STRING,
        defaultValue: 'Rainfed'
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false
    },
    FarmerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Farm;
