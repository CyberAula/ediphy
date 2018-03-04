import React from 'react';
import i18n from 'i18next';
import ReactAudioPlayer from 'react-audio-player';
import BasicAudioPlugin from '../components/BasicAudioPlugin.js';

export function BasicAudio(base) {
    return {
        getRenderTemplate: function(state, props) {
            let aautoplay = state.autoplay;
            return (
                <div style={{ height: "100%", width: "100%" }}>
                    <BasicAudioPlugin state={state}
                    /*    box_id={id}
                        triggerMark={base.triggerMark}*/
                    />
                </div>
            );
        },
    };
}
