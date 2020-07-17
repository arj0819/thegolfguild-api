const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Round = require('../models/Round');
const RoundHole = require('../models/RoundHole');
const RoundStroke = require('../models/RoundStroke');

    //request's relative URL
    // console.log(apiRequest.url)

    //for the request's relative route
    // console.log(apiRequest.route.path)

    //for the request's body
    // console.log(apiRequest.body)

    //for url inline params (url/:value)
    // console.log(apiRequest.params)

    //for url query params (url?query=value)
    // console.log(apiRequest.query)

exports.users_signup = async (apiRequest, apiResponse) => {
    
    //error if we don't have required params
    if (!apiRequest.body.email || !apiRequest.body.password) {
        apiResponse.status(500).send(new Error('The necessary request body parameters are missing').message);
        return
    }

    const users = await User.findAll({
        where: {
            email: apiRequest.body.email
        }
    })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

    // Ensure we don't create a new user for an email that already exists
    if (users.length >= 1) {
        apiResponse.status(409).send(new Error('This email already exists. Please use a different email or use password recovery').message);
    } else {
        bcrypt.hash(apiRequest.body.password, 10, async (error, hash) => {
            if (error) {
                apiRequest.status(500).send(error.message)
            } else {
                //create a new User with provided email, firstName, lastName, and hashed password
                const user = await User.create({
                    email: apiRequest.body.email,
                    password: hash,
                    firstName: apiRequest.body.firstName,
                    lastName: apiRequest.body.lastName,
                    confirmed: false,
                })
                    .then(user => {
                        console.log(user);
                        apiResponse.status(201).send(user);
                    })
                    .catch(error => {
                        console.log(error);
                        apiResponse.status(500).send(error.message);
                    })
    
            }
        })
    }

}

exports.users_login = async (apiRequest, apiResponse, next) => {
    
    //error if we don't have required params
    if (!apiRequest.body.email || !apiRequest.body.password) {
        apiResponse.status(500).send(new Error('The necessary request body parameters are missing').message);
        return
    }

    const users = await User.findAll({
        where: {
            email: apiRequest.body.email
        }
    })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

    // Ensure we don't create a new user for an email that already exists
    if (users.length > 1) {
        //multiple users with this email
        apiResponse.status(401).send(new Error('Authorization failed (multiple users with this email).').message);
    } else if (users.length < 1) {
        //no users with this email
        apiResponse.status(404).send(new Error('Authorization failed (no users with this email).').message);
    } else {
        bcrypt.compare(apiRequest.body.password, users[0].password)
            .then(passwordsMatch => {
                if (passwordsMatch) {
                    const token = jwt.sign({
                        userId: users[0].userId,
                        email: users[0].email,
                        firstName: users[0].firstName,
                        lastName: users[0].lastName,
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "12h"
                    });
                    return apiResponse.status(200).json({
                        message: 'Authorization successful.',
                        token: token
                    });    
                } else {
                    return apiResponse.status(401).send(new Error('Authorization failed (maybe password incorrect).').message);    
                }
            })
            .catch(error => {
                console.log(error);
                apiResponse.status(500).send(error.message);
            })
    }

}

exports.users_delete = async (apiRequest, apiResponse) => {
    
    //error if we don't have required params
    if (!apiRequest.params.userId) {
        apiResponse.status(500).send(new Error('The necessary url parameter is missing').message);
        return
    }
    
    //delete the provided user
    User.destroy({
        where: {
            userId: apiRequest.params.userId
        }
    })
        .then((user) => {
            apiResponse.status(200).send({
                message: 'The user was successfully deleted.'
            });
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        });

}

exports.users_findOne = async (apiRequest, apiResponse) => {
    
    const user = await User.findOne({
        where: {
            userId: apiRequest.params.userId
        }
    })
        .then((user) => {
            apiResponse.status(200).json(user);
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

}


exports.users_findAll_active_rounds = (apiRequest, apiResponse) => {

    Round.findAll({
        include: [
            {
                model: RoundHole,
                order: [
                    ['number', 'ASC']
                ],
                separate: true,
                include: [
                    {
                        model: RoundStroke,
                        order: [
                            ['number', 'ASC']
                        ],
                        separate: true
                    }
                ],
            }
        ],
        where: {
            userId: apiRequest.params.userId,
            isActive: true
        }
    })
        .then(rounds => {
            var jsonRounds = [];
            for (var r = 0; r < rounds.length; r++) {
                var totalStrokes = 0;
                var totalParPlayed = 0;
                var thruRoundHoleNumber = 0;
                for (var i = 0; i < rounds[r].RoundHoles.length; i++) {
                    var currentRoundHole = rounds[r].RoundHoles[i];
                    var nextRoundHole = rounds[r].RoundHoles[i + 1] || null;
                    if (currentRoundHole.RoundStrokes.length > 0 && (nextRoundHole == null || nextRoundHole.RoundStrokes.length > 0)) {
                        totalParPlayed += currentRoundHole.par;
                        thruRoundHoleNumber = currentRoundHole.number;
                        for (var j = 0; j < currentRoundHole.RoundStrokes.length; j++) {
                            totalStrokes += 1
                        }
                    } else {
                        break
                    }
                }
                var jsonRound = rounds[r].toJSON();
                jsonRound.scoreRelativeToPar = totalStrokes - totalParPlayed;
                jsonRound.thruHole = thruRoundHoleNumber
                jsonRounds.push(jsonRound);
            }

            for (var i = 0; i < jsonRounds.length; i++) {
                var currentRound = jsonRounds[i]
                // var outPar = 0;
                // var inPar = 0
                // var outYards = 0;
                // var inYards = 0;
                for (var j = 0; j < currentRound.RoundHoles.length; j++){
                    var currentRoundHole = currentRound.RoundHoles[j]
                    
                    // if (currentRoundHole.number <= 9) {
                    //     outPar += currentRoundHole.par
                    //     outYards += currentRoundHole.yardage
                    // } else if (currentRoundHole.number <= 18) {
                    //     inPar += currentRoundHole.par
                    //     inYards += currentRoundHole.yardage
                    // }

                    currentRoundHole.strokes = currentRoundHole.RoundStrokes.length;
                }
                // currentRound.outPar = outPar;
                // currentRound.inPar = inPar;
                // currentRound.totalPar = outPar + inPar;
                // currentRound.outYards = outYards;
                // currentRound.inYards = inYards;
                // currentRound.totalYards = outYards + inYards;
            }

            
            apiResponse.status(200).json(jsonRounds);
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

}

exports.users_findOne_active_round = (apiRequest, apiResponse) => {

    Round.findOne({
        include: [
            {
                model: RoundHole,
                order: [
                    ['number', 'ASC']
                ],
                separate: true,
                include: [
                    {
                        model: RoundStroke,
                        order: [
                            ['number', 'ASC']
                        ],
                        separate: true
                    }
                ],
            }
        ],
        where: {
            roundId: apiRequest.params.roundId,
            userId: apiRequest.params.userId
        }
    })
        .then(round => {

            var totalStrokes = 0;
            var totalParPlayed = 0;
            var thruRoundHoleNumber = 0;
            for (var i = 0; i < round.RoundHoles.length; i++) {
                var currentRoundHole = round.RoundHoles[i];
                var nextRoundHole = round.RoundHoles[i + 1] || null;
                if (currentRoundHole.RoundStrokes.length > 0 && (nextRoundHole == null || nextRoundHole.RoundStrokes.length > 0)) {
                    totalParPlayed += currentRoundHole.par;
                    thruRoundHoleNumber = currentRoundHole.number;
                    for (var j = 0; j < currentRoundHole.RoundStrokes.length; j++) {
                        totalStrokes += 1
                    }
                } else {
                    break
                }
            }
            var jsonRound = round.toJSON();
            jsonRound.scoreRelativeToPar = totalStrokes - totalParPlayed;
            jsonRound.thruHole = thruRoundHoleNumber

            var currentRound = jsonRound
            var outPar = 0;
            var inPar = 0
            var outYards = 0;
            var inYards = 0;
            for (var j = 0; j < currentRound.RoundHoles.length; j++){
                var currentRoundHole = currentRound.RoundHoles[j]
                
                if (currentRoundHole.number <= 9) {
                    outPar += currentRoundHole.par
                    outYards += currentRoundHole.yardage
                } else if (currentRoundHole.number <= 18) {
                    inPar += currentRoundHole.par
                    inYards += currentRoundHole.yardage
                }

                currentRoundHole.strokes = currentRoundHole.RoundStrokes.length;
            }
            currentRound.outPar = outPar;
            currentRound.inPar = inPar;
            currentRound.totalPar = outPar + inPar;
            currentRound.outYards = outYards;
            currentRound.inYards = inYards;
            currentRound.totalYards = outYards + inYards;
            
            apiResponse.status(200).json(currentRound);
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

}

exports.users_create_roundStroke = async (apiRequest, apiResponse) => {

    const roundHole = await RoundHole.findOne({
        include: [
            {
                model: RoundStroke,
                order: [['number', 'ASC']],
                separate: true
            }
        ],
        where: {
            roundHoleId: apiRequest.params.roundHoleId,
            userId: apiRequest.params.userId
        },
    })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

    let previousStrokeTerrainResultType = null;
    let terrainIntendedTypeId = null;
    if (roundHole.RoundStrokes.length > 0) {
        if (roundHole.RoundStrokes[roundHole.RoundStrokes.length - 1] !== null) {
            previousStrokeTerrainResultType = roundHole.RoundStrokes[roundHole.RoundStrokes.length - 1].terrainResultTypeId;
        }
    } else {
        roundHole.par > 3 ? terrainIntendedTypeId = 1 : terrainIntendedTypeId = 5;
    }

    // Ignore the add new RoundStroke request if the previous stroke terrain type result was in the Hole (ID=7)
    if (previousStrokeTerrainResultType === 7) {
        apiResponse.status(405).send();
        return;
    }

    //create a new RoundStroke with the provided roundHoleId, userId
    RoundStroke.create({
        roundHoleId: apiRequest.params.roundHoleId,
        userId: apiRequest.params.userId || null,
        number: roundHole.RoundStrokes.length + 1,
        strokeTypeId: roundHole.RoundStrokes.length === 0 ? 8 : null,
        terrainStartTypeId: roundHole.RoundStrokes.length === 0 ? 13 : previousStrokeTerrainResultType,
        terrainIntendedTypeId: terrainIntendedTypeId,
        lieAngleTypeId: roundHole.RoundStrokes.length === 0 ? 2 : null,
        liePitchTypeId: roundHole.RoundStrokes.length === 0 ? 2 : null,
        lieConditionTypeId: roundHole.RoundStrokes.length === 0 ? 0 : null,
    })
        .then(roundStroke => {
            console.log(roundStroke);
            apiResponse.status(200).send(roundStroke);
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

}

exports.users_update_roundStroke = async (apiRequest, apiResponse) => {

    const roundStroke = await RoundStroke.findOne({
        where: {
            roundStrokeId: apiRequest.params.roundStrokeId,
            userId: apiRequest.params.userId
        },
    })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

    //update the RoundStroke with the provided information
    RoundStroke.update({
        strokeTypeId: apiRequest.body.strokeTypeId !== typeof undefined ? apiRequest.body.strokeTypeId : roundStroke.strokeTypeId,
        terrainStartTypeId: apiRequest.body.terrainStartTypeId !== typeof undefined ? apiRequest.body.terrainStartTypeId : roundStroke.terrainStartTypeId,
        terrainIntendedTypeId: apiRequest.body.terrainIntendedTypeId !== typeof undefined ? apiRequest.body.terrainIntendedTypeId : roundStroke.terrainIntendedTypeId,
        terrainResultTypeId: apiRequest.body.terrainResultTypeId !== typeof undefined ? apiRequest.body.terrainResultTypeId : roundStroke.terrainResultTypeId,
        curveIntendedTypeId: apiRequest.body.curveIntendedTypeId !== typeof undefined ? apiRequest.body.curveIntendedTypeId : roundStroke.curveIntendedTypeId,
        curveResultTypeId: apiRequest.body.curveResultTypeId !== typeof undefined ? apiRequest.body.curveResultTypeId : roundStroke.curveResultTypeId,
        distanceResultTypeId: apiRequest.body.distanceResultTypeId !== typeof undefined ? apiRequest.body.distanceResultTypeId : roundStroke.distanceResultTypeId,
        lateralResultTypeId: apiRequest.body.lateralResultTypeId !== typeof undefined ? apiRequest.body.lateralResultTypeId : roundStroke.lateralResultTypeId,
        lieAngleTypeId: apiRequest.body.lieAngleTypeId !== typeof undefined ? apiRequest.body.lieAngleTypeId : roundStroke.lieAngleTypeId,
        liePitchTypeId: apiRequest.body.liePitchTypeId !== typeof undefined ? apiRequest.body.liePitchTypeId : roundStroke.liePitchTypeId,
        lieConditionTypeId: apiRequest.body.lieConditionTypeId !== typeof undefined ? apiRequest.body.lieConditionTypeId : roundStroke.lieConditionTypeId,
        breakLateralReadTypeId: apiRequest.body.breakLateralReadTypeId !== typeof undefined ? apiRequest.body.breakLateralReadTypeId : roundStroke.breakLateralReadTypeId,
        breakLateralResultTypeId: apiRequest.body.breakLateralResultTypeId !== typeof undefined ? apiRequest.body.breakLateralResultTypeId : roundStroke.breakLateralResultTypeId,
        breakVerticalReadTypeId: apiRequest.body.breakVerticalReadTypeId !== typeof undefined ? apiRequest.body.breakVerticalReadTypeId : roundStroke.breakVerticalReadTypeId,
        breakVerticalResultTypeId: apiRequest.body.breakVerticalResultTypeId !== typeof undefined ? apiRequest.body.breakVerticalResultTypeId : roundStroke.breakVerticalResultTypeId,
        windDirectionTypeId: apiRequest.body.windDirectionTypeId !== typeof undefined ? apiRequest.body.windDirectionTypeId : roundStroke.windDirectionTypeId,
        windStrengthTypeId: apiRequest.body.windStrengthTypeId !== typeof undefined ? apiRequest.body.windStrengthTypeId : roundStroke.windStrengthTypeId,
        strokeSatisfactionTypeId: apiRequest.body.strokeSatisfactionTypeId !== typeof undefined ? apiRequest.body.strokeSatisfactionTypeId : roundStroke.strokeSatisfactionTypeId,
        clubId: apiRequest.body.clubId ? apiRequest.body.clubId !== typeof undefined : roundStroke.clubId,
        userId: apiRequest.body.userId ? apiRequest.body.userId !== typeof undefined : roundStroke.userId,
    },{
        where: {
            roundStrokeId: roundStroke.roundStrokeId
        }
    })
        .then(roundStroke => {
            console.log(roundStroke);
            apiResponse.status(200).send(roundStroke);
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

}

exports.users_delete_roundStroke = async (apiRequest, apiResponse) => {

    //delete a new RoundStroke with the provided roundHoleId, userId
    RoundStroke.destroy({
        where: {
            roundStrokeId: apiRequest.params.roundStrokeId,
            userId: apiRequest.params.userId
        }
    })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

    const roundHole = await RoundHole.findOne({
        include: [
            {
                model: RoundStroke,
                order: [['number', 'ASC']],
                separate: true
            }
        ],
        where: {
            roundHoleId: apiRequest.params.roundHoleId
        },
    })
        // .then(roundHole => {
        //     console.log(roundHole);
        //     apiResponse.status(200).send(roundHole);
        // })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

    for (var i = 1; i <= roundHole.RoundStrokes.length; i++) {
        var currentRoundStroke = roundHole.RoundStrokes[i - 1]
        var roundStroke = await RoundStroke.update({
            number: i,
        },{
            where: {
                roundStrokeId: currentRoundStroke.roundStrokeId,
                userId: apiRequest.params.userId
            }
        })
            .catch(error => {
                console.log(error);
                apiResponse.status(500).send(error.message);
            })
    }

    
    apiResponse.status(200).json({
        message: 'Round hole successfully updated.'
    });


}


exports.users_rounds_end = async (apiRequest, apiResponse) => {
    
    //update the provided roundId to be inactive
    var round = await Round.update({
        isActive: false,
        completedAt: Sequelize.NOW
    },{
        where: {
            roundId: apiRequest.params.roundId,
            userId: apiRequest.params.userId
        }
    })
        .then((round) => {
            apiResponse.status(200).send({
                message: 'The round was successfully ended.'
            });
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        });

}