
import React from 'react';

/* eslint-disable react/prop-types */
export function VirtualReality(base) {

    return {
        getRenderTemplate: function(state, props) {

            return (
                <div>
            		<iframe allow="vr" width= '100%' height= '100%' src='http://localhost:8081/index.html' id="receiver" style={{ pointerEvents: 'all' }} />);
        		</div>
        	);
        },
        afterRender: function(element, state) {
        	console.log("Esto no sé por qué no sale");
        	let receiverWindow = document.getElementById("receiver").contentWindow;

            let rutaima = state.imagenBack;
            let playAudio = state.audioBack;
            receiverWindow.postMessage({ imagenBack: rutaima, audioBack: { play: playAudio } }, "http://localhost:8081/index.html");

        },
    };
}
/* eslint-enable react/prop-types */

