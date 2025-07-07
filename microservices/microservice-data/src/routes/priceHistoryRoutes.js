const express = require('express');
const router = express.Router();
const priceHisotryController = require('../controllers/priceHisotryController');


router.get('/history', priceHisotryController.getPriceHistory);
router.get('/current', priceHisotryController.getCurrentPrice);
router.get('/predicted-prices', priceHisotryController.getPriceHistoryAndPrediction);

module.exports = router;