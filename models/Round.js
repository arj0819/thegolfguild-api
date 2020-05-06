const Sequelize = require('sequelize');
const db = require('../config/db.config');

const RoundHole = require('../models/RoundHole');

const Round = db.define('Round', {
    roundId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: Sequelize.DataTypes.UUID
    },
    roundActiveHoleId: {
        type: Sequelize.DataTypes.UUID
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    completedAt: {
        type: Sequelize.TIME
    },
    golfCourseName: {
        type: Sequelize.STRING
    },
    golfCourseId: {
        type: Sequelize.DataTypes.UUID
    },
    teeName: {
        type: Sequelize.STRING
    },
    teeId: {
        type: Sequelize.DataTypes.UUID
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

Round.hasMany(RoundHole, {
    foreignKey: 'roundId'
});

module.exports = Round;