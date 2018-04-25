import React from 'react';
import ScormIframeWrapper from "../ScormIframeWrapper";

/* eslint-disable react/prop-types */
export function ScormPackage(base) {
    return {
        getRenderTemplate: function(state) {

            return <ScormIframeWrapper url={state.url}/>;

        },
        checkAnswer(current, correct) {
            return (current) === (correct);
        },
    };
}
/* eslint-enable react/prop-types */
