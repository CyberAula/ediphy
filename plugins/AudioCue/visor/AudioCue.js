import React from 'react';
import i18n from 'i18next';
import AudioCueComponent from './AudioCueComponent';
import img_placeholder from './../../../dist/images/placeholder.svg';

/* eslint-disable react/prop-types */
export function AudioCue(base) {
    return {
        getRenderTemplate: function(state, props) {
            return (<AudioCueComponent props={props} state={state}/>);

        },
    };
}
/* eslint-enable react/prop-types */
