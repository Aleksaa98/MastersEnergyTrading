const mongoose = require('mongoose');

// Enum for battery states
const batteryStates = ['charging', 'discharging', 'pending', 'blocked', 'idle','faulty'];

const batterySchema = new mongoose.Schema({
    capacity: {
        type: Number,
        required: true
    },
    stateOfCharge: {
        type: Number,
        required: true
    },
    traderUsername: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: batteryStates,
        required: true
    },
    tradingStrat: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Battery', batterySchema);


