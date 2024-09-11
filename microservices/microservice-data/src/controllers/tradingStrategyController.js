const TradingStrategy = require('../models/tradingStrategy')
const mongoose = require('mongoose')

exports.getTradingStrategies = async (req,res) => {
    const tradingStrategies = await TradingStrategy.find({}).sort({createdAt: 1})

    res.status(200).json(tradingStrategies)
}

exports.getTradingStrategy = async (req,res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such trading strategy'})
    }

    const tradingStrategy = await TradingStrategy.findById(id)
    if(!tradingStrategy) {
        return res.status(404).json({error: 'No such trading strategy'})
    }

    res.status(200).json(tradingStrategy)
}

exports.createTradingStrategy = async (req,res) => {
    const {name,type,parameters} = req.body

    try{
        const tradingStrategy = await TradingStrategy.create({name,type,parameters})
        res.status(200).json(tradingStrategy)
    } catch(err) {
        res.status(500).json({Err: err.message})
    }
}

exports.deleteTradingStrategy = async (req,res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such trading strategy'})
    }

    const tradingStrategy = await TradingStrategy.findOneAndDelete({_id: id})
    if(!tradingStrategy) {
        return res.status(404).json({error: 'No such trading strategy'})
    }

    res.status(200).json(tradingStrategy)
}

exports.updateTradingStrategy = async (req,res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such trading strategy'})
    }
    
    const tradingStrategy = await TradingStrategy.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true } 
      );


    if(!tradingStrategy) {
        return res.status(404).json({error: 'No such trading strategy'})
    }

    res.status(200).json(tradingStrategy)
}