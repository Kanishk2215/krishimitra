const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const Farmer = sequelize.define('Farmer', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    language: {
        type: DataTypes.STRING,
        defaultValue: 'en'
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    hooks: {
        beforeCreate: async (farmer) => {
            if (farmer.password) {
                const salt = await bcrypt.genSalt(10);
                farmer.password = await bcrypt.hash(farmer.password, salt);
            }
        }
    }
});

Farmer.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = Farmer;
