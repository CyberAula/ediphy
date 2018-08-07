import React from 'react';
/* eslint-disable react/prop-types */
export function Google3DPolyObject(base) {
    return {
        getRenderTemplate: function(state) {
            return(<iframe width="100%" height="100%" src={state.url} frameBorder="0" style={{ width: '100%', height: '100%', zIndex: 0, border: '1px solid grey' }} allowvr="yes" allow="vr; xr; accelerometer; magnetometer; gyroscope; autoplay;" allowFullScreen mozallowfullscreen="true" webkitallowfullscreen="true" onmousewheel="" />);

        },
    };
}
/* eslint-enable react/prop-types */
