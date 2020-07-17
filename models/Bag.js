const Sequelize = require('sequelize');
const db = require('../config/db.config');

const Club = require('../models/Club');

const Bag = db.define('Bag', {
    bagId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: Sequelize.DataTypes.UUID
    },
    name: {
        type: Sequelize.STRING
    },
})

Bag.hasMany(Club, {
    foreignKey: 'clubId'
});

module.exports = Bag;