import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/pluginPlaceholder/PluginPlaceholder';
import i18n from 'i18next';
import './_multipleAnswer.scss';
import { letterFromNumber } from '../../common/commonTools';
import { generateCustomColors } from "../../common/themes/themeLoader";
/* eslint-disable react/prop-types */

export function MultipleAnswer() {
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
                                    max: 10,
                                    min: 1,
                                },
                                showFeedback: {
                                    __name: i18n.t("MultipleAnswer.ShowFeedback"),
                                    type: 'checkbox',
                                    checked: state.showFeedback,
                                },
                                allowPartialScore: {
                                    __name: i18n.t("MultipleAnswer.AllowPartialScore"),
                                    type: 'checkbox',
                                    checked: state.allowPartialScore,
                                },
                                letters: {
                                    __name: i18n.t("MultipleAnswer.ShowLettersInsteadOfNumbers"),
                                    type: 'radio',
                                    value: state.letters,
                                    options: [i18n.t("MultipleAnswer.ShowLetters"), i18n.t("MultipleAnswer.ShowNumbers")],
                                },
                                quizColor: {
                                    __name: Ediphy.i18n.t('MultipleChoice.Color'),
                                    type: 'custom_color_plugin',
                                    value: state.quizColor || getComputedStyle(document.documentElement).getPropertyValue('--themeColor1'),
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
                nBoxes: 3,
                showFeedback: true,
                letters: i18n.t("MultipleAnswer.ShowLetters"),
                allowPartialScore: false,
                quizColor: { color: 'rgba(0, 173, 156, 1)', custom: false },
            };
        },
        getRenderTemplate: function(state, props = {}) {

            let answers = [];
            let correctAnswers = "";

            let quizColor = state.quizColor.color;
            let customStyle = generateCustomColors(quizColor, 1, true);

            function removeLastChar(s) {
                if (!s || s.length === 0) {
                    return s;
                }
                return s.substring(0, s.length - 1);
            }
            for (let i = 0; i < state.nBoxes; i++) {
                let checked = (props.exercises.correctAnswer && (props.exercises.correctAnswer instanceof Array) && props.exercises.correctAnswer.indexOf(i) > -1);
                answers.push(<div key={i + 1} className={"row answerRow"}>
                    <div className={"col-xs-2 answerPlaceholder"}>
                        <div className={"answer_letter"}>{(state.letters === i18n.t("MultipleAnswer.ShowLetters")) ? letterFromNumber(i) : (i + 1)}</div>
                        <input type="checkbox" className="checkQuiz" name={props.id} value={i} checked={checked} onClick={()=>{
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
                        <PluginPlaceholder {...props} key={i }
                            pluginContainerName={i18n.t("MultipleAnswer.Answer") + " " + (i + 1)}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("MultipleAnswer.Answer") + " " + (1 + i) + '</p>' } }]}
                            pluginContainer={"Answer" + (i)} />
                    </div>
                </div>
                );
                if (checked) {
                    correctAnswers += (state.letters === i18n.t("MultipleChoice.ShowLetters") ? letterFromNumber(i) : (i + 1)) + ", ";
                }

            }
            if (!props.exercises.correctAnswer || props.exercises.correctAnswer.length === 0) {
                correctAnswers += i18n.t("MultipleAnswer.None") + ".";
            } else {
                correctAnswers = removeLastChar(removeLastChar(correctAnswers)) + ".";
            }
            return <div className={"exercisePlugin multipleAnswerPlugin"} style={ state.quizColor.custom ? customStyle : null }>
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="0"
                            pluginContainerName={i18n.t("MultipleAnswer.Question")}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("MultipleAnswer.Statement") + '</p>' } }]}
                            pluginContainer={"Question"} />
                    </div>
                </div>
                {answers}
                <div className={"row feedbackRow"} key={-2}>
                    <div className={"col-xs-12 feedback"}>
                        <PluginPlaceholder {...props} key="-2"
                            pluginContainerName={i18n.t("MultipleAnswer.Feedback")}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("MultipleAnswer.FeedbackMsg") + '</p>' } }/* , {plugin: 'HotspotImages', initialState:{url: 'nooo'}}*/]}
                            pluginContainer={"Feedback"} />
                    </div>
                </div>
                <div className="correctAnswerFeedback">
                    <span className="correctAnswerLabel"> {i18n.t("MultipleAnswer.correctAnswerFeedback") }:</span> {correctAnswers}
                </div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                   .multipleAnswerPlugin .checkQuiz:checked:after {
                      color: var(--themeColor1);
                    }
                  `,
                }} />
            </div>;

        },
    };
}
/* eslint-enable react/prop-types */
