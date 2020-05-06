const express = require('express');
const router = express.Router();

const TeeController = require('../controllers/tees');

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

//Get All Tees
router.get('/', TeeController.tees_findAll);

//Add Hole
router.post('/:teeId/holes', TeeController.tees_create_hole);

module.exports = router;