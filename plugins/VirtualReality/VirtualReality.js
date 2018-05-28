import React from 'react';
import i18n from 'i18next';

// add to package json script
// "prestart": "node /plugins/VirtualReality/webpack_plugins/compile_script.js /plugins/VirtualReality/precompiled_assets/",

/* eslint-disable react/prop-types */
export function VirtualReality(base) {
    return {
        getConfig: function() {
            return {
                name: 'VirtualReality',
                displayName: i18n.t('VirtualReality.PluginName'),
                category: "multimedia",
                flavor: "react",
                needsConfigModal: false,
                needsTextEdition: false,
                initialWidth: '700px',
                initialHeight: "400px",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
                icon: 'event_seat',

            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: 'Config',
                            icon: 'link',
                            buttons: {
                                name: {
                                    __name: 'Config',
                                    type: 'text',
                                    value: state.name,
                                    autoManaged: false,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                name: "Ediphy",
            };
        },
        getRenderTemplate: function(state, props) {

            return (<div>
                <button id="postmessage">Comprobar conexión con iframe</button>
                <select name="imagen" id="imagen">
                    <option value="" disabled selected>Elija un fondo...</option>
                    <option value="pano-nature.jpg">Fondo de atardecer</option>
                    <option value="pano-planets.jpg">Fondo de planetas</option>
                </select>
                <button id="postimgBack">ChangeImgBack</button>
                <iframe allow="vr" width= '100%' height= '370px' src='http://localhost:8081/index.html' id="receiver"/>

            </div>);

        },
        afterRender: function(element, state) {
            // Ventana del iframe
            let receiverWindow = document.getElementById("receiver").contentWindow;
            // Envío de datos al iframe
            document.getElementById("postmessage").addEventListener("click", function() {
                receiverWindow.postMessage({ conexion: "Conexión correcta" }, "http://localhost:8081/index.html");
                document.getElementById("postmessage").style.display = "none";
            });
            document.getElementById("postimgBack").addEventListener("click", function() {
                let rutaima = document.getElementById("imagen").options[document.getElementById("imagen").selectedIndex].value;
                receiverWindow.postMessage({ imagenBack: rutaima }, "http://localhost:8081/index.html");
            });

            // Datos recibidos de confirmación
            window.addEventListener("message", receiveMessage, false);
            function receiveMessage(event) {
                console.log("(EDiphy) ha llegado esto: " + event.data);
            }
        },

    };
}
/* eslint-enable react/prop-types */
