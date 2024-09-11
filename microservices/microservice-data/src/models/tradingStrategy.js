const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tradingStrategySchema = new Schema({
    name: {
        type:String,
        required:true,
        unique:true
    },
    type: {
        type:String,
        required:true
    },
    parameters: {
        type: Map, // Using Map to store key-value pairs
        of: Schema.Types.Mixed,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('tradingStrategy', tradingStrategySchema);