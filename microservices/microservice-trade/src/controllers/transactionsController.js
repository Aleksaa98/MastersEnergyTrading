const axios = require('axios');

const TRANSACTION_SERVICE_URL = 'http://localhost:3001/api/transaction';

// Get all transactions
exports.getTransactions = async (req, res) => {
    try {
        const response = await axios.get(TRANSACTION_SERVICE_URL);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const response = await axios.post(TRANSACTION_SERVICE_URL, req.body);
        res.status(201).json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get transactions for a specific user
exports.getUserTransactions = async (req, res) => {
    const { userId } = req.params;
    try {
        const response = await axios.get(`${TRANSACTION_SERVICE_URL}/${userId}`);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
