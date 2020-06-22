import React, { useState } from 'react';
import PlaylistMenu from '../Inputs/PlaylistMenu/PlaylistMenu';

function HistoryItem({ data, clickHandler, removeHandler }) {
    const { timestamp, mood, type, playlistID, id } = data;
    const date = convertDate(timestamp);
    const [menuToggle, setMenuToggle] = useState(false);

    function convertDate(timestamp) {
        let day=new Date(timestamp).getDate();
        let month=new Date(timestamp).getMonth()+1;
        let year=new Date(timestamp).getFullYear();
        return day+'/'+month+'/'+year;
    
    }

    const songMenu = () => {
        setMenuToggle(!menuToggle);
    }

    return (
        <>
            <div className="container__row" data-playlist={playlistID} data-id={id} onClick={clickHandler}>
                <div className="container__cell">{date}</div>
                <div className="container__cell">{mood}</div>
                <div className="container__cell">{(type === 0) ? 'Selfie' : 'Text Analysis'}</div>
                <div className="container__cell">
                    <div className="container__menu-icon" onClick={songMenu}></div>
                    {(menuToggle) &&  <PlaylistMenu menu={songMenu} remove={removeHandler} />}
                </div>
            </div>
        </>
    );
}

export default HistoryItem;
