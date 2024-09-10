const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define routes
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:username', userController.getUserByUsername);
router.patch('/:username', userController.updateUserByUsername);
router.delete('/:username', userController.deleteUserByUsername);

module.exports = router;
