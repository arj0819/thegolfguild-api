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
    strokeTypeId: {
        type: Sequelize.SMALLINT
    },
    terrainStartTypeId: {
        type: Sequelize.SMALLINT
    },
    terrainIntendedTypeId: {
        type: Sequelize.SMALLINT
    },
    terrainResultTypeId: {
        type: Sequelize.SMALLINT
    },
    curveIntendedTypeId: {
        type: Sequelize.SMALLINT
    },
    curveResultTypeId: {
        type: Sequelize.SMALLINT
    },
    distanceResultTypeId: {
        type: Sequelize.SMALLINT
    },
    lateralResultTypeId: {
        type: Sequelize.SMALLINT
    },
    lieAngleTypeId: {
        type: Sequelize.SMALLINT
    },
    liePitchTypeId: {
        type: Sequelize.SMALLINT
    },
    lieConditionTypeId: {
        type: Sequelize.SMALLINT
    },
    breakLateralReadTypeId: {
        type: Sequelize.SMALLINT
    },
    breakLateralResultTypeId: {
        type: Sequelize.SMALLINT
    },
    breakVerticalReadTypeId: {
        type: Sequelize.SMALLINT
    },
    breakVerticalResultTypeId: {
        type: Sequelize.SMALLINT
    },
    windDirectionTypeId: {
        type: Sequelize.SMALLINT
    },
    windStrengthTypeId: {
        type: Sequelize.SMALLINT
    },
    strokeSatisfactionTypeId: {
        type: Sequelize.SMALLINT
    },
    clubId: {
        type: Sequelize.DataTypes.UUID
    },
})

module.exports = RoundStroke;