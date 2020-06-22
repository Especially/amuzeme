import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Main.scss';
import '../../assets/animate.css';
import ScrollAnimation from 'react-animate-on-scroll';
import Button from '../../components/Inputs/Button/Button';
import NumberIcon from '../../components/Number/Number';
import selfie_one from '../../assets/selfie_one.png';
import selfie_two from '../../assets/selfie_two.png';
import facial_ai from '../../assets/facial_ai.png';


function Main({ loggedIn, userName }) {
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
                    <ScrollAnimation animateIn="backInDown">
                        <div className="hero__content">
                            <h1 className="hero__text text-xl">Welcome back, {user}! Are you ready to get moody?</h1>
                            <Link to="/moody">
                                <Button title='Get Moody' btnClass='btn-primary' />
                            </Link>
                        </div>
                    </ScrollAnimation> :
                    <ScrollAnimation animateIn="backInLeft">
                        <div className="hero__content">
                            <h1 className="hero__text text-xl">Let your mood pick your playlist for you.</h1>
                            <Link to="/spotify/login">
                                <Button title='Check It Out' btnClass='btn-primary' />
                            </Link>
                        </div>
                    </ScrollAnimation>
                }
                <div className="hero__content">
                    <div className="hero__logo animated infinite pulse slow"></div>
                </div>
            </div>
            <div className="content">
                <h1 className="content__title text-xxl">How it Works</h1>
                <ScrollAnimation animateIn="fadeInLeft"
                    duration={3}>
                    <section className="content__dialogue">
                        
                        <div className="content__heading">
                            <NumberIcon num="1"></NumberIcon>
                            <h2 className="content__sub-title text-xl">Take some Selfies</h2>
                        </div>

                        <div className="content__holder">
                            <div className="content__info">
                                <p className="content__text">This will require you showing your beautiful face. Don’t worry, we won’t save it, it’ll only be temporarily stored in order to obtain data on your facial responses.</p>
                                <p className="content__text">You must take 3 photos using the camera on the app which will then be quickly analyzed, and all of the data will be aggregated to tell us which mood best stuits your current look. From there we'll find a playlist just for you. </p>
                                <p className="content__text">Worried about taking a selfie? Or, maybe you’ve been told that you have a ‘resting b- face’? Don’t fret! You also have the option to dive deep into your psyche and evaluate an inkblot. Based off of your description (or lackthere-of), we will analyze your input and analyze your mood from there. Don't worry too much about your evaluation, it's all for fun! Plus, who says AI is all knowing anyways?</p>
                                <p className="content__text">*NOTE: You will need a <span className="text-grn">Spotify</span> account in order to use this service</p>
                            </div>

                            <div className="content__visual">
                                <img className="content__img" alt="Taking a selfie" src={selfie_one} />
                                <Link to="/spotify/login">
                                    <Button title='Connect with Spotify' btnClass='btn-spotify' />
                                </Link>
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
                                <p className="content__text">With the help of Microsoft Azure’s Face AI and IBM's Tone Analysis, we’re able to capture emotions perceived in photos and text respectively.</p>
                                <p className="content__text">If your mood doesnt match the preference of music that you want to listen to, that’s okay! We can fake it until we make it, right!? Slap on a fake smile, or write a fake paragraph and get ready for some happy tunes curated to your liking!*</p>
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
                                <p className="content__text">Now that you’ve got your playlist, you’re ready to go! Once you click that little <span  className="text-emphasis">heart</span> button on the top of the playlist, you'll be able to save these sweet tunes directly to your Spotify account! You'll also be able to remove songs from your brand-new playlist while you listen in-app!</p>
                                <p className="content__text">And hey, why so moody? Just kidding! Jeez, chill out by listening to some music why don’tcha?</p>
                            </div>
                            <div className="content__visual">
                                <img className="content__img" alt="Jamming out!" src={selfie_two} />
                            </div>
                        </div>
                    </section>
                </ScrollAnimation>
            </div>
        </>
    );
}

export default Main;
