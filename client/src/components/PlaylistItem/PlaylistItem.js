import React, { useState } from 'react';
import PlaylistMenu from '../Inputs/PlaylistMenu/PlaylistMenu';

function PlaylistItem({ data, clickHandler }) {
    const { id, artists, duration_ms, name, external_urls, album } = data;
    const [menuToggle, setMenuToggle] = useState(false);
    const songTime = convertDuration(duration_ms);
    function convertDuration(duration) {
        var seconds = Math.floor((duration / 1000) % 60),
            mins = Math.floor((duration / (1000 * 60)) % 60),
            minutes = (mins < 10) ? "0" + mins : mins;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return minutes + ":" + seconds;
    }

    const artist = artists.map(item => <a key={item.id} rel="noopener noreferrer" href={item.external_urls.spotify} className="container__link" target="_blank">{item.name}&nbsp;</a>);
    const songMenu = () => {
        setMenuToggle(!menuToggle);
    }

    return (
        <>
            <div className="container__row" data-id={id}>
                <div className="container__cell">{songTime}</div>
                <div className="container__cell"><a href={external_urls.spotify} rel="noopener noreferrer" className="container__link" target="_blank">{name}</a></div>
                <div className="container__cell">{artist}</div>
                <div className="container__cell"><a href={album.external_urls.spotify} rel="noopener noreferrer" className="container__link" target="_blank">{album.name}</a></div>
                <div className="container__cell">
                    <div className="container__menu-icon" onClick={songMenu}></div>
                    {(menuToggle) &&  <PlaylistMenu menu={songMenu} remove={clickHandler} />}
                </div>
            </div>
        </>
    );
}

export default PlaylistItem;
