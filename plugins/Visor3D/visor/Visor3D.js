
import React from 'react';

/* eslint-disable react/prop-types */
export function Visor3D(base) {

    return {
        getRenderTemplate: function(state) {
            return <div style={{ height: "100%", width: "100%" }} >Hello {state.name}</div>;
        },
    };
}
/* eslint-enable react/prop-types */

