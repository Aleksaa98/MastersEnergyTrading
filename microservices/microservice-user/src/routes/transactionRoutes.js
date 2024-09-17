const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authenticate = require('../middleware/authenticate'); 

router.post('/',authenticate, transactionController.createTransaction);
router.get('/', authenticate, transactionController.getAllTransactions);
router.get('/user/:userId', authenticate, transactionController.getUserTransactions);

module.exports = router;
