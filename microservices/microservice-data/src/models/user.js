const mongoose = require('mongoose');

// Enum for user types
const userTypes = ['admin', 'customer'];
const walletStates = ['active', 'suspended', 'closed'];

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: userTypes,
        required: true
    },
    token: {
        type: String
    },
    wallet: {
        balance: {
            type: Number,
            default: 0
        },
        state: {
            type: String,
            enum: walletStates,
            default: 'closed'
        }
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
