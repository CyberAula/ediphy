import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import './_rating.scss';
import i18n from 'i18next';
import { letterFromNumber } from '../../common/common_tools';
import star from './star.svg';
import Star from "./Star";
/* eslint-disable react/prop-types */

export function Rating(base) {
    return {
        getConfig: function() {
            return {
                name: 'Rating',
                displayName: Ediphy.i18n.t('Rating.PluginName'),
                category: 'evaluation',
                icon: 'star',
                initialWidth: '60%',
                flavor: 'react',
                isComplex: true,
                defaultCorrectAnswer: 0,
                defaultCurrentAnswer: false,
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        __score: {
                            __name: i18n.t('configuration'),
                            icon: 'build',
                            buttons: {
                                range: {
                                    __name: i18n.t("Rating.Number"),
                                    type: 'number',
                                    value: state.range,
                                    min: 1,
                                    autoManaged: false,
                                },
                                numeric: {
                                    __name: i18n.t("Rating.ShowLettersInsteadOfNumbers"),
                                    type: 'checkbox',
                                    checked: state.numeric,
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('Rating.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('Rating.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
                                backgroundColor: {
                                    __name: Ediphy.i18n.t('Rating.background_color'),
                                    type: 'color',
                                    value: '#ffffff',
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('Rating.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('Rating.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('Rating.border_color'),
                                    type: 'color',
                                    value: '#dbdbdb',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('Rating.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('Rating.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                numeric: true,
                range: 5,
            };
        },
        getRenderTemplate: function(state, props = {}) {
            let els = [];

            for (let i = 0; i < state.range; i++) {
                if (state.numeric) {
                    els.push(<button className="ratingElement">{i + 1}</button>);
                } else {
                    els.push(<button className="ratingElementStar"><Star stroke={'#00ffff'} /></button>);
                }
            }

            return <div className={"exercisePlugin ratingPlugin"}>
                {els}
            </div>;

        },
    };
}
/* eslint-enable react/prop-types */

