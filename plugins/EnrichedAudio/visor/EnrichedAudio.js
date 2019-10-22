import React from 'react';
import EnrichedAudioPlugin from '../components/EnrichedAudioPlugin.js';

export function EnrichedAudio() {
    return {
        getRenderTemplate: function(state, props) {
            if (state.url.match(/^https?\:\/\/api.soundcloud.com\//g)) {
                return <iframe width="100%" height="100%" scrolling="no" frameBorder="no" allow="autoplay" src={"https://w.soundcloud.com/player/?url=" + encodeURI(state.url) + "&color=%2317cfc8&auto_play=" + (state.autoplay ? "true" : "false") + "&hide_related=true&show_comments=true&show_user=false&show_reposts=false&show_teaser=false&visual=" + (state.waves ? "false" : "true")} />;
            }
            return (
                <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
                    <EnrichedAudioPlugin style={{ width: "100%", height: "100%" }} state={state} props={props}/>
                </div>
            );

        },
    };
}
