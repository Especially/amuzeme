import React, { useState, useEffect } from 'react';
import './Playlist.scss';
import axios from 'axios';
import PlaylistItem from '../PlaylistItem/PlaylistItem';

function Playlist({ playlist, emotion }) {
    const [musicPlaylist, setMusicPlaylist] = useState(null);
    const [mood, setMood] = useState(emotion);
    const [playlistInfo, setPlaylistInfo] = useState({})

    useEffect(() => {
        setMusicPlaylist(playlist);
        setMood(emotion);
        setPlaylistInfo({'name':`AmuzeMe ${emotion} Playlist`,'public':'false',})

    }, [playlist, emotion])
    console.log(playlist, emotion)
    const createPlaylist = () => {
        const playlistData = {'name':`AmuzeMe ${emotion} Playlist`,'public':'false','description':`On ${new Date() } you created a playlist based on your ${emotion} mood.`};
        const playlistTracks = musicPlaylist.map(item => `spotify:track:${item.id}`);
        console.log(playlistData, playlistTracks);
    };

    return (
        <>
            <section className="playlist">
                <div className="content">
                    <h1 className="content__title text-xxl">We found a <span className="text-emphasis text-xxl">{mood}</span> playlist for you on <span className="text-grn text-xxl">Spotify</span></h1>
                    <div className="spotify-playlist">
                        <div className="spotify-playlist__header">
                            <h3 className="text-m spotify-playlist__title">
                            <div className="spotify-playlist__logo"></div>
                            <span className="text-emphasis text-m">{mood}&nbsp;</span>playlist from<span className="text-grn text-m">&nbsp;Spotify</span></h3>
                            <svg xmlns="http://www.w3.org/2000/svg" className="spotify-playlist__save" title="Save playlist on Spotify" viewBox="0 0 38 35" x="0px" y="0px" version="1.1">
                                <path onClick={createPlaylist} className="spotify-playlist__save-icon" d="M5.35,20.68C1.56,15.09,0.6,10.19,4.48,6.7c4.68-4.22,11.97-3.18,14.71,2.33c2.58-4.57,8.79-6.71,13.33-3.48
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
                            {(musicPlaylist) ? musicPlaylist.map(item => <PlaylistItem key={item.id} data={item} />) : null}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Playlist;
