import React from 'react';
import PlayerPlugin from '../components/PlayerPlugin.js';
require('../BasicPlayer.scss');

export function BasicPlayer(base) {
    return {
        getRenderTemplate: function (state,id) {
            return (
                /* jshint ignore:start */
                <div style={{width:"100%", height:"100%"}}>
                    <PlayerPlugin style={{width:"100%", height: "100%"}} state={state}></PlayerPlugin>
                </div>
                /* jshint ignore:end */
            );
        }
    };
}