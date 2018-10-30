import React from 'react';
/* eslint-disable react/prop-types */
export function Webpage(base) {
    return {
        getRenderTemplate: function(state) {
            return (<iframe style={{ width: '100%', height: '100%', zIndex: 0, border: '1px solid grey' }} onLoad={(e)=>{e.target.contentWindow.scrollTo(0, state.scrollY);}} scrolling={state.fixedPosition ? 'no' : 'yes'} src={state.url}/>);

        },
    };
}
/* eslint-enable react/prop-types */
