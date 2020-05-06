const Sequelize = require('sequelize');
const db = require('../config/db.config');

const Hole = require('../models/Hole');

const Tee = db.define('Tee', {
    teeId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    golfCourseId: {
        type: Sequelize.DataTypes.UUID
    },
    name: {
        type: Sequelize.STRING
    },
    slope: {
        type: Sequelize.SMALLINT
    },
    scratchRating: {
        type: Sequelize.DECIMAL(3,1)
    },
    outYards: {
        type: Sequelize.SMALLINT
    },
    inYards: {
        type: Sequelize.SMALLINT
    },
    totalYards: {
        type: Sequelize.SMALLINT
    },
    outPar: {
        type: Sequelize.SMALLINT
    },
    inPar: {
        type: Sequelize.SMALLINT
    },
    totalPar: {
        type: Sequelize.SMALLINT
    },
    primaryColor: {
        type: Sequelize.STRING
    },
    secondaryColor: {
        type: Sequelize.STRING
    },
})

Tee.hasMany(Hole, {
    foreignKey: 'holeId'
});

module.exports = Tee;