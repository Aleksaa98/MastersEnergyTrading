const Battery = require('../models/battery');
const mongoose = require('mongoose');

// Get all batteries
exports.getBatteries = async (req, res) => {
    try {
        const batteries = await Battery.find({}).sort({ createdAt: 1 });
        res.status(200).json(batteries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single battery by ID
exports.getBattery = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such battery' });
    }

    try {
        const battery = await Battery.findById(id);
        if (!battery) {
            return res.status(404).json({ error: 'No such battery' });
        }
        res.status(200).json(battery);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new battery
exports.createBattery = async (req, res) => {
    const { capacity, stateOfCharge, traderId, tradingStrat, state } = req.body;

    try {
        const battery = await Battery.create({ capacity, stateOfCharge, traderId, tradingStrat, state });
        res.status(200).json(battery);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a battery by ID
exports.deleteBattery = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such battery' });
    }

    try {
        const battery = await Battery.findOneAndDelete({ _id: id });
        if (!battery) {
            return res.status(404).json({ error: 'No such battery' });
        }
        res.status(200).json(battery);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a battery by ID
exports.updateBattery = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such battery' });
    }

    try {
        const updateFields = req.body;

        const battery = await Battery.findOneAndUpdate(
            { _id: id },
            { $set: updateFields }, 
            { new: true, runValidators: true }
        );

        if (!battery) {
            return res.status(404).json({ error: 'No such battery' });
        }

        res.status(200).json(battery);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

