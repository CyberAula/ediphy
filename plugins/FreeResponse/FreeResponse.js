import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/pluginPlaceholder/PluginPlaceholder';
import i18n from 'i18next';
import { generateCustomColors } from "../../common/themes/themeLoader";
import { QUIZ_CONFIG, QUIZ_STYLE } from "../../common/quizzes";
import { FreeResponsePlugin, AnswerRow, TextArea, ManyCharacters } from "./Styles";
import { Feedback, FeedbackRow } from "../../sass/exercises";
/* eslint-disable react/prop-types */

export function FreeResponse() {
    return {
        getConfig: function() {
            return {
                ...QUIZ_CONFIG,
                name: 'FreeResponse',
                displayName: i18n.t('FreeResponse.PluginName'),
                icon: 'message',
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
                        style: QUIZ_STYLE,
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
            const manyCharacters = (state.correct && props.exercises.correctAnswer && props.exercises.correctAnswer.length && props.exercises.correctAnswer.length > 100);

            return <FreeResponsePlugin style={ customStyle }>
                <AnswerRow key={0}>
                    <PluginPlaceholder {...props} key="1"
                        pluginContainerName={i18n.t('FreeResponse.Question') }
                        pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("FreeResponse.Statement") + '</p>' } }]}
                        pluginContainer={'Question'} />
                    <TextArea disabled={!state.correct}
                        placeholder={i18n.t('FreeResponse.PlaceholderEditor')} value={props.exercises.correctAnswer} onChange={clickHandler}/>
                    <ManyCharacters show={manyCharacters}>{i18n.t('FreeResponse.TooMany')}</ManyCharacters>
                </AnswerRow>
                <FeedbackRow show={ state.showFeedback } key={-2}>
                    <Feedback>
                        <PluginPlaceholder {...props} key="-2"
                            pluginContainerName={i18n.t("FreeResponse.Feedback")}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("FreeResponse.FeedbackMsg") + '</p>' } }]}
                            pluginContainer={"Feedback"} />
                    </Feedback>
                </FeedbackRow>
            </FreeResponsePlugin>;

        },
    };
}
/* eslint-enable react/prop-types */
