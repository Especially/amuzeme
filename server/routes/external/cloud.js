const express = require('express');
const router = express.Router();
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: './data/cloudaccesskey.json' });
const axios = require('axios');
const bucketName = 'amuzeme';


//https://github.com/googleapis/nodejs-storage/blob/master/samples/deleteFile.js

// Make Public
// Make Private
// Delete
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
const cloudPublic = (fileName) => {
    return new Promise((resolve, reject) => {
        resolve(storage.bucket(bucketName).file(fileName).makePublic());
    })
};
const cloudPrivate = (fileName) => {
    return new Promise((resolve, reject) => {
        resolve(storage.bucket(bucketName).file(fileName).makePrivate());
    })
};
const cloudDelete = (fileName) => {
    return new Promise((resolve, reject) => {
        resolve(storage.bucket(bucketName).file(fileName).delete());
    })
};


router.get('/:file', (req, res) => {
    let fileName = req.params.file;
    let filePath = `temp/${req.params.file}`;
    cloudUpload(filePath)
        .then(result => {
            console.log(result);
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        })
    console.log(fileName)
});

module.exports = router;