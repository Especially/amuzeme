const express = require('express');
const router = express.Router();
const API_URL = process.env.FACEAI_API;
const API_KEY = process.env.FACEAI_KEY;
const axios = require('axios');

//Additional data to be used for future phases 
const options = {
    params: {
        'returnFaceId': 'true',
        'returnFaceLandmarks': 'false',
        'returnFaceAttributes': 'age,gender,smile,facialHair,glasses,' +
            'emotion,hair,makeup,accessories,blur,exposure,noise'
    },
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': API_KEY
    }
};

router.post('/', (req, res) => {
    axios.post(`${API_URL}/face/v1.0/detect`, req.body, options).then(response => {
        console.log(response.data);
        res.status(201).json(response.data);
    }).catch(err => {
        res.status(400).json({
            success: false,
            error: err
        })
    })
});

module.exports = router;