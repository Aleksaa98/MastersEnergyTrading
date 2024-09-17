const axios = require('axios');

const MICROSERVICE_DATA_URL = 'http://localhost:3001';

const getPriceHistory = async (req, res) => {
    try {
        const response = await axios.get(`${MICROSERVICE_DATA_URL}/api/price/history`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching price history:', error);
        res.status(500).json({ message: 'Error fetching price history' });
    }
};

const getCurrentPrice = async (req, res) => {
    try {
        const response = await axios.get(`${MICROSERVICE_DATA_URL}/api/price/current`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching current price:', error);
        res.status(500).json({ message: 'Error fetching current price' });
    }
};

module.exports = {
    getPriceHistory,
    getCurrentPrice
};
