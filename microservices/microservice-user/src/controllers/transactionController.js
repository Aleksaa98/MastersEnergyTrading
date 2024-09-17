const axios = require('axios');

const DATA_SERVICE_URL = 'http://localhost:3001/api';
const JWT_SECRET = process.env.JWT_SECRET;

exports.createTransaction = async (req, res) => {
    try {
        const { userId, type, amount, timestamp, stratName } = req.body;

        const response = await axios.post(`${DATA_SERVICE_URL}/transaction`, {
            userId,
            type,
            amount,
            timestamp,
            stratName
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Error creating transaction' });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const response = await axios.get(`${DATA_SERVICE_URL}/transaction`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        res.status(500).json({ error: 'Error retrieving transactions' });
    }
};

exports.getUserTransactions = async (req, res) => {
    const { userId } = req.params;

    try {
        const response = await axios.get(`${DATA_SERVICE_URL}/transaction/${userId}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching user transactions:', error);
        res.status(500).json({ error: 'Error fetching user transactions' });
    }
};
