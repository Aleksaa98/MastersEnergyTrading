const express = require('express');
const router = express.Router();
const priceHisotryController = require('../controllers/priceHisotryController');


router.get('/history', priceHisotryController.getPriceHistory);
router.get('/current', priceHisotryController.getCurrentPrice);

module.exports = router;