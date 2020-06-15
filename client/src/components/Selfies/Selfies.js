import React, { useState, useEffect } from 'react';
import './Selfies.scss';
import Button from '../../components/Inputs/Button/Button';
import NumberIcon from '../../components/Number/Number';
import Selfie from '../../components/Selfie/Selfie';

function Selfies({ images, removeImg }) {
    const [selfies, setSelfies] = useState([]);

    useEffect(() => {
        setSelfies(images);
        console.log('Updating');
    }, [images])


    return (
        <>
            <section className="gallery">
                <div className="gallery__holder">
                {(selfies.length > 0) ? selfies.map((item, i) => <Selfie key={i} image={item.uri} id={item.id} clickHandler={removeImg} />) : null}
                </div>
                {(selfies.length === 3) ? <Button title='Analyze' btnClass='btn-primary' /> : null}
            </section>
        </>
    );
}

export default Selfies;
