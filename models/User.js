const Sequelize = require('sequelize');
const db = require('../config/db.config');

const User = db.define('User', {
    userId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    confirmed: {
        type: Sequelize.BOOLEAN
    },
    golfBag: {
        type: Sequelize.ARRAY(Sequelize.DataTypes.SMALLINT)
    }
})

module.exports = User;