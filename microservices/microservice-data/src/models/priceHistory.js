const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('PriceHistory', priceHistorySchema);
