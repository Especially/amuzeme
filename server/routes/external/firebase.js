const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const config = {
    apiKey: "***REMOVED***",
    authDomain: "***REMOVED***",
    databaseURL: "***REMOVED***",
    projectId: "***REMOVED***",
    storageBucket: "***REMOVED***.appspot.com",
    messagingSenderId: "***REMOVED***",
    appId: "1:***REMOVED***:web:d1034114f2da5b1524a5e4",
    measurementId: "***REMOVED***"
};
firebase.initializeApp(config);

// Get a reference to the database service
const db = firebase.database();
const usersRef = db.ref('users');
const playlistsRef = db.ref('playlists');


router.post('/auth', (req, res) => {
    const userName = req.body.username;
    const userEmail = req.body.email;
    const userID = req.body.id;
    const timestamp = new Date().getTime();
    const data = { 'name': userName, 'email': userEmail, 'spotify_id': userID, timestamp };
    usersRef.orderByChild('spotify_id').equalTo(userID).once('value', (snapshot) => {
        // Spotify user already exists in the DB, return user info
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                // User Exists
                const userKey = childSnapshot.key;
                const userData = childSnapshot.val();
                res.status(200).json({ success: true, userKey, userData });
            })
            // User doesn't exist in the db, auto register and return data
        } else {
            usersRef.push(data).then(result => {
                const userKey = result.key;
                res.status(201).json({ success: true, userKey, data });
            }).catch(err => {
                res.status(400).json({ 'success': false, 'error': err })
            })
        }

    })
});

router.post('/playlist', (req, res) => {
    const { userID, playlistID, mood, type } = req.body;
    const timestamp = new Date().getTime();
    const data = { userID, playlistID, mood, type, timestamp };
    playlistsRef.push(data).then((result) => {
        res.status(201).json({ success: true, id: result.key,  message: 'Successfully added playlist to database' });
    }).catch(err => {
        res.status(400).json({ 'success': false, 'error': err })
    })
});

router.get('/playlist/:userID', (req, res) => {
    const userID = req.params.userID;   
    playlistsRef.orderByChild('userID').equalTo(userID).once('value', (snapshot) => {
        // If playlists exists, return the values
        if (snapshot.exists()) {
            let playlists = [];
            snapshot.forEach((childSnapshot) => {
                // Playlists Exist
                const playlistData = childSnapshot.val();
                const playlistKey = childSnapshot.key;
                playlists.push({...playlistData, id: playlistKey});
            })
            res.status(200).json({ success: true, playlists });
        } else {
            res.status(200).json({ 'success': false, message: 'No playlists found' })
        }

    })
});

router.delete('/playlist/:id', (req, res) => {
    const ID = req.params.id;
    const playlistID = playlistsRef.child(ID);
    playlistID.remove()
    .then(() => {
        res.status(204).json({success: true, message: 'Successfully removed playlist from the database.'})
    })
    .catch( err => {
        console.log(err);
        res.status(400).json({success: false, message: 'Failed to remove the playlist from the database.', err})
    })
});

module.exports = router;