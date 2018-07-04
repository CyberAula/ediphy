import React from 'react';
import i18n from 'i18next';
import VirtualRealityPluginEditor from "./components/VirtualRealityPluginEditor";
require('./_virtualReality.scss');
import MarkEditor from "../../_editor/components/rich_plugins/mark_editor/MarkEditor";
import Mark from '../../common/components/mark/Mark';

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
                initialWidth: '450px',
                initialHeight: "auto",
                initialWidthSlide: '60%',
                initialHeightSlide: '50%',
                icon: 'event_seat',
                needsPointerEventsAllowed: true,
                isRich: true,
                marksType: [{ name: i18n.t("HotspotImages.pos"), key: 'value',
                    format: '[x,y,z]', default: '0,0,0', defaultColor: '#17CFC8' }],

            };
        },
        getToolbar: function(state) {

            let urlPanels = {};
            for (let i = 0; i < state.numberOfPictures; i++) {
                urlPanels["urlPanel" + i] = {
                    __name: 'URL ' + (i + 1),
                    type: 'external_provider',
                    accept: "image/*",
                    value: state["urlPanel" + i],
                    hide: !state.showPanel,
                    autoManaged: false,
                };
            }
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: "Escenario",
                            icon: 'crop_original',
                            buttons: {
                                imagenBack: {
                                    __name: '',
                                    type: 'select',
                                    value: state.imagenBack,
                                    options: ['Elige un fondo...', '360_world.jpg', 'pano-planets.jpg', 'pano-nature.jpg', 'pano-nature2.jpg', 'pano-nature3.jpg', 'pano-boom.jpg', 'pano-people.jpg'],
                                },
                                urlBack: {
                                    __name: 'Buscar entorno',
                                    type: 'external_provider',
                                    accept: "image/*",
                                    value: state.urlBack,
                                    autoManaged: false,
                                },
                            },
                        },
                        Panel: {
                            __name: "Configuración",
                            icon: 'build',
                            buttons: {
                                audioBack: {
                                    __name: 'Audio ambiente',
                                    type: 'checkbox',
                                    checked: state.audioBack,
                                },
                                showPanel: {
                                    __name: 'Carrusel',
                                    type: 'checkbox',
                                    checked: state.showPanel,
                                },
                                numberOfPictures: {
                                    __name: 'Número de imágenes',
                                    type: 'number',
                                    min: 1,
                                    max: 10,
                                    hide: !state.showPanel,
                                    value: state.numberOfPictures,
                                },
                                ...urlPanels,

                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                imagenBack: undefined,
                urlBack: undefined,
                audioBack: false,
                showPanel: false,
                numberOfPictures: 1,
            };
        },
        getRenderTemplate: function(state, props) {
            let marks = props.marks || {};
            let id = props.id;

            return (
                <div style={{ height: "100%", width: "100%" }} className={'VRPlugin'}>

                    <div className="dropableRichZone" style={{ height: "100%",
                        width: "100%", position: 'absolute', top: 0, left: 0 }} />
                    <VirtualRealityPluginEditor id={props.id} state={state} marks={marks} />

                </div>);

        },
        parseRichMarkInput: function(...value) {
            let xPix = (value[0] - value[2] / 2);
            let yPix = -(value[1] - value[3] / 2);

            // const RATIO = 70;
            const R = 4;
            // let xMet = xPix / value[2] * 10;
            // let yMet = yPix / value[3] * 5;

            let xMet = -xPix / value[2] * 1.75 * Math.PI / 3;
            let yMet = yPix / value[3] * 2 * Math.PI / 3 * value[3] / value[2];
            let vrApp = document.querySelector('#box-' + value[6] + ' .VR');
            let ang = [vrApp.getAttribute('data-x'), vrApp.getAttribute('data-y'), vrApp.getAttribute('data-z')];
            ang = ang.map(a => a * Math.PI / 180);

            let x360 = -R * Math.sin(ang[1] + xMet) * Math.cos(ang[0] + yMet);
            let y360 = R * Math.sin(ang[0] + yMet);
            let z360 = -R * Math.cos(ang[0] + yMet) * Math.cos(ang[1] + xMet);

            let finalValue = x360.toFixed(2) + "," + y360.toFixed(2) + "," + z360.toFixed(2);
            return finalValue;
        },

        validateValueInput: function(value) {
            let regex = /(^-*\d+(?:\.\d*)?),(-*\d+(?:\.\d*)?),(-*\d+(?:\.\d*)?$)/g;
            let match = regex.exec(value);
            if (match && match.length === 4) {
                let x = Math.round(parseFloat(match[1]) * 100000) / 100000;
                let y = Math.round(parseFloat(match[2]) * 100000) / 100000;
                let z = Math.round(parseFloat(match[3]) * 100000) / 100000;
                if (isNaN(x) || isNaN(y)) {
                    return { isWrong: true, message: i18n.t("VirtualTour.message_mark_xy") };
                }
                value = x + ',' + y + ',' + z;
            } else {
                return { isWrong: true, message: i18n.t("VirtualTour.message_mark_xy") };
            }
            return { isWrong: false, value: value };
        },
        pointerEventsCallback: function(bool, toolbarState) {
            return;
        },
        getDefaultMarkValue(state, id) {
            let x, y, z = 0;
            const R = 4;
            let vrApp = document.querySelector('#box-' + id + ' .VR');
            let ang = [0, 0, 0];
            if (vrApp) {
                ang = [vrApp.getAttribute('data-x'), vrApp.getAttribute('data-y'), vrApp.getAttribute('data-z')];
            }
            ang = ang.map(a=>a * Math.PI / 180);

            x = -R * Math.sin(ang[1]) * Math.cos(ang[0]);// + x;
            y = R * Math.sin(ang[0]); // + y;
            z = -R * Math.cos(ang[0]) * Math.cos(ang[1]);

            let finalValue = x.toFixed(2) + "," + y.toFixed(2) + "," + z.toFixed(2);
            return finalValue;
        },
    };
}
/* eslint-enable react/prop-types */
