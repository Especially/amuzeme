const express = require('express');
const router = express.Router();
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: './data/cloudaccesskey.json' });
const imageDataURI = require('image-data-uri');
const fs = require('fs');
const { uuid } = require('uuidv4');
const axios = require('axios');

// Vars
const bucketName = 'amuzeme';
const storageURL = `https://storage.cloud.google.com/${bucketName}`;

// Upload to cloud promise
const cloudUpload = (localFile) => {
    return new Promise((resolve, reject) => {
        resolve(storage.bucket(bucketName).upload(localFile, {
            gzip: true,
            metadata: {
                cacheControl: 'public, max-age=31536000',
            },
        })
        );
    })
};

// Make public on cloud promise
const cloudPublic = (fileName) => {
    return new Promise((resolve, reject) => {
        resolve(storage.bucket(bucketName).file(fileName).makePublic());
    })
};

// Make private on cloud promise
const cloudPrivate = (fileName) => {
    return new Promise((resolve, reject) => {
        resolve(storage.bucket(bucketName).file(fileName).makePrivate());
    })
};

// Make delete from cloud promise
const cloudDelete = (fileName) => {
    return new Promise((resolve, reject) => {
        resolve(storage.bucket(bucketName).file(fileName).delete());
    })
};

// { "uri": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="}
router.post('/generate', (req, res) => {
    const imageURI = req.body.uri;
    const imageName = uuid();
    const imagePath = `./temp/${imageName}.png`;
    if (imageURI) {
        imageDataURI.outputFile(imageURI, imagePath)
            // Temporary file created
            .then(result => {
                // Upload to the cloud
                return cloudUpload(result);

            }).then(() => {
                // Image successfully uploaded, remove from local temp store
                fs.unlinkSync(imagePath)
                // Make image public on server
                return cloudPublic(`${imageName}.png`);
            })
            .catch(err => {
                res.status(400).json({ 'success': false, 'message': err })
            })
        // Return cloud URL to client and handle from there
        res.status(201).json({ success: true, image: `${storageURL}/${imageName}.png`, id: imageName});
    } else {
        res.status(400).json({ 'success': false, 'message': 'No data URI has been provided' })
    }

});

router.delete('/purge/:image', (req, res) => {
    const imageID = req.params.image;
    if (imageID) {
        cloudDelete(imageID)
            .then(() => {
                res.status(204).json({'success': true, 'message': `Resource (${imageID}) removed from the cloud.`})
            })
            .catch( err => {
                res.status(400).json({'success': false, 'message': `${err}`})
            });
    } else {
        res.status(400).json({'success': false, 'message': `Resource not provided`})
    }
});

module.exports = router;