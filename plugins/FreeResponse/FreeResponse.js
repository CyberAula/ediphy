import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import i18n from 'i18next';
import './_freeResponse.scss';
/* eslint-disable react/prop-types */

export function FreeResponse(base) {
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
                            __name: i18n.t('Score'),
                            icon: 'build',
                            buttons: {
                                showFeedback: {
                                    __name: i18n.t("FreeResponse.ShowFeedback"),
                                    type: 'checkbox',
                                    checked: state.showFeedback,
                                },
                                correct: {
                                    __name: i18n.t("FreeResponse.Correct"),
                                    type: 'checkbox',
                                    checked: state.correct,
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
                                    __name: Ediphy.i18n.t('HotspotImages.background_color'),
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
            };
        },
        getRenderTemplate: function(state, props) {
            let clickHandler = (e)=>{
                props.setCorrectAnswer(e.target.value);
            };
            return <div className={"exercisePlugin freeResponsePlugin"} > {/* <h1>Free Response</h1>*/}
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="1" plugin-data-display-name={i18n.t('FreeResponse.Question') } plugin-data-default="BasicText" plugin-data-text={'<p>' + i18n.t("FreeResponse.Statement") + '</p>'} pluginContainer={'Question'} />
                        <textarea disabled={!state.correct} className="form-control textAreaQuiz" placeholder={i18n.t('FreeResponse.PlaceholderEditor')} value={props.exercises.correctAnswer} onChange={clickHandler}/>
                        {(state.correct && props.exercises.correctAnswer && props.exercises.correctAnswer.length && props.exercises.correctAnswer.length > 100) ? (
                            <div className={"tooManyCharacters"}>{i18n.t('FreeResponse.TooMany')}</div>) : null}
                    </div>
                </div>
                <div className={"row feedbackRow"} key={-2} style={{ display: state.showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"}>
                        <PluginPlaceholder {...props} key="-2" plugin-data-display-name={i18n.t("FreeResponse.Feedback")} plugin-data-default="BasicText" plugin-data-text={'<p>' + i18n.t("FreeResponse.FeedbackMsg") + '</p>'} pluginContainer={"Feedback"} />
                    </div>
                </div>
            </div>;

        },
    };
}
/* eslint-enable react/prop-types */
