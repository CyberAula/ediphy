import React from "react";
import BasicAudioPluginEditor from './components/BasicAudioPluginEditor.js';
import i18n from 'i18next';
// import example from './../../dist/playlists/a2002011001-e02-128k.mp3';
require('./BasicAudio.scss');

// Meter una opcion que haga opcional (como el autoplay) el tema de mostrar las ondas
// Duda aqui: en caso de que se deban mostrar el tamaño debe ser diferente pero solo en el visor supongo, pq sino en el editor no entiendo como hacerlo

// Deberia poderse escuchar en el visor por el tema de las marcas, que cuando pongas una escuches donde la has puesto
// Pero esto de momento dejarlo asi estar hasta que sonsoles y algunos decidan que hacer con ello

export function BasicAudio(base) {
    return {
        getConfig: function() {
            return {
                name: 'BasicAudio',
                flavor: "react",
                isRich: true, // para poner marcas
                displayName: i18n.t('BasicAudio.PluginName'),
                category: "multimedia",
                initialWidth: '400px',
                initialHeight: "140px",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
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
                            // titulo del apartado
                            __name: i18n.t('BasicAudio.Audio'),
                            icon: 'link',
                            // cosas de dentro
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
                                waves: {
                                    __name: Ediphy.i18n.t('BasicAudio.Waves'),
                                    type: 'checkbox',
                                    checked: base.getState().waves,
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
                url: 'http://localhost:8080/playlists/basic.mp3',
                autoplay: false, // revisar autoplay pq no funciona
                controls: true,
                waves: false,
            };
        },
        getRenderTemplate: function(state, props) {
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
            return '50%';
        },
        parseRichMarkInput: function(...value) {
            let parsed_value = (value[0] + 10) * 100 / value[2];
            return parsed_value.toFixed(2) + "%";
        },
        validateValueInput: function(value) {
            let regex = /(^\d+(?:\.\d*)?%$)/g;
            let match = regex.exec(value);
            if (match && match.length === 2) {
                let val = Math.round(parseFloat(match[1]) * 100) / 100;
                if (isNaN(val) || val > 100) {
                    return { isWrong: true, message: i18n.t("EnrichedPlayer.message_mark_percentage") };
                }
                value = val + '%';
            } else {
                return { isWrong: true, message: i18n.t("EnrichedPlayer.message_mark_percentage") };
            }
            return { isWrong: false, value: value };

        },
    };
}
