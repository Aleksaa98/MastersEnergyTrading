const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');

router.get('/history', priceController.getPriceHistory);
router.get('/current', priceController.getCurrentPrice);

module.exports = router;
