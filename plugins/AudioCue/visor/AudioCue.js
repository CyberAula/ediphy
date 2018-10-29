
import React from 'react';

/* eslint-disable react/prop-types */
export function AudioCue(base) {

    return {
        getRenderTemplate: function(state, props) {

            return <div style={{ height: "100%", width: "100%" }} >Hello {state.name}

            </div>;
        },
    };
}
/* eslint-enable react/prop-types */

