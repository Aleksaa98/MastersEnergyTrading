const axios = require('axios');
const PriceHistory = require('../models/priceHistory');

async function fetchAndSavePrice() {
    try {
        const response = await axios.get('https://hourlypricing.comed.com/api?type=currenthouraverage');

        if (response.data && response.data.length > 0){
            const priceData = response.data[0];
            const { millisUTC, price} = priceData;

            const date = new Date(parseInt(millisUTC,10));

            const priceHistory = new PriceHistory({
                price: parseFloat(price),
                date: date
            });

            await priceHistory.save();
        }
    } catch (error) {
        console.error("Error fetching or saving price:", error.message);
    }
}

module.exports = fetchAndSavePrice;