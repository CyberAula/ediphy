import React from 'react';
import ScormIframeWrapper from "../ScormIframeWrapper";

/* eslint-disable react/prop-types */
export function ScormPackage() {
    return {
        getRenderTemplate: function(state, props) {
            let url = state.url;
            const params = new URLSearchParams(window.location.search);
            if (params.has('email') && params.has('token')) {
                if (url.includes('?')) {
                    url += "&email=" + params.get('email') + "&token=" + params.get('token');
                } else {
                    url += "?email=" + params.get('email') + "&token=" + params.get('token');
                }
            }
            if (window.location.protocol === "https:") {
                url = url.replace("http:", "https:");
            }
            return <ScormIframeWrapper url={url} setAnswer={props.setAnswer} id={props.id}/>;

        },
        checkAnswer(current) {
            return (current) / 100;
        },
    };
}
/* eslint-enable react/prop-types */
