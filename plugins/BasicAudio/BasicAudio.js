import React from "react";
import BasicAudioPluginEditor from './components/BasicAudioPluginEditorWS.js';
// import BasicAudioPluginEditor from './components/BasicAudioPluginEditor.js';
import i18n from 'i18next';
// import example from './../../dist/playlists/a2002011001-e02-128k.mp3';
require('./BasicAudio.scss');

// Duda: en caso de que se deban mostrar el tamaño debe ser diferente pero solo en el visor supongo, pq sino en el editor no entiendo como hacerlo

export function BasicAudio(base) {
    return {
        getConfig: function() {
            return {
                name: 'BasicAudio',
                flavor: "react",
                isRich: true,
                displayName: i18n.t('BasicAudio.PluginName'),
                category: "multimedia",
                initialWidth: '400px',
                initialHeight: "140px",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
                icon: 'play_circle_filled',
                aspectRatioButtonConfig: {
                    location: ["main", "structure"],
                    defaultValue: false,
                },
                marksType: [{ name: i18n.t("BasicAudio.pos"), key: 'value', format: '[x%]', default: '50%', defaultColor: "#17CFC8" }],
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: i18n.t('BasicAudio.Audio'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Ediphy.i18n.t('EnrichedPlayer.URL'),
                                    type: 'external_provider',
                                    value: state.url,
                                    accept: "audio/*",
                                    autoManaged: false,
                                },
                                autoplay: {
                                    __name: Ediphy.i18n.t('BasicAudio.Autoplay'),
                                    type: 'checkbox',
                                    checked: state.autoplay,
                                    autoManaged: false,
                                },
                                waves: {
                                    __name: Ediphy.i18n.t('BasicAudio.Waves'),
                                    type: 'checkbox',
                                    checked: state.waves,
                                    autoManaged: false,
                                },
                                scroll: {
                                    __name: Ediphy.i18n.t('BasicAudio.Scroll'),
                                    type: 'checkbox',
                                    checked: state.scroll,
                                    autoManaged: false,
                                },
                                progressColor: {
                                    __name: Ediphy.i18n.t('BasicAudio.ProgressColor'),
                                    type: 'color',
                                    value: state.progressColor,
                                },
                                waveColor: {
                                    __name: Ediphy.i18n.t('BasicAudio.WaveColor'),
                                    type: 'color',
                                    value: state.waveColor,
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
                url: 'http://localhost:8080/playlists/Chopin_Nocturne.mp3',
                autoplay: false,
                controls: true,
                waves: true,
                barWidth: 0.5,
                progressColor: '#878787',
                waveColor: '#178582',
                scroll: false,
            };
        },
        getRenderTemplate: function(state, props) {
            if (state.url.match(/^https?\:\/\/api.soundcloud.com\//g)) {
                return <iframe style={{ pointerEvents: 'none' }} width="100%" height="100%" scrolling="no" frameBorder="no" allow="autoplay" src={"https://w.soundcloud.com/player/?url=" + encodeURI(state.url) + "&color=%2317cfc8&auto_play=false&hide_related=true&show_comments=true&show_user=false&show_reposts=false&show_teaser=false&visual=" + (state.waves ? "false" : "true")} />;
            }
            return (<div style={{ height: "100%", width: "100%" }}>
                <BasicAudioPluginEditor style={{ width: "100%", height: "100%" }} base={base} props={props} state={state}/>
            </div>
            );

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
