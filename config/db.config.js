const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('thegolfguild', 'postgres', process.env.POSTGRES_AWS_PW, {

    // host: 'thegolfguild.cxex4gbmtouy.us-east-2.rds.amazonaws.com',
    host: 'localhost',
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;