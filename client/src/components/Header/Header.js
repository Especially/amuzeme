import React, { useState, useEffect } from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';

function Header({ loggedIn, userName }) {
  const [signedIn, setSignedIn] = useState(loggedIn);
  const [user, setUser] = useState(userName);

  useEffect(() => {
    setSignedIn(loggedIn);
    setUser(userName);
  }, [loggedIn, userName]);

  return (
    <>
      <header className='head'>
        <nav className='head__nav'>
          <div className='head__nav-logo'>
            <Link to="/">
              <div className='head__logo'></div>
            </Link>
            <div className='head__logo-text'><span className="head__logo-text--inner text-s">AmuzeMe</span></div>
          </div>
          <div className='head__nav-links'>
            <ul className='nav-menu'>
              <Link to="/moody" className="nav-link"><li className='nav-menu__links text-s'>Get Moody</li></Link>
              <Link to="/privacy" className="nav-link"><li className='nav-menu__links text-s'>Privacy</li></Link>
              {(signedIn) ?
                <li className='nav-menu__links text-s'>{user}</li>
                :
                <a href="http://localhost:8080/spotify/login" className="nav-link"><li className='nav-menu__links text-s'>Sign In</li></a>
              }
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
