const express = require('express');
const router = express.Router();
const batteryController = require('../controllers/batteryController');
const authenticate = require('../middleware/authenticate'); 

router.get('/',authenticate, batteryController.getBatteries);
router.post('/',authenticate, batteryController.createBattery);
router.get('/:batteryId',authenticate, batteryController.getBattery);
router.patch('/:batteryId',authenticate, batteryController.updateBattery);
router.delete('/:batteryId',authenticate, batteryController.deleteBattery);
router.get('/user/:userId',authenticate, batteryController.getUserBatteries);

module.exports = router;
