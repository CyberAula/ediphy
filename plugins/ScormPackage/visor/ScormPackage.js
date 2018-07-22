import React from 'react';
import ScormIframeWrapper from "../ScormIframeWrapper";

/* eslint-disable react/prop-types */
export function ScormPackage(base) {
    return {
        getRenderTemplate: function(state, props) {

            return <ScormIframeWrapper url={state.url} setAnswer={props.setAnswer} id={props.id}/>;

        },
        checkAnswer(current, correct) {
            return (current) / 100;
        },
    };
}
/* eslint-enable react/prop-types */
