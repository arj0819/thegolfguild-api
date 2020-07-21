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
    terrainResultTypeId: {
        type: Sequelize.SMALLINT
    },
    shapeAchievedTypeId: {
        type: Sequelize.SMALLINT
    },
    intendedShapeTypeId: {
        type: Sequelize.SMALLINT
    },
    accuracyTypeId: {
        type: Sequelize.SMALLINT
    },
    breakReadQualityTypeId: {
        type: Sequelize.SMALLINT
    },
    contactQualityTypeId: {
        type: Sequelize.SMALLINT
    },
    lieQualityTypeId: {
        type: Sequelize.SMALLINT
    },
    windTypeId: {
        type: Sequelize.SMALLINT
    },
    satisfactionTypeId: {
        type: Sequelize.SMALLINT
    },
    clubId: {
        type: Sequelize.SMALLINT
    },
})

module.exports = RoundStroke;