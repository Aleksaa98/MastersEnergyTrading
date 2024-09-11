const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('User Service');
});

const port = process.env.PORT || 3004;
app.listen(port, () => {
    console.log(`User service running on port ${port}`);
});
