const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authenticate = require('../middleware/authenticate'); 

router.post('/', transactionController.createTransaction);
router.get('/', authenticate, transactionController.getAllTransactions);
router.get('/user/:username', authenticate, transactionController.getUserTransactions);

module.exports = router;
