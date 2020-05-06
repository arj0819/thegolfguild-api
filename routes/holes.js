const express = require('express');
const router = express.Router();

const HoleController = require('../controllers/holes')

router.get('/', HoleController.holes_findAll);

module.exports = router;