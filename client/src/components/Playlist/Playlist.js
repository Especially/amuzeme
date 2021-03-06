import React, { useState, useEffect } from 'react';
import './Playlist.scss';
import axios from 'axios';
import PlaylistItem from '../PlaylistItem/PlaylistItem';

function Playlist({ type, userID, playlist, emotion, spotify_uID, access_token }) {
    const [musicPlaylist, setMusicPlaylist] = useState(null);
    const [mood, setMood] = useState(emotion);
    const [playlistID, setPlaylistID] = useState(null);
    const [playlistNotif, setPlaylistNotif] = useState(false);
    const [playlistMsg, setPlaylistMsg] = useState('');
    const [playlistDB, setPlaylistDB] = useState(null);

    useEffect(() => {
        setMusicPlaylist(playlist);
        setMood(emotion);

    }, [playlist, emotion])

    // Database Management
    const addToDB = (playlistID, typeID) => {
        const data = { userID, playlistID, mood: emotion, type: typeID };
        axios
            .post('/api/firebase/playlist', data)
            .then(res => {
                setPlaylistDB(res.data.id);
            })
            .catch(err => {
                console.log(err);
            })
    };

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

    // Add tracks to newly created Spotify playlist
    const addSongs = (id, songURIs) => {
        axios.post('/api/spotify/playlist/add',
            {
                access: access_token,
                data: songURIs,
                playlist_id: id
            })
            .then(() => {
                playlistNotifier('Your songs have been added! Just click play to start jammin out!');
            }).catch(err => {
                console.error(err);
            })
    }

    // Generate spotify playlist
    const createPlaylist = (e) => {
        const isSaved = e.target.classList.contains('saved');
        // If the playlist hasn't been saved then create new playlist through our API
        if (!isSaved) {
            const playlistData = { 'name': `AmuzeMe ${emotion} Playlist`, 'public': 'false', 'description': `On ${new Date()} you created a playlist based on your ${emotion} mood.` };
            const playlistTracks = musicPlaylist.map(item => `spotify:track:${item.id}`);
            axios.post('/api/spotify/playlist/generate',
                {
                    access: access_token,
                    data: playlistData,
                    user_id: spotify_uID
                })
                .then(res => {
                    const ID = res.data;
                    addToDB(ID, type);
                    playlistNotifier('We\'ve created your playlist, hang on while we add your songs');
                    setPlaylistID(ID);
                    addSongs(ID, playlistTracks);
                })
                .catch(err => {
                    playlistNotifier('There was an error while trying to save this playlist');
                    console.error(err);
                })
        } else {
            axios
                .delete(`/api/spotify/playlist/${playlistID}`, {
                    headers: { access: access_token }
                })
                .then(() => {
                    removeFromDB(playlistDB);
                    playlistNotifier('We\'ve removed the playlist from your Spotify account');
                    setPlaylistID(null);
                })
                .catch(err => {
                    playlistNotifier('There was an unexpected error, please try again.');
                    console.error(err);
                })
        }
    };

    // Remove song from Spotify playlist / local state
    const removeSong = (id) => {
        const updatedList = musicPlaylist.filter(item => item.id !== id);
        setMusicPlaylist(updatedList);
        if (playlistID) {
            axios
                .delete(`/api/spotify/playlist/track/${id}`, {
                    headers: { access: access_token, playlist: playlistID }
                })
                .then(() => {
                    // Do nothing, successfully deleted and removed from virtual dom.
                })
                .catch(err => {
                    console.error(err);
                })
        }
    };

    // Notification functions
    const playlistNotifier = (msg) => {
        setPlaylistNotif(true);
        setPlaylistMsg(msg);
        setTimeout(() => {
            destroyNotif();
        }, 5000)
    }

    const destroyNotif = () => {
        setPlaylistNotif(false);
        setPlaylistMsg('');
    }

    return (
        <>
            <section className="playlist">
                <div className="content">
                    <h1 className="content__title text-xxl">We found a <span className="text-emphasis text-xxl">{mood}</span> playlist for you on <span className="text-grn text-xxl">Spotify</span></h1>
                    <div className="spotify-playlist">

                        {(playlistNotif) &&
                            <div className='container__overlay animated slideOutUp delay-4s' onClick={destroyNotif}>
                                <span className='container__notification animated slideInDown'>{playlistMsg}</span>
                            </div>}

                        {(playlistID) && <iframe title='Spotify Player' src={`https://open.spotify.com/embed/playlist/${playlistID}`} width="100%" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>}
                        
                        <div className="spotify-playlist__header">
                            <h3 className="text-m spotify-playlist__title">
                                <div className="spotify-playlist__logo"></div>
                                <span className="text-emphasis text-m">{mood}&nbsp;</span>playlist from<span className="text-grn text-m">&nbsp;Spotify</span>
                            </h3>

                            <svg xmlns="http://www.w3.org/2000/svg" className="spotify-playlist__save" title="Save playlist on Spotify" viewBox="0 0 38 35" x="0px" y="0px" version="1.1">
                                <path onClick={createPlaylist} className={(playlistID) ? 'spotify-playlist__save-icon saved' : 'spotify-playlist__save-icon'} d="M5.35,20.68C1.56,15.09,0.6,10.19,4.48,6.7c4.68-4.22,11.97-3.18,14.71,2.33c2.58-4.57,8.79-6.71,13.33-3.48
	c5.32,3.79,3.71,10.12,0.61,14.74c-3.23,4.83-7.37,8.3-12.49,11.1c-1.32,0.72-1.86,0.58-2.74,0.18
	C13.73,29.67,7.21,23.42,5.35,20.68z"/>
                            </svg>
                            
                        </div>
                        <div className="spotify-playlist__container">
                            <div className="container__header">
                                <div className="container__cell">Duration</div>
                                <div className="container__cell">Song</div>
                                <div className="container__cell">Artist(s)</div>
                                <div className="container__cell">Album</div>
                                <div className="container__cell"></div>
                            </div>
                            {(musicPlaylist) ? musicPlaylist.map(item => <PlaylistItem key={item.id} data={item} clickHandler={() => removeSong(item.id)} />) : null}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Playlist;
