require('dotenv').config();

// Libs
const PORT = process.env.PORT;
const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
// Setting max limit as opposed default 100kb limit to process data URIs
app.use(express.json({ limit: '10MB' }));
app.use(cors());

// Routes
const faceAiRoute = require('./routes/external/faceAi');
const cloudRoute  = require('./routes/external/cloud');
const spotifyRoute  = require('./routes/external/spotify');

// External Routes
    //Face AI Route
    app.use('/face-ai', faceAiRoute);

    //Cloud Route
    app.use('/cloud', cloudRoute);

    //Spotify Route
    app.use('/spotify', spotifyRoute);



app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}.`)
})