const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

const UserController = require('../controllers/users');

//Add User (requires user's email and password in the request body)
router.post('/sign-up', UserController.users_signup);

//Login User (requires user's email and password in the request body)
router.post('/login', UserController.users_login);

//Delete User (requires a userId as a url param)
// Consider using cascading deletes to remove all content tied to the given userId
// Consider ensuring only the currently logged-in user can delete him/herself
router.delete('/:userId', checkAuth, UserController.users_delete);

router.get('/:userId', checkAuth, UserController.users_findOne);

//Get All Active Rounds By User
router.get('/:userId/active-rounds', checkAuth, UserController.users_findAll_active_rounds);

//Get One Active Rounds By User
router.get('/:userId/active-rounds/:roundId', checkAuth, UserController.users_findOne_active_round);

//Add Stroke to Round Hole By User
router.post('/:userId/round-holes/:roundHoleId/round-strokes', checkAuth, UserController.users_create_roundStroke);

//Update Stroke from Round Hole By User
router.post('/:userId/round-holes/:roundHoleId/round-strokes/:roundStrokeId', checkAuth, UserController.users_update_roundStroke);

//Delete Stroke from Round Hole By User
router.delete('/:userId/round-holes/:roundHoleId/round-strokes/:roundStrokeId', checkAuth, UserController.users_delete_roundStroke);

//End Round By User
router.post('/:userId/rounds/:roundId/end', checkAuth, UserController.users_rounds_end);

module.exports = router;