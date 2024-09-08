const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Customer Service');
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Customer service running on port ${port}`);
});
