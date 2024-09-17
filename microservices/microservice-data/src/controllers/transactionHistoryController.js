const Transaction = require('../models/transactionHistory');

// Create a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const {userId,timestamp,type,amount,stratName} = req.body

        const transaction = await Transaction.create({
            userId,
            type,
            amount,
            timestamp,
            stratName
        });

        res.status(200).json(transaction)
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ error: 'Error creating Transaction' });
    }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transaction = await Transaction.find({}).sort({timestamp: -1})
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving transactions' });
    }
};

exports.getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User Username is required' });
        }
        
        const transactions = await Transaction.find({ userId }).sort({ timestamp: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};

