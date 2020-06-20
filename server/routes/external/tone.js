const express = require('express');
const router = express.Router();
const API_URL = process.env.TONE_API;
const API_KEY = process.env.TONE_KEY;
const axios = require('axios');
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
    version: '2017-09-21',
    authenticator: new IamAuthenticator({
        apikey: API_KEY,
    }),
    url: API_URL,
});

router.post('/', (req, res) => {
    const toneParams = {
        toneInput: req.body,
        contentType: 'application/json',
        sentences: false
      };
    toneAnalyzer.tone(toneParams)
        .then(response => {
            res.status(201).json(response.result.document_tone.tones);
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                error: err
            })
        });
    // axios.post(`${API_URL}&sentences=false`, req.body, options)
    //     .then(response => {
    //         res.status(201).json(response.data);
    //         console.log(response);
    //     }).catch(err => {
    //         console.log(err);
    //         res.status(400).json({
    //             success: false,
    //             error: err
    //         })
    //     })
});

module.exports = router;