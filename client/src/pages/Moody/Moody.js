import React, { useState, useEffect } from 'react';
import './Moody.scss';
import Camera from 'react-html5-camera-photo';
import axios from 'axios';
import NumberIcon from '../../components/Number/Number';
import Selfies from '../../components/Selfies/Selfies';
import Playlist from '../../components/Playlist/Playlist';

function Moody({ loggedIn, userName, access }) {
    const [signedIn, setSignedIn] = useState(loggedIn);
    const [user, setUser] = useState(userName);
    const [selfieData, setSelfieData] = useState([]);
    const [faceData, setFaceData] = useState([]);
    const [artists, setArtists] = useState([]);
    const [mood, setMood] = useState(null);
    const [playlistData, setPlaylistData] = useState(null);

    useEffect(() => {
        setSignedIn(loggedIn);
        setUser(userName);
        setMood(mood);
        setPlaylistData(playlistData);

        axios
            .get(`/spotify/recent/${access}`)
            .then(res => {
                console.log(res.data.items);
                uniqueArtists(res.data.items);
            })
            .catch(err => {
                console.log(err);
            })
    }, [loggedIn, userName, selfieData, access, playlistData, mood]);

    function uniqueArtists(arr) {
        // Using Set to obtian all unique artists within array of songs listened to, etc.

        // change object property 'name' to 'id', retain name for visualization in console.
        const unique = [...new Set(arr.map(item => item.track.artists[0].id))];
        console.log(unique);
        const limit = (arr.length >= 5) ? 5 : arr.length;
        const randomArtists = [];
        while (randomArtists.length < limit) {
            const randomIndex = Math.floor(Math.random() * unique.length);
            const randomArtistID = unique[randomIndex];
            randomArtists.push(randomArtistID);
            unique.splice(randomIndex, 1);
        }
        setArtists(randomArtists);
        console.log(randomArtists);
        console.log(unique);
    }

    function removeImg(id) {
        const allSelfies = selfieData.filter(item => item.id !== id);
        const allFaceData = faceData.filter(item => item.id !== id);
        setFaceData(allFaceData);
        setSelfieData(allSelfies);
    }

    function purgePhoto(id) {
        axios
            .delete(`/cloud/purge/${id}`)
            .then(res => {
                console.log('Image Deleted, process complete');
            })
            .catch(err => {
                console.log(err)
            })
    }

    function analyzePhoto(url, id) {
        axios
            .post(`/face-ai`, { "url": url })
            .then(res => {
                if (res.data.length > 0) {
                    if (res.data.length > 1) {
                        removeImg(id);
                        console.log('We only want your face! Not your friends too! Try taking the pic without them');
                    } else {
                        const { emotion } = res.data[0].faceAttributes;
                        const allFaceData = [{ 'id': id, emotion }, ...faceData];
                        setFaceData([...allFaceData]);
                        console.log(emotion);
                    }
                } else {
                    removeImg(id);
                    console.log('Please try again, we didnt manage to catch your lovely face :(');
                }

                setTimeout(() => purgePhoto(id), 5000);
            })
            .catch(err => {
                console.log(err);
                purgePhoto(id);
            })
    }

    function handleTakePhoto(dataUri) {
        // Do stuff with the photo...
        axios
            .post(`/cloud/generate`, { 'uri': dataUri })
            .then(res => {
                const { image, id } = res.data;
                const allURIs = [{ 'id': id, 'uri': dataUri }, ...selfieData];
                setSelfieData([...allURIs]);
                setTimeout(() => analyzePhoto(image, id), 500);

            })
            .catch(err => {
                console.error(err);
            })
    }

    function analyzeSelfies() {
        // Obtain all emotional data returned from face AI, sort based off of emotion and return highest emotion exhibited
        const selfieOne = Object.values(faceData[0].emotion);
        const selfieTwo = Object.values(faceData[1].emotion);
        const selfieThree = Object.values(faceData[2].emotion);
        const selfieKeys = Object.keys(faceData[0].emotion).map((item, i) => { return ({ 'emotion': item, 'value': (selfieOne[i] + selfieTwo[i] + selfieThree[i]) / 3 }) }).sort((a, b) => b.value - a.value);
        const emotion = selfieKeys[0].emotion;
        setMood(emotion);

        axios
            .get(`/spotify/playlist/${emotion}`, {
                headers: { 'access_token': access, 'artists': JSON.stringify(artists) }
            })
            .then(res => {
                console.log(res.data);
                setPlaylistData(res.data.tracks);
            })
            .catch(err => {
                console.log(err);
            })

    }

    return (
        <>
            <div className="content">
                <h1 className="content__title text-xxl">Let's get <span className="text-emphasis text-xxl">Moody</span></h1>
                <section className="content__dialogue">
                    <div className="content__heading">
                        <NumberIcon num="1" />
                        <h2 className="content__sub-title text-xl">Take some Selfies</h2>
                    </div>
                    <div className="content__holder">
                        <p className="content__text">Let's start by taking some selfies, take <span className="text-emphasis">3</span> selfies that would best describe your current mood.</p>
                    </div>
                    <Camera onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}><div>Test</div></Camera>
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
                        <Selfies images={selfieData} removeImg={removeImg} clickHandler={analyzeSelfies} faceData={faceData} />
                    </>
                    : null}
                {(mood) ?
                    <>
                        <div className="content__heading">
                            <NumberIcon num="3" />
                            <h2 className="content__sub-title text-xl">Jam Out!</h2>
                        </div>
                        <div className="content__holder">
                            <p className="content__text">We found a <span className="text-emphasis">{mood}</span> playlist for you.  to find the greatest mood exhibited and <strong>then</strong> we pair it with <span className="text-grn">music</span> that you like to listen to!</p>
                        </div>
                        <Playlist playlist={playlistData} emotion={mood} />
                    </>
                    : null}
            </div>
        </>
    );
}

export default Moody;
