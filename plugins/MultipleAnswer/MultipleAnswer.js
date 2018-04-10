import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import i18n from 'i18next';
import './_multipleAnswer.scss';
import { letterFromNumber } from '../../common/common_tools';
/* eslint-disable react/prop-types */

export function MultipleAnswer(base) {
    return {
        getConfig: function() {
            return {
                name: 'MultipleAnswer',
                displayName: Ediphy.i18n.t('MultipleAnswer.PluginName'),
                category: 'evaluation',
                icon: 'check_box',
                initialWidth: '60%',
                flavor: 'react',
                isComplex: true,
                defaultCorrectAnswer: [],
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
                                nBoxes: {
                                    __name: i18n.t("MultipleAnswer.Number"),
                                    type: 'number',
                                    value: state.nBoxes,
                                    min: 1,
                                    autoManaged: false,
                                },
                                showFeedback: {
                                    __name: i18n.t("MultipleAnswer.ShowFeedback"),
                                    type: 'checkbox',
                                    checked: state.showFeedback,
                                },
                                letters: {
                                    __name: i18n.t("MultipleAnswer.ShowLettersInsteadOfNumbers"),
                                    type: 'checkbox',
                                    checked: state.letters,
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
                nBoxes: 3,
                showFeedback: true,
                letters: true,
            };
        },
        getRenderTemplate: function(state, props = {}) {

            let answers = [];
            for (let i = 0; i < state.nBoxes; i++) {
                let checked = (props.exercises.correctAnswer && (props.exercises.correctAnswer instanceof Array) && props.exercises.correctAnswer.indexOf(i) > -1);
                answers.push(<div key={i + 1} className={"row answerRow"}>
                    <div className={"col-xs-2 answerPlaceholder"}>
                        <div className={"answer_letter"}>{state.letters ? letterFromNumber(i) : (i + 1)}</div>
                        <input type="checkbox" className="checkQuiz" name={props.id} value={i} checked={checked} onClick={(e)=>{
                            let newCorrectAnswer = props.exercises.correctAnswer.filter((c)=>{
                                return (c < answers.length);
                            });
                            let index = newCorrectAnswer.indexOf(i);
                            if (index === -1) {
                                newCorrectAnswer.push(i);
                            } else {
                                newCorrectAnswer.splice(index, 1);
                            }

                            props.setCorrectAnswer(newCorrectAnswer);
                        }}/>
                    </div>
                    <div className={"col-xs-10"}>
                        <PluginPlaceholder {...props} key={i + 1} plugin-data-display-name={i18n.t("MultipleAnswer.Answer") + " " + (i + 1)} plugin-data-default="BasicText" plugin-data-text={'<p>' + i18n.t("MultipleAnswer.Answer") + (i + 1) + '</p>'} pluginContainer={"Answer" + (i + 1)} />
                    </div>
                </div>
                );
            }
            return <div className={"exercisePlugin multipleAnswerPlugin"}>
                {/* <h1>Multiple Answer</h1>*/}
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="1" plugin-data-display-name={i18n.t("MultipleAnswer.Question")} plugin-data-default="BasicText" plugin-data-text={'<p>' + i18n.t("MultipleAnswer.Statement") + '</p>'} pluginContainer={"Question"} />
                    </div>
                </div>
                {answers}
                <div className={"row feedbackRow"} key={-2} style={{ display: state.showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"}>
                        <PluginPlaceholder {...props} key="-2" plugin-data-display-name={i18n.t("MultipleAnswer.Feedback")} plugin-data-default="BasicText" plugin-data-text={'<p>' + i18n.t("MultipleAnswer.FeedbackMsg") + '</p>'} pluginContainer={"Feedback"} />
                    </div>
                </div>
            </div>;

        },
    };
}
/* eslint-enable react/prop-types */
