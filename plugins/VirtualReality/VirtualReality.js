import React from 'react';
import i18n from 'i18next';
import VirtualRealityPluginEditor from "./components/VirtualRealityPluginEditor";
require('./_virtualReality.scss');
import MarkEditor from "../../_editor/components/rich_plugins/mark_editor/MarkEditor";
import Mark from '../../common/components/mark/Mark';

/* eslint-disable react/prop-types */
export function VirtualReality(base) {
    return {
        init: function() {
            base.registerExtraFunction(this.toolbarChangeValues, "toolbarChanges");
        },
        getConfig: function() {
            return {
                name: 'VirtualReality',
                displayName: i18n.t('VirtualReality.PluginName'),
                category: "multimedia",
                flavor: "react",
                needsConfigModal: false,
                needsTextEdition: false,
                initialWidth: '700px',
                initialHeight: "300px",
                initialWidthSlide: '50%',
                initialHeightSlide: '45%',
                icon: 'event_seat',
                needsPointerEventsAllowed: true,
                isRich: true,
                marksType: [{ name: i18n.t("HotspotImages.pos"), key: 'value', format: '[x,y]', default: '50,50', defaultColor: '#000001' }],

            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: "Entorno",
                            icon: 'edit',
                            buttons: {
                                imagenBack: {
                                    __name: '',
                                    type: 'select',
                                    value: state.imagenBack,
                                    options: ['Elige un fondo...', '360_world.jpg', 'pano-planets.jpg', 'pano-nature.jpg', 'pano-nature2.jpg', 'pano-nature3.jpg', 'pano-boom.jpg', 'pano-people.jpg'],
                                },
                                audioBack: {
                                    __name: 'Audio ambiente',
                                    type: 'checkbox',
                                    checked: state.audioBack,
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
                            __name: "infoPanel",
                            icon: 'perm_media',
                            buttons: {
                                urlPanel: {
                                    __name: 'URL',
                                    type: 'external_provider',
                                    accept: "image/*",
                                    value: state.urlPanel,
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
                imagenBack: undefined,
                urlBack: undefined,
                urlPanel: undefined,
                audioBack: false,
            };
        },
        getRenderTemplate: function(state, props) {
            let marks = props.marks || {};
            let id = props.id;

            return (
                <div style={{ height: "100%", width: "100%" }} className={'VRPlugin'}>

                    <div className="dropableRichZone" style={{ height: "100%", width: "100%", position: 'absolute', top: 0, left: 0 }} />
                    <VirtualRealityPluginEditor id={props.id} state={state} marks={marks}/>

                </div>);

        },
        parseRichMarkInput: function(...value) {
            let x = (value[0] + 12) * 100 / value[2];
            let y = (value [1] + 26) * 100 / value[3];
            let finalValue = y.toFixed(2) + "," + x.toFixed(2);
            /* let win = document.querySelector('#box-'+value[6]+' .VR');
        console.log(win)*/
            let angle = 0;

            return finalValue;
        },

        validateValueInput: function(value) {
            let regex = /(^-*\d+(?:\.\d*)?),(-*\d+(?:\.\d*)?$)/g;
            let match = regex.exec(value);
            if (match && match.length === 3) {
                let x = Math.round(parseFloat(match[1]) * 100000) / 100000;
                let y = Math.round(parseFloat(match[2]) * 100000) / 100000;
                if (isNaN(x) || isNaN(y)) {
                    return { isWrong: true, message: i18n.t("VirtualTour.message_mark_xy") };
                }
                value = x + ',' + y;
            } else {
                return { isWrong: true, message: i18n.t("VirtualTour.message_mark_xy") };
            }
            return { isWrong: false, value: value };
        },
        pointerEventsCallback: function(bool, toolbarState) {
            return;
        },
    };
}
/* eslint-enable react/prop-types */
