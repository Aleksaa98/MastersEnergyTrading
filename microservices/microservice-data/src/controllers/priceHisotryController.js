const PriceHistory = require('../models/priceHistory');
const axios = require('axios');

const getPriceHistory = async (req, res) => {
    try {
        const history = await PriceHistory.find().sort({ date: -1 }).limit(100); // Fetch the last 100 entries
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching price history' });
    }
};

const getCurrentPrice = async (req, res) => {
    try {
        const currentPrice = await PriceHistory.findOne().sort({ date: -1 }); // Fetch the most recent entry
        if (currentPrice) {
            res.status(200).json(currentPrice);
        } else {
            res.status(404).json({ message: 'No price data available' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching current price' });
    }
};

const getPriceHistoryAndPrediction = async (req, res) => {
  try {
    const response = await PriceHistory.find();
    const prices = response;

    const actual = prices.slice(-8).reverse();

    res.status(200).json({ actual });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching or generating price data' });
  }
};


module.exports = {
    getPriceHistory,
    getCurrentPrice,
    getPriceHistoryAndPrediction
};
