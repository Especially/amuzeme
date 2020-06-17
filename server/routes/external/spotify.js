const express = require('express');
const router = express.Router();
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const axios = require('axios');

// Vars
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://localhost:8080/spotify/callback';
const API_URL = 'https://api.spotify.com/v1';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

router.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

router.get('/login', function (req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email' + ' user-top-read user-read-playback-position user-read-recently-played' + ' user-follow-read' + ' user-library-modify user-library-read' + ' playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private' + ' streaming app-remote-control';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

router.get('/callback', function (req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        // Passing the token to the browser to make requests from there
        res.redirect('http://localhost:3000/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

router.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
      // Remove else if pain points still exist
    } else {
      res.status(400).json({ success: false, 'message': `Invalid refresh token` })
    }
  });
});

router.get('/profile/:access_token', (req, res) => {
  const access_token = req.params.access_token;
  axios
    .get(`${API_URL}/me`, {
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    })
    .then(result => {
      res.status(200).json(result.data);
    })
    .catch(err => {
      res.status(400).json({ success: false, "message": `There was an error retreiving User Data` })
    })

});

router.get('/recent/:access_token', (req, res) => {
  const access_token = req.params.access_token;
  axios
    .get(`${API_URL}/me/player/recently-played`, {
      params: { 'limit': 50 },
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    })
    .then(result => {
      res.status(200).json(result.data);
    })
    .catch(err => {
      res.status(400).json({ success: false, "message": `There was an error retreiving User Data` })
    })

});

router.get('/playlist/:mood', (req, res) => {
  const access_token = req.headers.access_token;
  const mood = req.params.mood;
  const artists = JSON.parse(req.headers.artists);
  let artistsSeed = (artists) ? {'seed_artists': artists.join(',')} : null;
  let parameters, moodParams, moodSeed;
  
  switch (mood) {
    case 'anger':
      moodParams = {'max_valence': '0.4', 'min_energy':'0.7', 'target_tempo':'0.8'};
      moodSeed = {'seed_genres':'metal,electro,hard-rock,heavy-metal,metalcore'};
      break;
    case 'contempt':
      moodParams = {'target_valence': '0.5', 'target_energy':'0.5', 'target_tempo':'0.4', 'target_danceability':'0.5'};
      moodSeed = {'seed_genres':'classical,folk,sleep,study,ambient'};
      break;
    case 'disgust':
      moodParams = {'target_valence': '0.4', 'min_energy':'0.7', 'target_tempo':'0.5', 'target_danceability':'0.5'};
      moodSeed = {'seed_genres':'grunge,electro,progressive-house,deep-house'};
      break;
    case 'fear':
      moodParams = {'max_valence': '0.5', 'target_energy':'1.0', 'min_tempo':'0.7', 'target_danceability':'1.0'};
      moodSeed = {'seed_genres':'punk-rock,metal,trance,deep-house,goth'};
      break;
    case 'happiness':
      moodParams = {'target_valence': '1.0', 'min_energy':'0.7', 'min_tempo':'0.7', 'target_danceability':'1.0'};
      moodSeed = {'seed_genres':'happy,pop,edm,dance,party'};
      break;
    case 'neutral':
      moodParams = {'max_valence': '0.4', 'target_energy':'0.5', 'target_tempo':'0.5', 'target_danceability':'0.4'};
      moodSeed = {'seed_genres':'indie,synth-pop,chill,pop,r-n-b'};
      break;
    case 'sadness':
      moodParams = {'max_valence': '0.3', 'target_energy':'0.5', 'target_tempo':'0.4', 'target_danceability':'0.5'};
      moodSeed = {'seed_genres':'sad,indie,progressive-house,r-n-b'};
      break;
    case 'surprise':
      moodParams = {'min_valence': '0.6', 'target_energy':'0.6', 'target_tempo':'0.4', 'target_danceability':'0.6'};
      moodSeed = {'seed_genres':'pop,k-pop,r-n-b,latino'};
      break;
  }
  // Need more seed info to prevent lack of results due to user's low listening history
  if (artists.length < 5 && artists.length > 0) {
    const end = 5 - artists.length;
    let slicedGenres = moodSeed.seed_genres.split(',').slice(0,end).join(',');
    artistsSeed = {'seed_genres': slicedGenres, ...artistsSeed};
  }
  parameters = (artists.length > 0) ? {...artistsSeed, ...moodParams} : {...moodSeed, ...moodParams};
  console.log(parameters);
  axios
    .get(`${API_URL}/recommendations`, {
      params: parameters,
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    })
    .then(result => {
      res.status(200).json(result.data);
    })
    .catch(err => {
      console.log(err.data);
      res.status(400).json({ success: false, "message": `There was an error retreiving User Data: ${err}` })
    })

});

module.exports = router;