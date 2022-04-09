import React from 'react';
import ScormIframeWrapper from "../ScormIframeWrapper";

/* eslint-disable react/prop-types */
export function ScormPackage() {
    return {
        getRenderTemplate: function(state, props) {
            let url = state.url;
            const params = new URLSearchParams(window.location.search);
            if (params.has('escapp_email') && params.has('escapp_token')) {
                if (url.includes('?')) {
                    url += "&escapp_email=" + encodeURIComponent(params.get('escapp_email')) + "&escapp_token=" + params.get('escapp_token');
                } else {
                    url += "?escapp_email=" + encodeURIComponent(params.get('escapp_email')) + "&escapp_token=" + params.get('escapp_token');
                }
            }
            if (params.has('locale')) {
                if (url.includes('?')) {
                    url += "&locale=" + params.get('locale');
                } else {
                    url += "?locale=" + params.get('locale');
                }
            }
            if (params.has('escapp_endpoint')) {
                if (url.includes('?')) {
                    url += "&escapp_endpoint=" + encodeURIComponent(params.get('escapp_endpoint'));
                } else {
                    url += "?escapp_endpoint=" + encodeURIComponent(params.get('escapp_endpoint'));
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
