import React from 'react';

const Privacy = () => {

    return (
        <>
            <div className="content no-head">
                <h1 className="content__title text-xxl">Privacy</h1>
                <section className="content__dialogue">
                    <div className="content__heading">
                        <h2 className="content__sub-title text-xl text-emphasis">Your Photos</h2>
                    </div>
                    <div className="content__holder">
                        <div className="content__info">
                            <p className="content__text">Your photos are stored temporarily on the <strong>localhost</strong> server so that we can convert our Data URI into an actual file, which is then uploaded to <span className="text-emphasis">Google Cloud Services</span>. After the upload, the photo is removed from localhost, and then sent to the <span className="text-emphasis">Microsoft Face AI</span> server to anlyze your face data.</p>
                            <p className="content__text">Your photo is securely stored on the Google Cloud Services platform only during the analysis of the photo which is done by Microsoft. The moment that the process is complete, or even if an error occurs, the 'purge photo' function is called, which removes the photo from the cloud server. There can be, however, an instance in which the photo does not get purged, which would be a edge case scenario where two photos may have been uploaded at the same time, or the analysis function abruptly stops.</p>
                            <p className="content__text">Despite this, photos are automatically purged from the cloud server every 24 hours in order to account for such errors.</p>
                        </div>
                    </div>
                </section>
                <section className="content__dialogue">
                    <div className="content__heading">
                        <h2 className="content__sub-title text-xl text-emphasis">Your Facial Data</h2>
                    </div>
                    <div className="content__holder">
                        <div className="content__info">
                            <p className="content__text">As mentioned previously, your Fade Data is read and analyzed by the Micrsoft Service through your image upload. Following this, the data obtained from Microsoft is only used in your current instance of generating a <span className="text-grn">Spotify</span> playlist for you. The 'mood' or 'emotion' that is received from Microsoft's services may not be an accurate representation of your mood, and as such, this app shouldn't be used in replacement of any type of therapeutic services.</p>
                            <p className="content__text">For future use, the mood/emotion examined may be paired to the user's account so that they can analyze their moods as they continually use the application.</p>
                        </div>
                    </div>
                </section>
                <section className="content__dialogue">
                    <div className="content__heading">
                        <h2 className="content__sub-title text-xl text-emphasis">Your Text Data</h2>
                    </div>
                    <div className="content__holder">
                        <div className="content__info">
                            <p className="content__text">Using <span className="text-emphasis">IBM's Tone Analyzer</span> allows us to examine text, whether a long winded paragraph or a short sentence, and it provides us with the tone/mood exhibited. Similarly, this data, like the Facial Data, is only used to generate a <span className="text-grn">Spotify</span> playlist. However, again, as mentioned previously, it may eventually be stred on your personal account profile so that you can view the change in mood for different instances of use on the app.</p>
                        </div>
                    </div>
                </section>
                <section className="content__dialogue">
                    <div className="content__heading">
                        <h2 className="content__sub-title text-xl text-grn">Your Spotify Account</h2>
                    </div>
                    <div className="content__holder">
                        <div className="content__info">
                            <p className="content__text">Your <span className="text-grn">Spotify</span> account will be used constantly during the navigation of this application. The data that we have access to when using your Spotify account is the following:</p>
                            <ul className="content__list">
                                <li>Display Name</li>
                                <li>User ID</li>
                                <li>Email</li>
                                <li>Following (Create/Read/Update/Delete) -- unused</li>
                                <li>Playlists (Create/Read/Update/Write/Delete) -- used</li>
                                <li>Songs (Create/Read/Update/Write/Delete) -- used</li>
                            </ul>
                            <p className="content__text">Your personal information is used to provide prompts such as welcoming you to the application, and is stored so that you can register an account and view previous playlists and previous moods. We have modifying rights to your Following, however this currently is not in use, and has no plans to be. And finally, for playlists/songs, well, if you've used the app, you know why we need it!</p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )

};

export default Privacy;