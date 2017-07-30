import React from 'react';
import EnrichedPlayerPlugin from '../components/EnrichedPlayerPlugin.js';
require('./../EnrichedPlayer.scss');

export function EnrichedPlayer(base) {
    return {
        getRenderTemplate: function(state, id) {
            return (
                /* jshint ignore:start */
                <div style={{ width: "100%", height: "100%" }}>
                    <EnrichedPlayerPlugin style={{ width: "100%", height: "100%" }} state={state} box_id={id} triggerMark={base.triggerMark} />
                </div>
                /* jshint ignore:end */
            );
        },
    };
}
