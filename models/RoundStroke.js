const Sequelize = require('sequelize');
const db = require('../config/db.config');

const RoundStroke = db.define('RoundStroke', {
    roundStrokeId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    roundHoleId: {
        type: Sequelize.DataTypes.UUID
    },
    userId: {
        type: Sequelize.DataTypes.UUID
    },
    number: {
        type: Sequelize.SMALLINT
    },
})

module.exports = RoundStroke;