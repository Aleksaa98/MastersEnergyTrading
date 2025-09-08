const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate'); 

router.get('/', authenticate, userController.getAllUsers);
router.get('/:username', authenticate, userController.getUserByUsername);
router.get('/id/:id', authenticate, userController.getUserById);
router.patch('/:id/block', authenticate, userController.toggleUserBlock);
router.patch('/:username', authenticate, userController.updateUserByUsername);
router.delete('/:username', authenticate, userController.deleteUserByUsername);


module.exports = router;
