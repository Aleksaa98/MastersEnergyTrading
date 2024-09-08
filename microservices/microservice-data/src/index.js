const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Data Service');
});

const port = process.env.PORT || 3003;
app.listen(port, () => {
    console.log(`Data service running on port ${port}`);
});