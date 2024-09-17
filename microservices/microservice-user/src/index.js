const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const publicUserRoutes = require('./routes/publicUserRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3004;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
  }));
app.use(bodyParser.json()); 

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/user', publicUserRoutes);

app.get('/', (req, res) => {
    res.send('User Service');
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`User service running on port ${port}`);
});