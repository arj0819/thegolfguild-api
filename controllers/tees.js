const Tee = require('../models/Tee');
const Hole = require('../models/Hole');

exports.tees_findAll = (apiRequest, apiResponse) => {
    
    Tee.findAll()
        .then(tees => {
            console.log(tees);
            apiResponse.status(200).send(tees);
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })
        
}

exports.tees_create_hole = async (apiRequest, apiResponse) => {

    var tee = await Tee.findOne({
        include: [
            {
                model: Hole,
                order: [
                    ['number', 'ASC']
                ],
                separate: true,
            }
        ],
        where: {
            teeId: apiRequest.params.teeId
        }
    })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })
    
    if (tee.Holes.length >= 18) {
        apiResponse.status(500).send(new Error('This golf course already has 18 holes').message);
        return
    }

    const hole = await Hole.create({
        teeId: apiRequest.params.teeId,
        number: apiRequest.body.number,
        par: apiRequest.body.par,
        yardage: apiRequest.body.yardage,
        handicap: apiRequest.body.handicap,
        isOutHole: tee.Holes.length <= 9 ? true : false,
    })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

    const currentOutYards = tee.outYards;
    const currentInYards = tee.inYards;
    const currentTotalYards = tee.totalYards;
    const currentOutPar = tee.outPar;
    const currentInPar = tee.inPar;
    const currentTotalPar = tee.totalPar;

    if (hole.isOutHole) {
        tee = await Tee.update({
            outYards: currentOutYards + hole.yardage,
            outPar: currentOutPar + hole.par,
            totalYards: currentTotalYards + hole.yardage,
            totalPar: currentTotalPar + hole.par,
        },{
            where: {
                teeId: tee.teeId
            }
        })
            .catch(error => {
                console.log(error);
                apiResponse.status(500).send(error.message);
            })
    } else {
        tee = await Tee.update({
            inYards: currentInYards + hole.yardage,
            inPar: currentInPar + hole.par,
            totalYards: currentTotalYards + hole.yardage,
            totalPar: currentTotalPar + hole.par,
        },{
            where: {
                teeId: tee.teeId
            }
        })
            .catch(error => {
                console.log(error);
                apiResponse.status(500).send(error.message);
            })
    }

    apiResponse.status(200).json(hole);
}