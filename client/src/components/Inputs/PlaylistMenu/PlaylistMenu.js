import React, { useState } from 'react';
import './PlaylistMenu.scss';
import OutsideClick from 'react-outsideclick';
function PlaylistMenu({ remove, menu }) {
    const [visible, setVisible] = useState(true);
    // useEffect(() => {

    // });

    return (
        <>
            <OutsideClick className='playlistMenu' onClickOutside={(e) => { e.preventDefault(); setVisible(false); menu()}}>
                <ul className={`playlistMenu__holder ${visible}`}><li className='playlistMenu__item' onClick={remove}>Remove</li></ul>
            </OutsideClick>
        </>
    );
}

export default PlaylistMenu;
