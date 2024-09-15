const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const batteryRoutes = require('./routes/batteryRoutes');
const transactionRoutes = require('./routes/transactionsRoutes')
const app = express();

require('dotenv').config();
const port = process.env.PORT || 3003;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
  }));
app.use(bodyParser.json()); 

app.use('/api/battery', batteryRoutes);
app.use('/api/transactions',transactionRoutes);

app.get('/', (req, res) => {
    res.send('Trade Service');
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Trade service running on port ${port}`);
});