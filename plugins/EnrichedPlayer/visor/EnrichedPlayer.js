import React from 'react';
import EnrichedPlayerPlugin from '../components/EnrichedPlayerPlugin.js';
require('./../EnrichedPlayer.scss');

export function EnrichedPlayer() {
    return {
        getRenderTemplate: function(state, props) {
            return (
                <div style={{ width: "100%", height: "100%" }}>
                    <EnrichedPlayerPlugin style={{ width: "100%", height: "100%" }} state={state} props={props} />
                </div>
            );
        },
    };
}
// eslint-disable-file react/prop-types
