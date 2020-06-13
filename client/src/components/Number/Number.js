import React from 'react';
import './NumberIcon.scss';

function NumberIcon({num}) {


  return (
    <>
      <div className="numberIcon">
          <span className="numberIcon__text text-lg">{num}</span>
      </div>
    </>
  );
}

export default NumberIcon;
