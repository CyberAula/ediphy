import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/pluginPlaceholder/PluginPlaceholder';
import './_truefalse.scss';
import i18n from 'i18next';
import { generateCustomColors } from "../../common/themes/themeLoader";
import { QUIZ_CONFIG, QUIZ_STYLE } from "../../common/quizzes";
import {
    AnswerPlaceholder,
    AnswerRow,
    Feedback,
    FeedbackRow,
    IconCol,
    QuestionRow,
    RadioInput,
    TFRow,
    TrueFalsePlugin,
} from "./Styles";
/* eslint-disable react/prop-types */

export const TrueFalse = () => ({
    getConfig: () => ({
        ...QUIZ_CONFIG,
        name: 'TrueFalse',
        displayName: Ediphy.i18n.t('TrueFalse.PluginName'),
        icon: 'check_circle',
        defaultCorrectAnswer: ["false", "false", "false"],
        defaultCurrentAnswer: ["", "", ""],
    }),
    getToolbar: (state) => ({
        main: {
            __name: "Main",
            accordions: {
                __score: {
                    __name: i18n.t('configuration'),
                    icon: 'build',
                    buttons: {
                        nBoxes: {
                            __name: i18n.t("TrueFalse.Number"),
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
                        allowPartialScore: {
                            __name: i18n.t("MultipleAnswer.AllowPartialScore"),
                            type: 'checkbox',
                            checked: state.allowPartialScore,
                        },
                        quizColor: {
                            __name: Ediphy.i18n.t('Ordering.Color'),
                            type: 'custom_color_plugin',
                            value: state.quizColor || getComputedStyle(document.documentElement).getPropertyValue('--themeColor1'),
                        },
                    },
                },
                style: QUIZ_STYLE,
            },
        },
    }),
    getInitialState: () => ({
        nBoxes: 3,
        showFeedback: true,
        allowPartialScore: true,
        quizColor: 'rgba(0, 173, 156, 1)',
    }),
    getRenderTemplate: (state, props = {}) => {
        let quizColor = state.quizColor.color || 'rgba(0, 173, 156, 1)';
        let customStyle = state.quizColor.custom ? generateCustomColors(quizColor, 1, true) : null;

        const clickHandler = (index, value)=>{
            if(props.exercises?.correctAnswer instanceof Array) {
                let nBoxes = Array(state.nBoxes).fill("");
                let newAnswer = nBoxes.map((ans, ind) => (index === ind) ? value : props.exercises.correctAnswer[ind]);
                props.setCorrectAnswer(newAnswer);
            }
        };

        const isChecked = (t, i) => (props.exercises.correctAnswer?.hasOwnProperty(i) && props.exercises.correctAnswer[i] === t.toString()
            || props.exercises?.correctAnswer?.hasOwnProperty(i) && props.exercises.correctAnswer[i] === t);

        const Answer = i => {
            return (<AnswerRow key={i + 1}>
                <AnswerPlaceholder className={"col-xs-2"}>
                    <RadioInput name={props.id + "_" + i} value={"true"} checked={isChecked(true, i)}
                        onChange={()=>{clickHandler(i, "true");}} />
                    <RadioInput name={props.id + "_" + i} value={"false"} checked={isChecked(false, i)}
                        onChange={()=>{clickHandler(i, "false");}} />
                </AnswerPlaceholder>
                <div className={"col-xs-10"}>
                    <PluginPlaceholder {...props} key={i + 1}
                        pluginContainerName={i18n.t("TrueFalse.Answer") + " " + (i + 1)}
                        pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("TrueFalse.Answer") + " " + (1 + i) + '</p>' } }]}
                        pluginContainer={"Answer" + i} />
                </div>
            </AnswerRow>);
        };

        let answers = [...Array(state.nBoxes)].map((a, i) => Answer(i));

        return (
            <TrueFalsePlugin className={"exercisePlugin"} style={ state.quizColor.custom ? customStyle : null}>
                <QuestionRow className={"row"} key={-1}>
                    <PluginPlaceholder {...props} key="1"
                        pluginContainerName={i18n.t("TrueFalse.Question")}
                        pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("TrueFalse.Statement") + '</p>' } }]}
                        pluginContainer={"Question"} />
                </QuestionRow>
                <TFRow key={0}>
                    <IconCol className={"col-xs-2"}>
                        <i className="material-icons true">done</i>
                        <i className="material-icons false">clear</i>
                    </IconCol>
                </TFRow>
                {answers}
                <FeedbackRow key={-2} show={state.showFeedback}>
                    <Feedback>
                        <PluginPlaceholder {...props} key="-2"
                            pluginContainerName={i18n.t("TrueFalse.Feedback")}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("TrueFalse.FeedbackMsg") + '</p>' } }]}
                            pluginContainer={"Feedback"} />
                    </Feedback>
                </FeedbackRow>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .truefalsePlugin input[type="radio"]  {
                      background-color: transparent;
                    }
                   .truefalsePlugin input[type="radio"]:checked:after {
                      background-color: var(--themeColor1);
                    }
                  `,
                }} />
            </TrueFalsePlugin>);

    },
});
/* eslint-enable react/prop-types */

