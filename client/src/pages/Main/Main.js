import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Main.scss';
import Button from '../../components/Inputs/Button/Button';
import NumberIcon from '../../components/Number/Number';
import selfie_one from '../../assets/selfie_one.png';
import selfie_two from '../../assets/selfie_two.png';
import facial_ai from '../../assets/facial_ai.png';


function Main({loggedIn, userName}) {
    const [signedIn, setSignedIn] = useState(loggedIn);
    const [user, setUser] = useState(userName);

    useEffect(() => {
      setSignedIn(loggedIn);
      setUser(userName);
    }, [loggedIn, userName]);

    return (
        <>
            <div className="hero">
                {(signedIn) ?
                    <div className="hero__content">
                        <h1 className="hero__text text-xl">Welcome back, {user}! Are you ready to get moody?</h1>
                        <Link to="/moody">
                            <Button title='Get Moody' btnClass='btn-primary' />
                        </Link>
                    </div> :
                    <div className="hero__content">
                        <h1 className="hero__text text-xl">Let your mood pick your playlist for you.</h1>
                        <a href="http://localhost:8080/spotify/login">
                            <Button title='Check It Out' btnClass='btn-primary' />
                        </a>
                    </div>
                }
            </div>
            <div className="content">
                <h1 className="content__title text-xxl">How it Works</h1>
                <section className="content__dialogue">
                    <div className="content__heading">
                        <NumberIcon num="1"></NumberIcon>
                        <h2 className="content__sub-title text-xl">Take some Selfies</h2>
                    </div>
                    <div className="content__holder">
                        <div className="content__info">
                            <p className="content__text">This will require you showing your beautiful face. Don’t worry, we won’t save it, it’ll only be temporarily stored in order to obtain data on your facial responses.</p>
                            <p className="content__text">You will be prompted with random neutral questions which we hope will generate some sort of an emotional response. In that time, the app will randomly take a picture of you while reading the question and processing it. You’ll do it three times to make sure that we have an accurate depiction of your current emotional state.</p>
                            <p className="content__text">Worried about taking a selfie? Or, maybe you’ve been told that you have a ‘resting b- face’? Don’t fret! We’re coming up with a reasonable questionnaire that will provide us with similar emotional responses that we can use to evaluate your mood. Plus, who says AI is all knowing anyways?</p>
                            <p className="content__text">*You will need a <span className="text-grn">Spotify</span> account in order to use this service</p>
                        </div>
                        <div className="content__visual">
                            <img className="content__img" alt="Taking a selfie" src={selfie_one} />
                            <a href="http://localhost:8080/spotify/login">
                                <Button title='Connect with Spotify' btnClass='btn-spotify' />
                            </a>
                        </div>
                    </div>
                </section>
                <section className="content__dialogue">
                    <div className="content__heading">
                        <NumberIcon num="2"></NumberIcon>
                        <h2 className="content__sub-title text-xl">Analyze the Data</h2>
                    </div>
                    <div className="content__holder">
                        <div className="content__visual">
                            <img className="content__img" alt="Facial analyzing" src={facial_ai} />
                            <Link to="/moody">
                                <Button title='Analyze' btnClass='btn-primary' />
                            </Link>
                        </div>
                        <div className="content__info">
                            <p className="content__text">With the help of Microsoft Azure’s Face AI, we’re able to capture emotions perceived in photos. That’s why we prompt you with questions which will hopefully result in an emotional response.</p>
                            <p className="content__text">If your mood doesnt match the preference of music that you want to listen to, that’s okay! We can fake it until we make it, right!? Slap on a fake smile and get ready for some happy tunes curated to your liking!*</p>
                            <p className="content__text">*If you have a Spotify account set up, but you dont have any liked artists, we’ll try our best to find something special anyways, because everyone deserves to vibe a little.</p>
                        </div>
                    </div>
                </section>
                <section className="content__dialogue">
                    <div className="content__heading">
                        <NumberIcon num="3"></NumberIcon>
                        <h2 className="content__sub-title text-xl">Jam Out!</h2>
                    </div>
                    <div className="content__holder">
                        <div className="content__info">
                            <p className="content__text">Now that you’ve got your playlist, you’re ready to go! If you’d like, you’ll be able to save the playlist to your Spotify library.</p>
                            <p className="content__text">And hey, why so moody? Just kidding! Jeez, chill out by listening to some music why don’tcha?</p>
                        </div>
                        <div className="content__visual">
                            <img className="content__img" alt="Jamming out!" src={selfie_two} />
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Main;
