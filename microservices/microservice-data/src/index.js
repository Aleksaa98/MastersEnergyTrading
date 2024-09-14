const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes')
const batteryRoutes = require('./routes/batteryRoutes')
const tradingStrategyRoutes = require('./routes/tradingStrategyRoutes')
const priceHistoryRoutes = require('./routes/priceHistoryRoutes')
const transactionHistoryRoutes = require('./routes/transactionHistoryRoutes')

const app = express();
const port = process.env.PORT;

// Middleware to parse JSON
app.use(express.json());

// routes
app.use('/api/users', userRoutes);
app.use('/api/batteries', batteryRoutes);
app.use('/api/tradingStrategies', tradingStrategyRoutes)
app.use('/api/price', priceHistoryRoutes)
app.use('/api/transaction',transactionHistoryRoutes)

// Check if MONGO_URI is defined
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('MONGO_URI environment variable is not set');
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoUri, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});

// Define a test route
app.get('/', (req, res) => {
    res.send('Data Service connected to MongoDB');
});

// Start the server
app.listen(port, () => {
    console.log(`Data service running on port ${port}`);
});