const Sequelize = require('sequelize');
const db = require('../config/db.config');

const Tee = require('../models/Tee');

const GolfCourse = db.define('GolfCourse', {
    golfCourseId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING
    },
})

GolfCourse.hasMany(Tee, {
    foreignKey: 'golfCourseId'
});

module.exports = GolfCourse;