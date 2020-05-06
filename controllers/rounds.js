const Sequelize = require('sequelize');
const Round = require('../models/Round');
const RoundHole = require('../models/RoundHole');
const RoundStroke = require('../models/RoundStroke');
const GolfCourse = require('../models/GolfCourse');
const Tee = require('../models/Tee');
const Hole = require('../models/Hole');

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


exports.rounds_findAll = (apiRequest, apiResponse) => {

    Round.findAll({
        // include: [
        //     {
        //         model: RoundHole,
        //         order: [
        //             ['number', 'ASC']
        //         ],
        //         separate: true,
        //         include: [
        //             {
        //                 model: RoundStroke,
        //                 order: [
        //                     ['number', 'ASC']
        //                 ],
        //                 separate: true
        //             }
        //         ],
        //     }
        // ]
    })
        .then(rounds => {
            console.log(rounds);
            apiResponse.status(200).send(rounds);
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

}

exports.rounds_create = async (apiRequest, apiResponse) => {

    //get the golfCourse that we are using for the new round
    const golfCourse = await GolfCourse.findOne({
        where: {
            golfCourseId: apiRequest.body.golfCourseId
        }
    })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        });

    //get the tee that we are using for the new round
    const tee = await Tee.findOne({
        where: {
            teeId: apiRequest.body.teeId
        }
    })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        });

    //get the holes that we are using for the new round
    const holes = await Hole.findAll({
        where: {
            teeId: tee.teeId
        }
    })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        });


    //create a new Round with the golfCourse and tee information we just gathered
    const round = await Round.create({
        golfCourseName: golfCourse.name,
        golfCourseId: golfCourse.golfCourseId,
        userId: apiRequest.body.userId,
        teeName: tee.name,
        teeId: tee.teeId,
        slope: tee.slope,
        scratchRating: tee.scratchRating,
        primaryColor: tee.primaryColor || null,
        secondaryColor: tee.secondaryColor || null,
    })

    //empty array for containing the returned promises from creating all new RoundHoles
    const roundHolePromises = []

    for(var i = 0; i < holes.length; i++) {
        //create new RoundHoles for each hole we gathered earlier
        roundHolePromises.push(RoundHole.create({
            roundId: round.roundId,
            userId: apiRequest.body.userId,
            number: holes[i].number,
            par: holes[i].par,
            yardage: holes[i].yardage,
            handicap: holes[i].handicap,
            isOutHole: holes[i].isOutHole,
        }))
    }

    //Once all new RoundHoles are done being created, we can update the new round's active hole to the first RoundHole
    Promise.all(roundHolePromises)
        .then(roundHoles => {

            console.log(roundHoles[0].get('roundHoleId'));

            round.update({
                roundActiveHoleId: roundHoles[0].get('roundHoleId'),
            })
                .then((round) => {
                    console.log(round.toJSON());
                    apiResponse.status(200).send(round);
                })
                .catch(error => {
                    console.log(error);
                    apiResponse.status(500).send(error.message);
                })
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

}

exports.rounds_delete = async (apiRequest, apiResponse) => {
    
    //error if we don't have required params
    if (!apiRequest.params.roundId) {
        apiResponse.status(500).send(new Error('The necessary url parameter is missing').message);
        return
    }
    
    //delete the provided round (CASCADES into roundHoles and roundStrokes)
    Round.destroy({
        where: {
            roundId: apiRequest.params.roundId
        }
    })
        .then((round) => {
            apiResponse.status(200).send({
                message: 'The round was successfully deleted.'
            });
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        });

}

exports.rounds_end = async (apiRequest, apiResponse) => {
    
    //error if we don't have required params
    if (!apiRequest.params.roundId) {
        apiResponse.status(500).send(new Error('The necessary url parameter is missing').message);
        return
    }
    
    //update the provided roundId to be inactive
    Round.update({
        isActive: false,
        completedAt: Sequelize.NOW
    },{
        where: {
            roundId: apiRequest.params.roundId
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

exports.rounds_set_active_hole = async (apiRequest, apiResponse) => {
    
    //error if we don't have required params
    if (!apiRequest.params.roundId || !apiRequest.body.roundHoleId) {
        apiResponse.status(500).send(new Error('The necessary url parameters are missing').message);
        return
    }
    
    //get all RoundHoles that match the provided roundId and roundHoleId (Should only be 1)
    const roundHoles = await RoundHole.findAll({
        where: {
            roundId: apiRequest.params.roundId,
            roundHoleId: apiRequest.body.roundHoleId
        }
    })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        });

    //We found that the given roundHoleId is associated with the provided roundId, so we can update the active hole
    if (roundHoles.length == 1) {
        Round.update({
            roundActiveHoleId: apiRequest.body.roundHoleId,
        },{
            where: {
                roundId: apiRequest.params.roundId
            }
        })
            .then((round) => {
                apiResponse.status(200).send({
                    message: 'The active hole was successfully updated.'
                });
            })
            .catch(error => {
                console.log(error);
                apiResponse.status(500).send(error.message);
            });
    } else if (roundHoles.length > 1) {
        apiResponse.status(500).send(new Error('There are multiple roundHoles matching this roundId and roundHoleId').message);
    } else if (roundHoles.length < 1) {
        apiResponse.status(500).send(new Error('There are no roundHoles matching this roundId and roundHoleId').message);
    } else {
        apiResponse.status(500).send(new Error('Unable to set the active hole on the provided round').message);
    }


}