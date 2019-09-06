import React from "react";
import EnrichedPlayerPluginEditor from './components/EnrichedPlayerPluginEditor.js';
import i18n from 'i18next';
import { convertSecondsToHMS } from "../../common/commonTools";

require('./EnrichedPlayer.scss');

export function EnrichedPlayer(base) {
    return {
        getConfig: function() {
            return {
                name: "EnrichedPlayer",
                flavor: "react",
                isRich: true,
                displayName: Ediphy.i18n.t("EnrichedPlayer.PluginName"),
                category: "multimedia",
                initialWidth: '480px',
                initialHeight: "270px",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
                icon: "play_arrow",
                aspectRatioButtonConfig: {
                    location: ["main", "structure"],
                    defaultValue: true,
                },
                marksType: { name: i18n.t("EnrichedPlayer.pos"), key: 'value', format: '[h:m:s/m:s]', default: '0:00', defaultColor: "#17CFC8" },
                createFromLibrary: ['video/*', 'url'],
                searchIcon: true,
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: Ediphy.i18n.t('EnrichedPlayer.Video'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Ediphy.i18n.t('EnrichedPlayer.URL'),
                                    type: 'externalProvider',
                                    value: state.url,
                                    accept: "video/*",
                                },
                                controls: {
                                    __name: Ediphy.i18n.t('EnrichedPlayer.Show_controls'),
                                    type: 'checkbox',
                                    checked: state.controls,
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('EnrichedPlayer.box_style'),
                            icon: 'palette',
                            buttons: {
                                borderWidth: {
                                    __name: Ediphy.i18n.t('EnrichedPlayer.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('EnrichedPlayer.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('EnrichedPlayer.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('EnrichedPlayer.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('EnrichedPlayer.opacity'),
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
                url: "https://www.youtube.com/watch?v=BV5P_V2Yyrc",
                controls: true,
            };
        },
        getRenderTemplate: function(state, props) {
            return (
                <div style={{ width: "100%", height: "100%" }}>
                    <EnrichedPlayerPluginEditor style={{ width: "100%", height: "100%" }} state={state} base={base} props={props}/>
                </div>
            );
        },
        getDefaultMarkValue() {
            return '0:00';
        },
        parseRichMarkInput: function(x, y, width, height, toolbarState, boxId) {
            let parsed_value = (x + 10) / width;
            let duration = $("#box-" + boxId + " .enriched-player-wrapper").attr("duration");
            return convertSecondsToHMS(duration * parsed_value);
        },
        validateValueInput: function(value) {
            let regex = /^((\d+:)?[0-5]?[0-9]?:[0-5]\d$)/g;
            let match = regex.exec(value);
            if (match && match.length === 3) {
                // let val = match[1];
                return { isWrong: false, value: value };
            }

            return { isWrong: true, message: i18n.t("EnrichedPlayer.message_mark_error") };
        },

    };
}
/* eslint-enable react/prop-types */
