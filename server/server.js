require('dotenv').config();

// Libs
const PORT = process.env.PORT;
const express = require('express');
const app = express();
const cors = require('cors');

// Routes
const faceAiRoute = require('./routes/external/faceAi');
const cloudRoute  = require('./routes/external/cloud');

// Port


// Middleware
app.use(cors());
app.use(express.json());

// External Routes
    //Face AI Route
    app.use('/face-ai', faceAiRoute);

    //Cloud Route
    app.use('/cloud', cloudRoute);



app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}.`)
})