import React from 'react';
import i18n from 'i18next';
import ReactAudioPlayer from 'react-audio-player';
import BasicPDFPlugin from '../components/BasicPDFPlugin.js';

export function BasicAudio(base) {
    return {
        getRenderTemplate: function(state) {

            return (
                <div style={{ height: "100%", width: "100%" }}>
                    <BasicPDFPlugin style={{ width: "100%", height: "100%" }} state={state}/>
                </div>
            );
        },
    };
}
