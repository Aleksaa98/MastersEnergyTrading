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

//!   OVO JE SAMO PRIMER



const getPriceHistoryAndPrediction = async (req, res) => {
  try {
    // Get last 10 prices from microservice-data
    const response = await PriceHistory.find();
    const prices = response;

    const actual = prices.slice(-8).reverse();// oldest to newest

    const startDate = new Date('2025-07-20T00:00:00Z'); // July 20, 2025 midnight UTC
    const basePrice = 5; // starting price, just as example

    const predicted = Array.from({ length: 5 }).map((_, i) => ({
    price: +(basePrice + i * 0.5).toFixed(2), // increase by 0.5 each hour
    date: new Date(startDate.getTime() + i * 60 * 60 * 1000) // hourly increments
    }));

    res.status(200).json({ actual, predicted });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching or generating price data' });
  }
};
//!  KRAJ


module.exports = {
    getPriceHistory,
    getCurrentPrice,
    getPriceHistoryAndPrediction
};
