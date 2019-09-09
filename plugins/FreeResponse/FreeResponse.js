import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/pluginPlaceholder/PluginPlaceholder';
import i18n from 'i18next';
import './_freeResponse.scss';
import { generateCustomColors } from "../../common/themes/themeLoader";
/* eslint-disable react/prop-types */

export function FreeResponse() {
    return {
        getConfig: function() {
            return {
                name: 'FreeResponse',
                displayName: i18n.t('FreeResponse.PluginName'),
                category: 'evaluation',
                icon: 'message',
                initialWidth: '60%',
                flavor: 'react',
                isComplex: true,
                defaultCorrectAnswer: "",
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
                                correct: {
                                    __name: i18n.t("FreeResponse.Correct"),
                                    type: 'checkbox',
                                    checked: state.correct,
                                },
                                showFeedback: {
                                    __name: i18n.t("FreeResponse.ShowFeedback"),
                                    type: 'checkbox',
                                    checked: state.showFeedback,
                                },
                                quizColor: {
                                    __name: Ediphy.i18n.t('FreeResponse.FeedbackColor'),
                                    type: 'custom_color_plugin',
                                    value: state.quizColor || getComputedStyle(document.documentElement).getPropertyValue('--themeColor1'),
                                },
                                characters: {
                                    __name: i18n.t("FreeResponse.Characters"),
                                    type: 'checkbox',
                                    hide: state.type !== "text",
                                    checked: state.characters,
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('HotspotImages.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('HotspotImages.padding'),
                                    type: 'number',
                                    value: 10,
                                    min: 0,
                                    max: 100,
                                },
                                backgroundColor: {
                                    __name: Ediphy.i18n.t('HotspotImages.backgroundColor'),
                                    type: 'color',
                                    value: '#ffffff',
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('HotspotImages.border_size'),
                                    type: 'number',
                                    value: 1,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('HotspotImages.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('HotspotImages.border_color'),
                                    type: 'color',
                                    value: '#dbdbdb',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('HotspotImages.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('HotspotImages.opacity'),
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
                showFeedback: true,
                characters: true,
                correct: true,
                quizColor: { color: 'rgba(0, 173, 156, 1)', custom: false },
            };
        },
        getRenderTemplate: function(state, props) {
            let clickHandler = (e)=>{
                props.setCorrectAnswer(e.target.value);
            };

            let quizColor = state.quizColor.color;
            let customStyle = generateCustomColors(quizColor, 1, true);

            return <div className={"exercisePlugin freeResponsePlugin"} style={ state.quizColor.custom ? customStyle : null }>
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="1"
                            pluginContainerName={i18n.t('FreeResponse.Question') }
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("FreeResponse.Statement") + '</p>' } }]}
                            pluginContainer={'Question'} />
                        <textarea disabled={!state.correct} className="form-control textAreaQuiz"
                            placeholder={i18n.t('FreeResponse.PlaceholderEditor')} value={props.exercises.correctAnswer} onChange={clickHandler}/>
                        {(state.correct && props.exercises.correctAnswer && props.exercises.correctAnswer.length && props.exercises.correctAnswer.length > 100) ? (
                            <div className={"tooManyCharacters"}>{i18n.t('FreeResponse.TooMany')}</div>) : null}
                    </div>
                </div>
                <div className={"row feedbackRow"} key={-2} style={{ display: state.showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"}>
                        <PluginPlaceholder {...props} key="-2"
                            pluginContainerName={i18n.t("FreeResponse.Feedback")}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("FreeResponse.FeedbackMsg") + '</p>' } }]}
                            pluginContainer={"Feedback"} />
                    </div>
                </div>
            </div>;

        },
    };
}
/* eslint-enable react/prop-types */
