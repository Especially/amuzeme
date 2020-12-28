import React, { useState, useEffect } from 'react';
import './Selfies.scss';
import Button from '../../components/Inputs/Button/Button';
import Selfie from '../../components/Selfie/Selfie';
import NumberIcon from '../../components/Number/Number';
import Camera from 'react-html5-camera-photo';
import axios from 'axios';

function Selfies({ userName, analyze }) {
    const [mood, setMood] = useState(null);
    const [user, setUser] = useState(userName);
    const [faceData, setFaceData] = useState([]);
    const [selfieData, setSelfieData] = useState([]);
    const [cameraError, setCameraError] = useState(false);
    const [cameraErrorMsg, setCameraErrorMsg] = useState('');

    useEffect(() => {
        setUser(userName);
        setMood(mood);
    }, [userName, mood])

    const throwCameraError = (msg) => {
        setCameraError(true);
        setCameraErrorMsg(msg);
        setTimeout(() => {
            clearCameraError();
        }, 5000);
    };

    const clearCameraError = () => {
        setCameraError(false);
        setCameraErrorMsg('');
    };

    const removeImg = (id) => {
        const allSelfies = selfieData.filter(item => item.id !== id);
        const allFaceData = faceData.filter(item => item.id !== id);
        setFaceData(allFaceData);
        setSelfieData(allSelfies);
    }

    const purgePhoto = (id) => {
        axios
            .delete(`/api/cloud/purge/${id}`)
            .then(() => {
                // Image deleted
            })
            .catch(err => {
                console.error(err)
            })
    }

    const handleTakePhoto = (dataUri) => {
        // Do stuff with the photo...
        axios
            .post(`/api/cloud/generate`, { 'uri': dataUri })
            .then(res => {
                const { image, id } = res.data;
                const allURIs = [...selfieData, { 'id': id, 'uri': dataUri, 'analyzing': true }];
                setSelfieData([...allURIs]);
                setTimeout(() => analyzePhoto(image, id, allURIs), 500);

            })
            .catch(err => {
                console.error(err);
            })
    }

    function analyzePhoto(url, id, data) {
        axios
            .post(`/face-ai`, { "url": url })
            .then(res => {
                if (res.data.length > 0) {
                    if (res.data.length > 1) {
                        removeImg(id);
                        throwCameraError('Oops, try taking a pic with just yourself!');
                    } else {
                        const analyzeComplete = data.map(item => {
                            return ((item.id === id) ? { 'id': item.id, 'uri': item.uri, 'analyzing': false } :
                                { 'id': item.id, 'uri': item.uri, 'analyzing': item.analyzing })
                        })
                        setSelfieData([...analyzeComplete]);
                        const { emotion } = res.data[0].faceAttributes;
                        const allFaceData = [{ 'id': id, emotion }, ...faceData];
                        setFaceData([...allFaceData]);
                    }
                } else {
                    throwCameraError('We couldn\'t catch your lovely face. Try using better lighting.');
                    removeImg(id);
                }

                setTimeout(() => purgePhoto(id), 5000);
            })
            .catch(err => {
                throwCameraError('Whoops, we couldn\'t recognize your face, try again!');
                removeImg(id);
                purgePhoto(id);
            })
    }

    return (
        <>
            <section className="content__dialogue moody animated slideInLeft">
                <div className="content__heading">
                    <NumberIcon num="1" />
                    <h2 className="content__sub-title text-xl">Take some Selfies</h2>
                </div>

                <div className="content__holder">
                    <p className="content__text">Hey {user}, let's start by taking some selfies, take <span className="text-emphasis">3</span> selfies that would best describe your current mood.</p>
                </div>

                <div className="camera-container">
                    {(cameraError) && <div className="camera-container__error animated bounceIn"><p>{cameraErrorMsg}</p></div>}
                    <Camera onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }} onCameraError={() => {throwCameraError('Oops, looks like your camera is in use, try refreshing!')}}></Camera>
                </div>

            </section>


            {(selfieData.length > 0) ?
                <>
                    <div className="content__heading">
                        <NumberIcon num="2" />
                        <h2 className="content__sub-title text-xl">Analyze the Data</h2>
                    </div>

                    <div className="content__holder">
                        <p className="content__text">For each picture that you take, we're obtaining information relatied to your facial response, we then get the average out of all <span className="text-emphasis">3</span> photos to find the greatest mood exhibited and <strong>then</strong> we pair it with <span className="text-grn">music</span> that you like to listen to!</p>
                    </div>

                    <section className="gallery">
                        <div className="gallery__holder">
                            {(selfieData.length > 0) ? selfieData.map((item, i) => {
                                return (
                                    <Selfie key={i} image={item.uri} id={item.id} clickHandler={removeImg} status={item.analyzing} />
                                )
                            }) : null}
                        </div>
                        
                        {(selfieData.length === 3) ? <Button title='Analyze' btnClass='btn-primary' clickHandler={() => { analyze(faceData,0) }} /> : null}
                    </section>
                </>
                : null}
        </>
    );
}

export default Selfies;
