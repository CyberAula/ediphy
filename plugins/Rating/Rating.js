import React from 'react';
import './_rating.scss';
import i18n from 'i18next';
import StarComponent from "./StarComponent";
/* eslint-disable react/prop-types */

export function Rating() {
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
                                },
                                stars: {
                                    __name: i18n.t("Rating.ShowStars"),
                                    type: 'checkbox',
                                    checked: state.stars,
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
                                    __name: Ediphy.i18n.t('Rating.backgroundColor'),
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
                stars: true,
                range: 5,
            };
        },
        getRenderTemplate: function(state) {
            let els = [];

            for (let i = 0; i < state.range; i++) {
                if (!state.stars) {
                    els.push(<button className="ratingElement">{i + 1}</button>);
                } else {
                    els.push(<button className="ratingElementStar"><StarComponent /></button>);
                }
            }

            return <div className={"exercisePlugin ratingPlugin"}>
                {els}
            </div>;

        },
    };
}
/* eslint-enable react/prop-types */

