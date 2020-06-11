import React, {useState, useEffect} from 'react';
import './Header.scss';

function Header({status}) {
    const [loggedIn, setLoggedIn] = useState(status);

    useEffect(() => {
      setLoggedIn(status);
    })

  return (
    <>
        {loggedIn && <h1>Logged In</h1> || <h1>Not logged in</h1>}
    </>
  );
}

export default Header;
