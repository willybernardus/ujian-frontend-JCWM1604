import React from 'react';

//* kalau di function component tidak pakai 'this', langsung aja props

const Button = (props) => {
    return (
        <button
            onClick={props.onClick}
            type={props.submit ? 'submit' : 'button'}
            className={'header-login rounded px-4 py-2 font-weight-bold' + props.className}
        >
            {props.children}
        </button>
    )

}

export default Button;