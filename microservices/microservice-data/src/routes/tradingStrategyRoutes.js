const express = require('express');
const router = express.Router();
const tradingStrategyController = require('../controllers/tradingStrategyController');


router.get('/', tradingStrategyController.getTradingStrategies);
router.get('/:id', tradingStrategyController.getTradingStrategy);
router.post('/', tradingStrategyController.createTradingStrategy);
router.delete('/:id', tradingStrategyController.deleteTradingStrategy);
router.patch('/:id', tradingStrategyController.updateTradingStrategy);

module.exports = router;