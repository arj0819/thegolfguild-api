const Hole = require('../models/Hole');

exports.holes_findAll = (apiRequest, apiResponse) => {

    Hole.findAll({
        order: [['teeId', 'ASC'],['number', 'ASC']]
    })
        .then(holes => {
            console.log(holes);
            apiResponse.status(200).send(holes);
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })
        
}