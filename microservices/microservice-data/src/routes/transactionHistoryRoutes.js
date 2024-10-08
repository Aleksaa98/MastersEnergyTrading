const express = require('express');
const router = express.Router();
const transactionHistory = require('../controllers/transactionHistoryController');

// Define routes
router.post('/', transactionHistory.createTransaction);
router.get('/', transactionHistory.getAllTransactions);
router.get('/:userId', transactionHistory.getUserTransactions);

module.exports = router;