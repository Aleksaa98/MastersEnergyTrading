const mongoose = require('mongoose');

const transactionTypes = ['deposit', 'withdrawal', 'buy', 'sell'];

const transactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: transactionTypes,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    stratName: {
        type:String,
        required:true
    },
});

module.exports = mongoose.model('TransactionHistory', transactionSchema);
