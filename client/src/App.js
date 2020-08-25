import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import './Global.scss';
import Header from './components/Header/Header';
import Main from './pages/Main/Main';
import Moody from './pages/Moody/Moody';
import Privacy from './pages/Privacy/Privacy';
import Profile from './pages/Profile/Profile';

function App() {
  const authTokens = JSON.parse(localStorage.getItem('tokens'));
  const [authParams] = useState(getHashParams());
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const [spotifyUserID, setSpotifyUserID] = useState(null);
  const [userID, setUserID] = useState(null);

  function getHashParams() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }


  function getUserData(access) {
    axios
      .get(`/spotify/profile/${access}`)
      .then(res => {
        let userName = res.data.userData.name.split(' ').splice(0, 1).join();
        let user_id = res.data.userData.spotify_id;
        let uID = res.data.userKey;
        setUserID(uID);
        setSpotifyUserID(user_id);
        setUserName(userName);
      })
      .catch(err => {
        console.error(err);
      })
  }


  function verifyToken(refresh) {
    axios
      .get(`/spotify/refresh_token/?refresh_token=${refresh}`)
      .then(res => {
        const access_token = res.data.access_token;
        setAccessToken(access_token);
        setRefreshToken(refresh);
        setLoggedIn(true);
        getUserData(access_token);
        localStorage.setItem('tokens', JSON.stringify({ 'access_token': res.data.access_token, 'refresh_token': refresh }));
      })
      .catch(err => {
        localStorage.removeItem('tokens');
        console.error(`Invalid refresh token stored on machine, purging.`);
      })
  }


  useEffect(() => {
    if (authTokens && !loggedIn) {
      // Tokens exist on local machine, lets see if they're valid before storing them in state and refresh the authentication tokens
      verifyToken(authTokens['refresh_token']);
    } else
      if (authParams['refresh_token'] && (!authTokens || !loggedIn)) {
        // User has likely just logged in, or returned to the page with hash params, verifying token
        verifyToken(authParams['refresh_token']);
      }
  })

  return (
    <>
      <BrowserRouter>
        <Header userName={userName} loggedIn={loggedIn} />
        <Switch>
          <Route path="/" exact render={() => <Main userName={userName} loggedIn={loggedIn} />} />
          <Route path="/moody" render={() => <Moody userName={userName} userID={userID} spotify_uID={spotifyUserID} loggedIn={loggedIn} access={accessToken} refresh={refreshToken} />} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/profile" render={() => <Profile userName={userName} userID={userID} spotify_uID={spotifyUserID} loggedIn={loggedIn} access={accessToken} />} />
          <Route path='/spotify/login' component={() => {
            (process.env.NODE_ENV === 'development') ? window.location.href = 'http://localhost:8080/spotify/login' :  window.location.href = '/spotify/login';
            return null;
          }} />
        </Switch>

      </BrowserRouter>
    </>
  );
}

export default App;
