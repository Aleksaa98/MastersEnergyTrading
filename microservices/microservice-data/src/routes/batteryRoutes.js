const express = require('express');
const router = express.Router();
const batteryController = require('../controllers/batteryController');

// Define routes
router.get('/', batteryController.getBatteries);
router.get('/user/:traderId', batteryController.getBatteriesByUser);
router.get('/:id', batteryController.getBattery);
router.post('/', batteryController.createBattery);
router.delete('/:id', batteryController.deleteBattery);
router.patch('/:id', batteryController.updateBattery);

module.exports = router;
