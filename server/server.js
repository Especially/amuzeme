require('dotenv').config();

// Libs
const PORT = process.env.PORT;
const express = require('express');
const app = express();
const path = require("path");
const cors = require('cors');
// const logger = require("./middleware/logger");

// Middleware
// Setting max limit as opposed default 100kb limit to process data URIs
app.use(express.json({ limit: '10MB' }));
app.use(cors());

// Routes
const faceAiRoute = require('./routes/external/faceAi');
const cloudRoute = require('./routes/external/cloud');
const spotifyRoute = require('./routes/external/spotify');
const toneRoute = require('./routes/external/tone');
const firebaseRoute = require('./routes/external/firebase');

// External Routes

// //  init middleware
// app.use(logger);

//Face AI Route
app.use('/face-ai', faceAiRoute);

//Cloud Route
app.use('/cloud', cloudRoute);

//Spotify Route
app.use('/spotify', spotifyRoute);

//Tone Analyzer Route
app.use('/tone', toneRoute);

// //Tone Analyzer Route
app.use('/firebase', firebaseRoute);

if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("../client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
    });
}



app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}.`)
})