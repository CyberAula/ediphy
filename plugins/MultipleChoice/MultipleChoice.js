import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/pluginPlaceholder/PluginPlaceholder';
import './_multipleChoice.scss';
import i18n from 'i18next';
import { letterFromNumber } from '../../common/commonTools';
import { generateCustomColors } from "../../common/themes/themeLoader";

/* eslint-disable react/prop-types */

export function MultipleChoice() {
    return {
        getConfig: function() {
            return {
                name: 'MultipleChoice',
                displayName: Ediphy.i18n.t('MultipleChoice.PluginName'),
                category: 'evaluation',
                icon: 'radio_button_checked',
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
                                nBoxes: {
                                    __name: i18n.t("MultipleChoice.Number"),
                                    type: 'number',
                                    value: state.nBoxes,
                                    max: 10,
                                    min: 1,
                                },
                                showFeedback: {
                                    __name: i18n.t("MultipleChoice.ShowFeedback"),
                                    type: 'checkbox',
                                    checked: state.showFeedback,
                                },
                                letters: {
                                    __name: i18n.t("MultipleChoice.ShowLettersInsteadOfNumbers"),
                                    type: 'radio',
                                    value: state.letters,
                                    options: [i18n.t("MultipleChoice.ShowLetters"), i18n.t("MultipleChoice.ShowNumbers")],
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
                letters: i18n.t("MultipleChoice.ShowLetters"),
                quizColor: { color: document.documentElement.style.getPropertyValue('--themeColor1'), custom: false },
            };
        },
        getRenderTemplate: function(state, props = {}) {
            let answers = [];
            let correctAnswers = "";
            let quizColor = state.quizColor.color;
            let customColor = generateCustomColors(quizColor, 1, true);
            let customStyle = { ...customColor };

            for (let i = 0; i < state.nBoxes; i++) {
                let clickHandler = (e)=>{
                    props.setCorrectAnswer(parseInt(e.target.value, 10));
                };
                let isCorrect = props.exercises.correctAnswer === i;
                answers.push(<div key={i + 1} className={"row answerRow"}>
                    <div className={"col-xs-2 answerPlaceholder"} >
                        <div className={"answer_letter"}>{(state.letters === i18n.t("MultipleChoice.ShowLetters")) ? letterFromNumber(i) : (i + 1)}</div>
                        <input type="radio" className="radioQuiz" name={props.id} value={i} checked={isCorrect}
                            onChange={clickHandler} />
                    </div>
                    <div className={"col-xs-10"}>
                        <PluginPlaceholder {...props} key={i + 1}
                            pluginContainerName={i18n.t("MultipleChoice.Answer") + " " + (i + 1)}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("MultipleChoice.Answer") + " " + (1 + i) + '</p>' } }]}
                            pluginContainer={"Answer" + i} />
                    </div>
                </div>
                );
                if (isCorrect) {correctAnswers += state.letters === i18n.t("MultipleChoice.ShowLetters") ? letterFromNumber(i) : (i + 1);}
            }
            return <div className={"exercisePlugin multipleChoicePlugin"} style={ state.quizColor.custom ? customStyle : null }>
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="1"
                            pluginContainerName={i18n.t("MultipleChoice.Question")}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("MultipleChoice.Statement") + '</p>' } }]}
                            pluginContainer={"Question"} />
                    </div>
                </div>
                {answers}
                <div className={"row feedbackRow"} key={-2} style={{ display: state.showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"} >
                        <PluginPlaceholder {...props} key="-2"
                            pluginContainerName={i18n.t("MultipleChoice.Feedback")}
                            pluginContainer={"Feedback"}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("MultipleChoice.FeedbackMsg") + '</p>' } }/* , {plugin: 'HotspotImages', initialState:{url: 'nooo'}}*/]}
                        />
                    </div>
                </div>
                <div className="correctAnswerFeedback" >
                    <span className="correctAnswerLabel"> {i18n.t("MultipleChoice.correctAnswerFeedback") }:</span> {correctAnswers}
                </div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .multipleChoicePlugin input[type="radio"]  {
                      background-color: transparent;
                    }
                   .multipleChoicePlugin input[type="radio"]:checked:after {
                      background-color: var(--themeColor1);
                    }
                  `,
                }} />
            </div>;

        },
    };

}
/* eslint-enable react/prop-types */

