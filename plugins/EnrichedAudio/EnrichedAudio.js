import React from "react";
import EnrichedAudioPluginEditor from './components/EnrichedAudioPluginEditorWS.js';
import i18n from 'i18next';
import { convertSecondsToHMS } from "../../common/commonTools";
/* eslint-disable react/prop-types */

export function EnrichedAudio(base) {
    return {
        getConfig: function() {
            return {
                name: 'EnrichedAudio',
                flavor: "react",
                isRich: true,
                displayName: i18n.t('EnrichedAudio.PluginName'),
                category: "multimedia",
                initialWidth: '400px',
                initialHeight: "140px",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
                icon: 'audiotrack',
                marksType: { name: i18n.t("EnrichedAudio.pos"), key: 'value', format: '[h:m:s/m:s]', default: '50%', defaultColor: "#17CFC8" },
                createFromLibrary: ['audio/*', 'url'],
                searchIcon: true,
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: i18n.t('EnrichedAudio.Audio'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Ediphy.i18n.t('EnrichedAudio.URL'),
                                    type: 'externalProvider',
                                    value: state.url,
                                    accept: "audio/*",
                                },

                            },
                        },
                        config: {
                            __name: Ediphy.i18n.t('configuration'),
                            icon: 'build',
                            buttons: {
                                autoplay: {
                                    __name: Ediphy.i18n.t('EnrichedAudio.Autoplay'),
                                    type: 'checkbox',
                                    checked: state.autoplay,
                                },
                                waves: {
                                    __name: Ediphy.i18n.t('EnrichedAudio.Waves'),
                                    type: 'checkbox',
                                    checked: state.waves,
                                },
                                barWidth: {
                                    __name: Ediphy.i18n.t('EnrichedAudio.BarWidth'),
                                    type: 'range',
                                    min: 0,
                                    max: 5,
                                    value: state.barWidth,
                                },
                                progressColor: {
                                    __name: Ediphy.i18n.t('EnrichedAudio.ProgressColor'),
                                    type: 'custom_color_plugin',
                                    value: state.progressColor || getComputedStyle(document.documentElement).getPropertyValue('--themeColor1'),
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('EnrichedAudio.box_style'),
                            icon: 'palette',
                            buttons: {
                                borderWidth: {
                                    __name: Ediphy.i18n.t('EnrichedAudio.border_size'),
                                    type: 'number',
                                    value: 1,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('EnrichedAudio.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('EnrichedAudio.border_color'),
                                    type: 'color',
                                    value: '#aaaaaa',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('EnrichedAudio.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('EnrichedAudio.opacity'),
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
                url: 'http://vishub.org/audios/15288.mp3',
                autoplay: false,
                controls: true,
                waves: true,
                barWidth: 2,
                progressColor: { color: getComputedStyle(document.documentElement).getPropertyValue('--themeColor1'), custom: false },
                waveColor: { color: '#178582', custom: false },
                scroll: false,
            };
        },
        getRenderTemplate: function(state, props) {

            if (state.url.match(/^https?\:\/\/api.soundcloud.com\//g)) {
                return <iframe style={{ pointerEvents: 'none' }} width="100%" height="100%" scrolling="no" frameBorder="no" allow="autoplay" src={"https://w.soundcloud.com/player/?url=" + encodeURI(state.url) + "&color=%2317cfc8&auto_play=false&hide_related=true&show_comments=true&show_user=false&show_reposts=false&show_teaser=false&visual=" + (state.waves ? "false" : "true")} />;
            }
            return (<EnrichedAudioPluginEditor style={{ width: "100%", height: "100%" }} base={base} props={props} state={state}/>
            );

        },

        getDefaultMarkValue() {
            return '0:00';
        },
        parseRichMarkInput: function(x, y, width, height, toolbarState, boxId) {
            let parsed_value = (x + 10) / width;
            let duration = $("#box-" + boxId + " .basic-audio-wrapper .duration").attr("duration");
            return convertSecondsToHMS(duration * parsed_value);
        },
        validateValueInput: function(value) {
            let regex = /^((\d+:)?[0-5]\d?:[0-5]\d$)/g;
            let match = regex.exec(value);
            if (match && match.length === 3) {
                return { isWrong: false, value: value };
            }
            return { isWrong: true, message: i18n.t("EnrichedAudio.message_mark_error") };
        },
    };
}
/* eslint-enable react/prop-types */
