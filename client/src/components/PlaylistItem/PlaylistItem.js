import React, { useState, useEffect } from 'react';
import './PlaylistItem.scss';

function PlaylistItem({data}) {
    const { id, artists, duration_ms, name, album } = data;
    const songTime = convertDuration(duration_ms);
    function convertDuration(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return minutes + ":" + seconds + "." + milliseconds;
    }
    const artist = artists.map(item => <a key={item.id} href={item.external_urls.spotify} className="container__link" target="_blank">{item.name}&nbsp;</a>);
    return (
        <>
            <div className="container__row" data-id={id}>
                <div className="container__cell">{songTime}</div>
                <div className="container__cell">{name}</div>
                <div className="container__cell">{artist}</div>
                <div className="container__cell"><a href={album.external_urls.spotify} className="container__link" target="_blank">{album.name}</a></div>
                <div className="container__cell"></div>
            </div>
        </>
    );
}

export default PlaylistItem;
