import React, { useState, useEffect } from 'react';
import './Moody.scss';
import Camera from 'react-html5-camera-photo';
import axios from 'axios';
import NumberIcon from '../../components/Number/Number';
import Selfies from '../../components/Selfies/Selfies';
import Playlist from '../../components/Playlist/Playlist';

const API_URL = 'http://localhost:8080';

function Moody({ loggedIn, userName, access, refresh }) {
    const [signedIn, setSignedIn] = useState(loggedIn);
    const [user, setUser] = useState(userName);
    const [accessToken, setAccessToken] = useState(access);
    const [refreshToken, setRefreshToken] = useState(refresh);
    const [selfieData, setSelfieData] = useState([]);

    useEffect(() => {
        setSignedIn(loggedIn);
        setUser(userName);
        console.log(selfieData);
    }, [loggedIn, userName, access, refresh, selfieData]);

    function removeImg(id) {
        const allSelfies = selfieData.filter( item => item.id !== id);
        setSelfieData(allSelfies);
    }

    function purgePhoto(id) {
        axios
            .delete(`${API_URL}/cloud/purge/${id}`)
            .then(res => {
                console.log('Image Deleted, process complete');
            })
            .catch(err => {
                console.log(err)
            })
    }

    function analyzePhoto(url, id) {
        axios
            .post(`${API_URL}/face-ai`, { "url": url })
            .then(res => {
                if (res.data.length > 0) {
                    if (res.data.length > 1){
                        removeImg(id);
                        console.log('We only want your face! Not your friends too! Try taking the pic without them');
                    } else {
                        const {faceAttributes} = res.data[0];
                        console.log(faceAttributes);
                    }
                } else {
                    removeImg(id);
                    console.log('Please try again, we didnt manage to catch your lovely face :(');
                }

                setTimeout(()=>purgePhoto(id), 5000); 
            })
            .catch(err => {
                console.log(err);
                purgePhoto(id);
            })
    }

    function handleTakePhoto(dataUri) {
        // Do stuff with the photo...
        axios
            .post(`${API_URL}/cloud/generate`, { 'uri': dataUri })
            .then(res => {
                const { image, id } = res.data;
                // const allSelfies = [image, ...selfies];
                // setSelfies([ ...allSelfies ]);
                const allURIs = [{'id': id,'uri': dataUri}, ...selfieData];
                setSelfieData([ ...allURIs ]);
                setTimeout(()=> analyzePhoto(image, id), 1000);
                
            })
            .catch(err => {
                console.error(err);
            })
    }

    return (
        <>
            <div className="content">
                <h1 className="content__title text-xxl">How it Works</h1>
                <section className="content__dialogue">
                    <div className="content__heading">
                        <NumberIcon num="1"></NumberIcon>
                        <h2 className="content__sub-title text-xl">Take some Selfies</h2>
                    </div>
                    {/* idealResolution = {{width: 640, height: 480}};  */}
                    <Camera onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }} />
                </section>
                <Selfies images={selfieData} removeImg={removeImg}/>
                <Playlist />
            </div>
        </>
    );
}

export default Moody;
