import React, { useState, useEffect } from 'react';
import './TextAnalysis.scss';
import Button from '../Inputs/Button/Button';
import NumberIcon from '../Number/Number';
import axios from 'axios';
import ink1 from '../../assets/inkblots/inkblot.png';
import ink2 from '../../assets/inkblots/inkblot2.png';
import ink3 from '../../assets/inkblots/inkblot3.png';
import ink4 from '../../assets/inkblots/inkblot4.png';
import ink5 from '../../assets/inkblots/inkblot5.png';
import ink6 from '../../assets/inkblots/inkblot6.png';
import ink7 from '../../assets/inkblots/inkblot7.png';
import ink8 from '../../assets/inkblots/inkblot8.png';

function Selfies({ userName, analyze }) {
    const [mood, setMood] = useState(null);
    const [user, setUser] = useState(userName);
    const [textData, setTextData] = useState('');
    const [moodData, setMoodData] = useState();
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState(false);
    const [analysisMsg, setAnalysisMsg] = useState('');
    const inkblots = [ink1,ink2,ink3,ink4,ink5,ink6,ink7,ink8];
    const randInkblot = inkblots[Math.floor(Math.random()*inkblots.length)];

    useEffect(() => {
        setUser(userName);
        setMood(mood);
    }, [userName, mood])

    const updateText = (e) => {
        const val = e.target.value;
        setTextData(val);
    }

    const throwAnalysisErr = (msg) => {
        setAnalyzing(false);
        setAnalysisError(true);
        setAnalysisMsg(msg);
        setTimeout(() => {
            clearAnalysisErr();
        }, 5000);
    };

    const clearAnalysisErr = () => {
        setAnalysisError(false);
        setAnalysisMsg('');
    };
    const analyzeTone = (e) => {
        e.preventDefault();
        setAnalyzing(true);
        const analyzeThis = { 'text': textData };
        axios
            .post('/tone', analyzeThis)
            .then(res => {
                const data = res.data;
                if (data.length === 0) {
                    throwAnalysisErr('Looks like we couldn\'t obtain an accurate mood for you, try writing something else.');
                } else {
                    setMoodData(data);
                    analyze(data, 1);
                }
            })
            .catch(err => {
                console.error(err);
                throwAnalysisErr('Looks like we couldn\'t obtain an accurate mood for you, try writing something else.');
            })
    };


    return (
        <>
            <section className="content__dialogue moody animated slideInRight">
                <div className="content__heading">
                    <NumberIcon num="1" />
                    <h2 className="content__sub-title text-xl">Tell us what you're thinking</h2>
                </div>
                <div className="content__holder">
                    <p className="content__text">{user}, tell us what you see when you look at this image. Alternatively, you can tell us about your day, how you're feeling, or whatever is on your mind, don't worry we won't judge.</p>
                </div>
                <div className="inkblot-container">
                    <img src={randInkblot} alt='Ink Blot Analysis' className='inkblot-container__img' />
                </div>
            </section>


            <div className="content__heading animated slideInRight">
                <NumberIcon num="2" />
                <h2 className="content__sub-title text-xl">Analyze the Data</h2>
            </div>
            <div className="content__holder animated slideInRight">
                <p className="content__text">Your <span className="text-emphasis">mood</span> is going to be determined based off of what you submit in the text field below. Once you hit that analyze button, we then try to match the mood exhibited in your sentence(s) with a playlist made just for you.!</p>
            </div>

            <section className="gallery animated slideInRight">
                <div className="gallery__holder tone">
                    <form className="tone-analyzer" onSubmit={analyzeTone}>
                        <textarea onChange={updateText} name="tone" className="tone-analyzer__text" placeholder="Go on, tell us your deepest and darkest secrets. Or don't, it's totally up to you!" value={textData} disabled={analyzing} />
                        {(analyzing && !moodData) && <span className="gallery__status animated flash infinite">Analyzing</span>}
                        {(analysisError) && <span className="gallery__status animated slideInDown">{analysisMsg}</span>}
                        {(textData.length > 20) ? <Button title='Analyze' btnClass='btn-primary' disabled={analyzing} clickHandler={analyzeTone} /> : null}
                    </form>
                </div>
            </section>
        </>
    );
}

export default Selfies;
