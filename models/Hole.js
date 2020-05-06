const Sequelize = require('sequelize');
const db = require('../config/db.config');

const Hole = db.define('Hole', {
    holeId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    teeId: {
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

module.exports = Hole;