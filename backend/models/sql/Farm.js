const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('./User');

const Farm = sequelize.define('Farm', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'My Farm'
    },
    location: {
        type: DataTypes.STRING, // Could be text for now, or JSON for lat/long
    },
    soil_type: {
        type: DataTypes.STRING,
    },
    size_acres: {
        type: DataTypes.FLOAT,
    }
}, {
    timestamps: true,
    tableName: 'farms'
});

// Relationships
User.hasMany(Farm, { foreignKey: 'userId' });
Farm.belongsTo(User, { foreignKey: 'userId' });

module.exports = Farm;
