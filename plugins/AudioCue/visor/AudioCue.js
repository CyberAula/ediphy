import React from 'react';
import AudioCueComponent from './AudioCueComponent';

/* eslint-disable react/prop-types */
export function AudioCue() {
    return {
        getRenderTemplate: function(state, props) {
            return (<AudioCueComponent props={props} state={state}/>);

        },
    };
}
/* eslint-enable react/prop-types */
