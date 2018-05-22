import React from 'react';
// import BasicAudioPlugin from '../components/BasicAudioPluginWS.js';
import BasicAudioPlugin from '../components/BasicAudioPlugin.js';
require('./../BasicAudio.scss');

export function BasicAudio(base) {
    return {
        getRenderTemplate: function(state, props) {
            if (state.url.match(/^https?\:\/\/api.soundcloud.com\//g)) {
                return <iframe width="100%" height="100%" scrolling="no" frameBorder="no" allow="autoplay" src={"https://w.soundcloud.com/player/?url=" + encodeURI(state.url) + "&color=%2317cfc8&auto_play=" + (state.autoplay ? "true" : "false") + "&hide_related=true&show_comments=true&show_user=false&show_reposts=false&show_teaser=false&visual=true"} />;
            }
            return (
                <div style={{ height: "100%", width: "100%" }}>
                    <BasicAudioPlugin style={{ width: "100%", height: "100%" }} state={state} props={props}/>
                </div>
            );

        },
    };
}
