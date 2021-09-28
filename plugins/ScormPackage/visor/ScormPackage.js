import React from 'react';
import ScormIframeWrapper from "../ScormIframeWrapper";

/* eslint-disable react/prop-types */
export function ScormPackage() {
    return {
        getRenderTemplate: function(state, props) {
            const params = new URLSearchParams(window.location.search);
            let url = state.url;
            if (url && params.has('ESCAPP_USER') && params.has('ESCAPP_TOKEN')) {
                url = url.replace("__ESCAPP_USER__", params.get('ESCAPP_USER'));
                url = url.replace("__ESCAPP_TOKEN__", params.get('ESCAPP_TOKEN'));
            }
            return <ScormIframeWrapper url={url} setAnswer={props.setAnswer} id={props.id}/>;

        },
        checkAnswer(current) {
            return (current) / 100;
        },
    };
}
/* eslint-enable react/prop-types */
