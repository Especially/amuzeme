import React from 'react';
import './Selfie.scss';

function Selfie({ image, id, clickHandler }) {



    return (
        <>
            <div className="gallery__container" data-id={id}>
                <div className="gallery__remove" onClick={() => {clickHandler(id)}}></div>
                <img className="gallery__img" src={image} alt='Selfie' />
            </div>

        </>
    );
}

export default Selfie;
