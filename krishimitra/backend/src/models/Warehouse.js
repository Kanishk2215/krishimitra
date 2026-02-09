const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Warehouse = sequelize.define('Warehouse', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacity: {
        type: DataTypes.STRING // e.g. "5000 MT"
    },
    availableSpace: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.ENUM('Cold Storage', 'Dry Storage', 'Grain Silos'),
        defaultValue: 'Dry Storage'
    },
    contact: {
        type: DataTypes.STRING
    },
    pricePerQuintal: {
        type: DataTypes.DECIMAL(10, 2)
    },
    lat: {
        type: DataTypes.DECIMAL(10, 8)
    },
    lng: {
        type: DataTypes.DECIMAL(11, 8)
    }
});

module.exports = Warehouse;
