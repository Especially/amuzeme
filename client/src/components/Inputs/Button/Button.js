import React from 'react';
import './Button.scss';

function Button (props) {

    return (
        <>
            {(props.clickHandler) ?
                <button className={`${props.btnClass} btn`} onClick={(props.disabled) ? null : props.clickHandler} disabled={props.disabled}>{props.title}</button> :
                <button className={`${props.btnClass} btn`} disabled={props.disabled}>{props.title}</button>
            }
        </>
    );
}

export default Button;
