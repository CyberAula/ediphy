import React from 'react';
import VideoPlugin from './../components/VideoPlugin.js';
require('./../BasicVideo.scss');

export function BasicVideo2(base) {
    return {
        getRenderTemplate: function (state,id) {
            return (
                /* jshint ignore:start */
                <div style={{width:"100%", height:"100%"}}>
                    <VideoPlugin style={{width:"100%", height: "100%"}} state={state}></VideoPlugin>
                </div>
                /* jshint ignore:end */
            );
        }
    };
}