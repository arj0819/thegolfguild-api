const Sequelize = require('sequelize');
const db = require('../config/db.config');

const RoundStroke = require('../models/RoundStroke');

const RoundHole = db.define('RoundHole', {
    roundHoleId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    roundId: {
        type: Sequelize.DataTypes.UUID
    },
    userId: {
        type: Sequelize.DataTypes.UUID
    },
    number: {
        type: Sequelize.SMALLINT
    },
    par: {
        type: Sequelize.SMALLINT
    },
    yardage: {
        type: Sequelize.SMALLINT
    },
    handicap: {
        type: Sequelize.SMALLINT
    },
    isOutHole: {
        type: Sequelize.BOOLEAN
    },
})

RoundHole.hasMany(RoundStroke, {
    foreignKey: 'roundHoleId'
});

module.exports = RoundHole;