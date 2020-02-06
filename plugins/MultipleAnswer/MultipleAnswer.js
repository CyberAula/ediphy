import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/pluginPlaceholder/PluginPlaceholder';
import i18n from 'i18next';
import { letterFromNumber } from '../../common/commonTools';
import { generateCustomColors } from "../../common/themes/themeLoader";
import { QUIZ_CONFIG, QUIZ_STYLE } from "../../common/quizzes";
import {
    AnswerInput,
    AnswerLetter,
    AnswerRow,
    AnswerText,
    CheckboxInput,
    MultipleAnswerPlugin,
} from "./Styles";
import {
    CheckBoxStyleDangerous,
    CorrectAnswerFeedback,
    CorrectAnswerLabel,
    Feedback,
    FeedbackRow,
    QuestionRow,
} from "../../sass/exercises";
import { isLightColor, removeLastChar } from "../../common/utils";
import { PRIMARY_BLUE } from "../../sass/general/constants";
/* eslint-disable react/prop-types */

export const MultipleAnswer = () => ({
    getConfig: function() {
        return {
            ...QUIZ_CONFIG,
            name: 'MultipleAnswer',
            displayName: Ediphy.i18n.t('MultipleAnswer.PluginName'),
            icon: 'check_box',
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
                            contrast: {
                                __name: 'Improve contrast',
                                type: 'checkbox',
                                checked: state.contrast,
                            },
                        },
                    },
                    style: QUIZ_STYLE,
                },
            },
        };
    },
    getInitialState: () =>({
        nBoxes: 3,
        showFeedback: true,
        letters: i18n.t("MultipleAnswer.ShowLetters"),
        allowPartialScore: false,
        quizColor: { color: document.documentElement.style.getPropertyValue('--themeColor1'), custom: false },
        contrast: false,
    }),
    getRenderTemplate: function(state, props = {}) {
        let correctAnswers = "";
        let quizColor = state.quizColor.color || PRIMARY_BLUE;
        let customStyle = state.quizColor.custom ? generateCustomColors(quizColor, 1, true) : null;
        const showLetters = state.letters === i18n.t("MultipleChoice.ShowLetters");

        const checked = i => (props.exercises.correctAnswer instanceof Array) && props.exercises.correctAnswer.indexOf(i) > -1;
        const clickHandler = i => {
            let newCorrectAnswer = props.exercises.correctAnswer.filter(c => c < answers.length);
            let index = newCorrectAnswer.indexOf(i);
            if (index === -1) {
                newCorrectAnswer.push(i);
            } else {
                newCorrectAnswer.splice(index, 1);
            }
            props.setCorrectAnswer(newCorrectAnswer);
        };

        const Answer = i => (
            <AnswerRow key={i + 1}>
                <AnswerInput>
                    <AnswerLetter light={isLightColor(quizColor)} contrast={state.contrast}>
                        {(state.letters === i18n.t("MultipleAnswer.ShowLetters")) ? letterFromNumber(i) : (i + 1)}
                    </AnswerLetter>
                    <CheckboxInput name={props.id} value={i} checked={checked(i)} onChange={() => clickHandler(i)}/>
                </AnswerInput>
                <AnswerText>
                    <PluginPlaceholder {...props} key={i }
                        pluginContainerName={i18n.t("MultipleAnswer.Answer") + " " + (i + 1)}
                        pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("MultipleAnswer.Answer") + " " + (1 + i) + '</p>' } }]}
                        pluginContainer={"Answer" + (i)} />
                </AnswerText>
            </AnswerRow>
        );

        let answers = [...Array(state.nBoxes)].map((a, i) => {
            if (checked(i)) { correctAnswers += (showLetters ? letterFromNumber(i) : (i + 1)) + ", "; }
            return Answer(i);
        });

        if (!props.exercises.correctAnswer || props.exercises.correctAnswer.length === 0) {
            correctAnswers += i18n.t("MultipleAnswer.None") + ".";
        } else {
            correctAnswers = removeLastChar(removeLastChar(correctAnswers)) + ".";
        }

        return (
            <MultipleAnswerPlugin style={customStyle}>
                <QuestionRow key={0}>
                    <PluginPlaceholder {...props} key="0"
                        pluginContainerName={i18n.t("MultipleAnswer.Question")}
                        pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("MultipleAnswer.Statement") + '</p>' } }]}
                        pluginContainer={"Question"} />
                </QuestionRow>
                {answers}
                <FeedbackRow show={state.showFeedback} key={-2}>
                    <Feedback>
                        <PluginPlaceholder {...props} key="-2"
                            pluginContainerName={i18n.t("MultipleAnswer.Feedback")}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("MultipleAnswer.FeedbackMsg") + '</p>' } }/* , {plugin: 'HotspotImages', initialState:{url: 'nooo'}}*/]}
                            pluginContainer={"Feedback"} />
                    </Feedback>
                </FeedbackRow>
                <CorrectAnswerFeedback>
                    <CorrectAnswerLabel> {i18n.t("MultipleAnswer.correctAnswerFeedback") }:</CorrectAnswerLabel> {correctAnswers}
                </CorrectAnswerFeedback>
                <style dangerouslySetInnerHTML={{
                    __html: CheckBoxStyleDangerous('multipleAnswerPlugin'),
                }} />
            </MultipleAnswerPlugin>);

    },
});
/* eslint-enable react/prop-types */
