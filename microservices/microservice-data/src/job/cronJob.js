const cron = require('node-cron');
const fetchAndSavePrice = require('../services/priceService');

const fetchPriceData = () => {
    console.log('Fetching price data...');
    fetchAndSavePrice();
};

fetchPriceData();

cron.schedule('0 * * * *', () => {
    fetchPriceData();
});