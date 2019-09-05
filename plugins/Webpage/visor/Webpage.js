import React from 'react';
/* eslint-disable react/prop-types */
export function Webpage() {
    return {
        getRenderTemplate: function(state) {
            if (state.url && state.url.match("poly.google.com")) {
                return(<iframe width="100%" height="100%" src={state.url} frameBorder="0" style={{ width: '100%', height: '100%', zIndex: 0, border: '1px solid grey' }} allowvr="yes" allow="vr; xr; accelerometer; magnetometer; gyroscope; autoplay;" allowFullScreen mozallowfullscreen="true" webkitallowfullscreen="true" onmousewheel="" />);
            }
            return (<iframe style={{ width: '100%', height: '100%', zIndex: 0, border: '1px solid grey' }} onLoad={(e)=>{e.target.contentWindow.scrollTo(0, state.scrollY);}} scrolling={state.fixedPosition ? 'no' : 'yes'} src={state.url}/>);

        },
    };
}
/* eslint-enable react/prop-types */
