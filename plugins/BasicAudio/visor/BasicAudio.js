import React from 'react';
import i18n from 'i18next';
import BasicAudioPlugin from '../components/BasicAudioPlugin.js';
require('./../BasicAudio.scss');

export function BasicAudio(base) {
    return {
        // ¿Se deben poner marcas en el visor??
        getRenderTemplate: function(state, props) {
            // enriquedplayer solo pasa state
            return (
                <div style={{ height: "100%", width: "100%" }}>
                    <BasicAudioPlugin style={{ width: "100%", height: "100%" }} state={state}/>
                </div>
            );
        },
    };
}
