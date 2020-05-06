const express = require('express');
const router = express.Router();

const GolfCourseController = require('../controllers/golfCourses');

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

//Get All Golf Courses
router.get('/', GolfCourseController.golfCourses_findAll);

//Add Golf Course
router.post('/', GolfCourseController.golfCourses_create);

//Get One Golf Course
router.get('/:golfCourseId', GolfCourseController.golfCourses_findOne);

//Add Tee
router.post('/:golfCourseId/tees', GolfCourseController.golfCourses_create_tee);

module.exports = router;