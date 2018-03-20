import React from 'react';
import BasicAudioPluginEditor from './components/BasicAudioPluginEditor.js';
import i18n from 'i18next';
import ReactAudioPlayer from 'react-audio-player';

export function BasicAudio(base) {
    return {
        getConfig: function() {
            return {
                name: 'BasicAudio',
                flavor: "react",
                isRich: true, // para poner marcas
                displayName: i18n.t('BasicAudio.PluginName'),
                category: "multimedia",
                needConfigModal: false, // con esto no ponemos dimensiones iniciales
                icon: 'play_circle_filled',
                aspectRatioButtonConfig: {
                    location: ["main", "__sortable"],
                    defaultValue: true,
                },
                marksType: [{ name: i18n.t("BasicAudio.pos"), key: 'value', format: '[x%]', default: '50%', defaultColor: "#17CFC8" }],
            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: i18n.t('BasicAudio.Audio'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Ediphy.i18n.t('BasicAudio.URL'),
                                    type: 'text',
                                    value: base.getState().url,
                                    autoManaged: false,
                                },
                                autoplay: {
                                    __name: Ediphy.i18n.t('BasicAudio.Autoplay'),
                                    type: 'checkbox',
                                    checked: base.getState().autoplay,
                                    autoManaged: false,
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('BasicAudio.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('BasicAudio.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('BasicAudio.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('BasicAudio.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('BasicAudio.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('BasicAudio.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('BasicAudio.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.05,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                url: 'http://www.music.helsinki.fi/tmt/opetus/uusmedia/esim/a2002011001-e02-128k.mp3',
                autoplay: false,
                controls: true,
            };
        },
        getRenderTemplate: function(state, props = {}) {
            // EnrichedPlayer pasa tb base y props
            console.log(state, props);
            return (
                <div style={{ height: "100%", width: "100%" }}>
                    <BasicAudioPluginEditor style={{ width: "100%", height: "100%" }} base={base} onRichMarkUpdated={props.onRichMarkUpdated} state={state}/>
                </div>
            );
        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },

        getDefaultMarkValue(state) {
            console.log("getDefaultMarkValue");
            return '50%';
        },
        parseRichMarkInput: function(...value) {
            console.log("parseRichMarkInput");
            let parsed_value = (value[0] + 10) * 100 / value[2];
            return parsed_value.toFixed(2) + "%";
        },
        validateValueInput: function(value) {
            console.log("validateValueInput");
            let regex = /(^\d+(?:\.\d*)?%$)/g;
            let match = regex.exec(value);
            if (match && match.length === 2) {
                let val = Math.round(parseFloat(match[1]) * 100) / 100;
                if (isNaN(val) || val > 100) {
                    return { isWrong: true, message: i18n.t("BasicAudio.message_mark_percentage") };
                }
                value = val + '%';
            } else {
                return { isWrong: true, message: i18n.t("BasicAudio.message_mark_percentage") };
            }
            return { isWrong: false, value: value };

        },
    };
}
