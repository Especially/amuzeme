import React from 'react';
import './Button.scss';

function Button (props) {

    return (
        <>
            {(props.clickHandler) ?
                <button className={`${props.btnClass} btn`} onClick={props.clickHandler}>{props.title}</button> :
                <button className={`${props.btnClass} btn`}>{props.title}</button>
            }
        </>
    );
}

export default Button;
