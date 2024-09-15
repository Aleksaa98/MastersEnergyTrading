const axios = require('axios');

const DATA_SERVICE_URL = 'http://localhost:3001/api/batteries';

// Get all batteries
exports.getBatteries = async (req, res) => {
    try {
        const response = await axios.get(DATA_SERVICE_URL);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new battery
exports.createBattery = async (req, res) => {
    try {
        const response = await axios.post(DATA_SERVICE_URL, req.body);
        res.status(201).json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single battery by ID
exports.getBattery = async (req, res) => {
    const { batteryId } = req.params;
    try {
        const response = await axios.get(`${DATA_SERVICE_URL}/${batteryId}`);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a battery by ID
exports.updateBattery = async (req, res) => {
    const { batteryId } = req.params;
    try {
        const response = await axios.patch(`${DATA_SERVICE_URL}/${batteryId}`, req.body);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a battery by ID
exports.deleteBattery = async (req, res) => {
    const { batteryId } = req.params;
    try {
        await axios.delete(`${DATA_SERVICE_URL}/${batteryId}`);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get batteries for a specific user
exports.getUserBatteries = async (req, res) => {
    const { userId } = req.params;
    try {
        const response = await axios.get(`${DATA_SERVICE_URL}/user/${userId}`);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
