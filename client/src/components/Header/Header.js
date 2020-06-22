import React, { useState, useEffect } from 'react';
import './Header.scss';
import { NavLink } from 'react-router-dom';

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

            <NavLink to="/" className='nav-link'>

              <div className='head__logo'></div>

              <div className='head__logo-text'><span className="head__logo-text--inner text-s">AmuzeMe</span></div>
              
            </NavLink>

          </div>

          <div className='head__nav-links'>

            <ul className='nav-menu'>

              {(signedIn) && <NavLink to="/moody" activeClassName="active" className="nav-link"><li className='nav-menu__links text-s'>Get Moody</li></NavLink>}

              <NavLink to="/privacy" activeClassName="active" className="nav-link"><li className='nav-menu__links text-s'>Privacy</li></NavLink>

              {(signedIn) ?

                <li className='nav-menu__links text-s'>{user}</li>
                :
                <NavLink to="/spotify/login" activeClassName="active" className="nav-link"><li className='nav-menu__links text-s'>Sign In</li></NavLink>
              }
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
