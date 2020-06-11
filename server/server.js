require('dotenv').config();

// Libs
const PORT = process.env.PORT;
const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(express.json());
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