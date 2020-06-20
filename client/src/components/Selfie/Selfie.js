import React from 'react';

function Selfie({ image, id, clickHandler, status }) {



    return (
        <>
            <div className="gallery__container animated fadeInRightBig" data-id={id}>
                <div className="gallery__remove" onClick={() => { clickHandler(id) }}></div>
                {(status) ? <span className="gallery__status animated flash">Analyzing</span> : null}
                <img className="gallery__img" src={image} alt='Selfie' />
            </div>

        </>
    );
}

export default Selfie;
