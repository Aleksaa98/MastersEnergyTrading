const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Trade Service');
});

const port = process.env.PORT || 3003;
app.listen(port, () => {
    console.log(`Trade service running on port ${port}`);
});