import React, { useState, useEffect } from 'react';
import { Redirect, Switch, Route, NavLink } from 'react-router-dom';
import './Moody.scss';
import axios from 'axios';
import NumberIcon from '../../components/Number/Number';
import Selfies from '../../components/Selfies/Selfies';
import Playlist from '../../components/Playlist/Playlist';
import TextAnalysis from '../../components/TextAnalysis/TextAnalysis';

function Moody({ loggedIn, userName, access, user_id }) {
    const [signedIn, setSignedIn] = useState(loggedIn);
    const [artists, setArtists] = useState([]);
    const [mood, setMood] = useState(null);
    const [playlistData, setPlaylistData] = useState(null);

    useEffect(() => {
        setSignedIn(loggedIn);
        setPlaylistData(playlistData);
        // Obtain user's listening data on component mount
        if (access) {
            axios
                .get(`/spotify/recent/${access}`)
                .then(res => {
                    uniqueArtists(res.data.items);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [loggedIn, userName, access, playlistData]);

    function uniqueArtists(arr) {
        // Using Set to obtian all unique artists within array of songs listened to, etc.

        // change object property 'name' to 'id', retain name for visualization in console.
        const unique = [...new Set(arr.map(item => item.track.artists[0].id))];
        const limit = (arr.length >= 5) ? 5 : arr.length;
        const randomArtists = [];
        while (randomArtists.length < limit) {
            const randomIndex = Math.floor(Math.random() * unique.length);
            const randomArtistID = unique[randomIndex];
            randomArtists.push(randomArtistID);
            unique.splice(randomIndex, 1);
        }
        setArtists(randomArtists);
    }
    const toTitleCase = (str) => {
        return str.replace(/^./, str[0].toUpperCase());
    }

    const analyzeMood = (data, type) => {
        // Obtain all emotional data returned from face AI, sort based off of emotion and return highest emotion exhibited
        let emotion, realEmotion;
        if (type === 0) {// Selfies
            if (data.length === 3) {
                const selfieOne = Object.values(data[0].emotion);
                const selfieTwo = Object.values(data[1].emotion);
                const selfieThree = Object.values(data[2].emotion);
                const selfieKeys = Object.keys(data[0].emotion).map((item, i) => { return ({ 'emotion': item, 'value': (selfieOne[i] + selfieTwo[i] + selfieThree[i]) / 3 }) }).sort((a, b) => b.value - a.value);
                emotion = toTitleCase(selfieKeys[0].emotion);
            }
        } else
            if (type === 1) { //Tone Analysis
                const totalTones = data.length;
                const emotions = { 'anger': 'anger', 'fear': 'fear', 'joy': 'happiness', 'sadness': 'sadness', 'analytical': 'contempt', 'confident': 'neutral', 'tentative': 'surprise' };
                if (totalTones > 1) {
                    data.sort((a, b) => b['score'] - a['score']);
                    console.log(data);
                }
                realEmotion = toTitleCase(data[0].tone_id);
                emotion = toTitleCase(emotions[data[0].tone_id]);
            }
        axios
            .get(`/spotify/playlist/${emotion.toLowerCase()}`, {
                headers: { 'access_token': access, 'artists': JSON.stringify(artists) }
            })
            .then(res => {
                (type === 0) ? setMood({ 'mood': emotion, 'type': type }) : setMood({ 'mood': emotion, 'type': type, 'real': realEmotion });
                setPlaylistData(res.data.tracks);
            })
            .catch(err => {
                console.log(err);
            })

    }

    return (
        <>
            {(signedIn) ?
                <>
                    <div className="content">
                        <h1 className="content__title text-xxl">Let's get <span className="text-emphasis text-xxl">Moody</span></h1>
                        <ul className="moody-menu">
                            <NavLink activeClassName='active animated slideInLeft' exact className="moody-menu__link" to='/moody'><li className="moody-menu__item">Selfie</li></NavLink>
                            <NavLink activeClassName='active animated slideInRight' className="moody-menu__link" to='/moody/text-analysis'><li className="moody-menu__item">Text Analysis</li></NavLink>
                        </ul>
                        <Switch>
                            <Route path="/moody" exact render={() => {
                                return (
                                    <Selfies
                                        userName={userName}
                                        analyze={analyzeMood}
                                    />)
                            }} />
                            <Route path="/moody/text-analysis" exact render={() => {
                                return (
                                    <TextAnalysis
                                        userName={userName}
                                        analyze={analyzeMood}
                                    />)
                            }} />
                        </Switch>
                        {(mood) &&
                            <>
                                <div className="content__heading">
                                    <NumberIcon num="3" />
                                    <h2 className="content__sub-title text-xl">Jam Out!</h2>
                                </div>
                                <div className="content__holder">
                                    <div className="content__info">
                                        <p className="content__text">Looks like we found a <span className="text-emphasis">{(mood.type === 0) ? mood.mood : mood.real}</span> playlist just for you.</p>
                                        {(artists.length > 0) ?
                                            <p className="content__text">We grabbed some of your favorite artists that you like to listen to and curated a Spotify playlist based off of your <span className="text-emphasis">{(mood.type === 0) ? mood.mood : mood.real}</span> mood.</p> :
                                            <p className="content__text">We've noticed that your Spotify listening history is a little bare, but don't fret! We still created a <span className="text-emphasis">{(mood.type === 0) ? mood.mood : mood.real}</span> playlist just for you!</p>}
                                    </div>
                                </div>
                                <Playlist playlist={playlistData} emotion={(mood.type === 0) ? mood.mood : mood.real} userID={user_id} access_token={access} />
                            </>
                        }
                    </div>
                </>
                :
                <Redirect to='/' />
            }
        </>
    );
}

export default Moody;
