import React from 'react';
import AudioCueComponent from '../AudioCueComponent';

/* eslint-disable react/prop-types */
export function AudioCue() {
    return {
        getRenderTemplate: (state, props) => (<AudioCueComponent props={props} state={state} fromVisor/>),
    };
}
/* eslint-enable react/prop-types */
