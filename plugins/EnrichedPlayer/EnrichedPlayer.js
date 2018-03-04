import React from "react";
import EnrichedPlayerPluginEditor from './components/EnrichedPlayerPluginEditor.js';
import i18n from 'i18next';
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
                    location: ["main", "__sortable"],
                    defaultValue: true,
                },
                marksType: [{ name: i18n.t("EnrichedPlayer.pos"), key: 'value', format: '[x%]', default: '50%', defaultColor: "#17CFC8" }],
            };
        },
        getToolbar: function() {
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
                                    type: 'text',
                                    value: base.getState().url,
                                    autoManaged: false,
                                },
                                controls: {
                                    __name: Ediphy.i18n.t('EnrichedPlayer.Show_controls'),
                                    type: 'checkbox',
                                    checked: base.getState().controls,
                                    autoManaged: false,
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('EnrichedPlayer.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('EnrichedPlayer.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
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
        getDefaultMarkValue(state) {
            return '50%';
        },
        parseRichMarkInput: function(...value) {
            let parsed_value = (value[0] + 10) * 100 / value[2];
            return parsed_value.toFixed(2) + "%";
        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
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
/* eslint-enable react/prop-types */
