const GolfCourse = require('../models/GolfCourse');
const Tee = require('../models/Tee');

exports.golfCourses_findAll = (apiRequest, apiResponse) => {

    GolfCourse.findAll({
        include: [
            {
                model: Tee,
                order: [['slope', 'DESC']],
                separate: true
            }
        ],
        order: [['name', 'ASC']],
    })
        .then(golfCourses => {
            console.log(golfCourses);
            apiResponse.status(200).send(golfCourses);
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

}

exports.golfCourses_create = (apiRequest, apiResponse) => {
    
    GolfCourse.create({
        name: apiRequest.body.name
    })
        .then((golfCourse) => {
            console.log(golfCourse.toJSON());
            apiResponse.status(200).send(golfCourse);
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

}

exports.golfCourses_findOne = (apiRequest, apiResponse) => {

    GolfCourse.findOne({
        golfCourseId: apiRequest.params.golfCourseId
    })
        .then(golfCourse => {
            console.log(golfCourse);
            apiResponse.status(200).send(golfCourse);
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

}

exports.golfCourses_create_tee = (apiRequest, apiResponse) => {
    
    Tee.create({
        golfCourseId: apiRequest.params.golfCourseId,
        name: apiRequest.body.name,
        slope: apiRequest.body.slope,
        scratchRating: apiRequest.body.scratchRating,
        primaryColor: apiRequest.body.primaryColor || null,
        secondaryColor: apiRequest.body.secondaryColor || null
    })
        .then((tee) => {
            console.log(tee.toJSON());
            apiResponse.status(200).send(tee);
        })
        .catch(error => {
            console.log(error);
            apiResponse.status(500).send(error.message);
        })

}