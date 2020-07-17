const Sequelize = require('sequelize');
const db = require('../config/db.config');

const Club = db.define('Club', {
    clubId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    bagId: {
        type: Sequelize.DataTypes.UUID
    },
    userId: {
        type: Sequelize.DataTypes.UUID
    },
    name: {
        type: Sequelize.STRING
    },
    clubTypeId: {
        type: Sequelize.SMALLINT
    },
})

module.exports = Club;