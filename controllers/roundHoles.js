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
    
exports.roundHoles_findAll = (apiRequest, apiResponse) => {

    RoundHole.findAll({
        include: [
            {
                model: RoundStroke,
                order: [['number', 'ASC']],
                separate: true
            }
        ],
        order: [['number', 'ASC']],
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

exports.roundHoles_create_roundStroke = async (apiRequest, apiResponse) => {

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
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

    //create a new RoundStroke with the provided roundHoleId, userId
    RoundStroke.create({
        roundHoleId: apiRequest.params.roundHoleId,
        userId: apiRequest.body.userId || null,
        number: roundHole.RoundStrokes.length + 1,
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