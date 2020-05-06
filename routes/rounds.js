const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

const RoundController = require('../controllers/rounds');


//Get All Rounds (eventually needs to provide a userId in request body)
router.get('/', checkAuth, RoundController.rounds_findAll);

//Add Round (requires golfCourseId and teeID in the request body)
router.post('/', checkAuth, RoundController.rounds_create);


//Delete Round (requires a roundId as a url param)
//  Uses cascade deletes in the database to remove the associated roundGolfCourse, roundTee, 
//  and all associated roundHoles and roundStrokes
router.delete('/:roundId', checkAuth, RoundController.rounds_delete);

//End Round (requires a roundId as a url param)
router.post('/:roundId/end', checkAuth, RoundController.rounds_end);

//Set Active Hole (requires a request body param roundHoleId, which must be assocaited with url param roundId)
router.post('/:roundId/active-hole', checkAuth, RoundController.rounds_set_active_hole);

module.exports = router;