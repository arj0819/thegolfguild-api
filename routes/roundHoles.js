const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

const RoundHoleController = require('../controllers/roundHoles');

//Get All RoundHoles (eventually needs to provide a userId in request body)
router.get('/', checkAuth, RoundHoleController.roundHoles_findAll);

//Add a RoundStroke to provided roundHoleId (eventually needs to provide a userId in request body)
router.post('/:roundHoleId/round-stroke', checkAuth, RoundHoleController.roundHoles_create_roundStroke);

module.exports = router;