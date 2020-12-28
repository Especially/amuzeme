import React, { useState, useEffect } from 'react';
import './Profile.scss';
import axios from 'axios';
import HistoryItem from '../../components/HistoryItem/HistoryItem';

const Profile = ({ loggedIn, userID, userName, access, spotify_uID }) => {
    const [signedIn, setSignedIn] = useState(loggedIn);
    const [userHistory, setUserHistory] = useState(null);
    const [historyNotif, setHistoryNotif] = useState(false);
    const [notifMsg, setNotifMsg] = useState('');
    const [playlistID, setPlaylistID] = useState();

    useEffect(() => {
        setSignedIn(loggedIn);
        // Obtain user's listening data on component mount
        if (access) {
            axios
                .get(`/api/firebase/playlist/${userID}`)
                .then(res => {
                    const historyData = res.data;
                    const historyDataSuccess = historyData.success;
                    if (historyDataSuccess) {
                        setUserHistory(historyData.playlists);
                    } else {
                        console.log('No playlists')
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }, [loggedIn, access, userID, signedIn]);

    const historyNotifier = (msg) => {
        setHistoryNotif(true);
        setNotifMsg(msg);
        setTimeout(() => {
            destroyNotif();
        }, 5000)
    }

    const destroyNotif = () => {
        setHistoryNotif(false);
        setNotifMsg('');
    }

    // Database Management
    const removeFromDB = (playlistID) => {
        axios
            .delete(`/api/firebase/playlist/${playlistID}`)
            .then(res => {
                // Successfully removed from database
            })
            .catch(err => {
                console.log(err);
            })
    };

    // Remove Playlist from Spotify/DB
    const removePlaylist = (id, pID) => {
        const updatedList = userHistory.filter(item => item.id !== id);
        setUserHistory(updatedList);
        axios
            .delete(`/api/spotify/playlist/${pID}`, {
                headers: { access: access }
            })
            .then(() => {
                removeFromDB(id);
                historyNotifier('We\'ve removed the playlist from your Spotify account');
            })
            .catch(err => {
                console.error(err);
            })
    };

    // Listen to playlist
    const selectPlaylist = (id, pID) => {
        setPlaylistID(id);

    }
    return (
        <>
            <div className="content no-head">
                <h1 className="content__title text-xxl">Hey <span className="text-emphasis text-xxl">{userName}</span>!</h1>
                <div className="spotify-playlist history">

                    {(historyNotif) &&
                        <div className='container__overlay animated slideOutUp delay-4s' onClick={destroyNotif}>
                            <span className='container__notification animated slideInDown'>{notifMsg}</span>
                        </div>}
                    <div className="playlist__holder">
                        <div className="spotify-playlist__header">
                            <h3 className="text-m spotify-playlist__title">
                                <div className="spotify-playlist__logo"></div>
                                Your<span className="text-emphasis text-m">&nbsp;Mood&nbsp;</span><span className="text-grn text-m">&nbsp;History</span>
                            </h3>

                        </div>
                        <div className="spotify-playlist__container">
                            <div className="container__header">
                                <div className="container__cell">Date</div>
                                <div className="container__cell">Mood</div>
                                <div className="container__cell">Type</div>
                                <div className="container__cell"></div>
                            </div>
                            {(userHistory) ? userHistory.map(item => <HistoryItem key={item.id} data={item} clickHandler={() => selectPlaylist(item.playlistID)} removeHandler={() => removePlaylist(item.id, item.playlistID)} />) : null}
                        </div>
                    </div>
                    {(playlistID) && <iframe className="container__player animated slideInDown" title='Spotify Player' src={`https://open.spotify.com/embed/playlist/${playlistID}`} width="100%" height="600px" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>}
                </div>
            </div>
        </>
    )

};

export default Profile;