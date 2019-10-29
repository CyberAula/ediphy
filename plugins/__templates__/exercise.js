export const exerciseTemplate = options => `
import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/pluginPlaceholder/PluginPlaceholder';
import i18n from 'i18next';
import { letterFromNumber } from '../../common/commonTools';
import { generateCustomColors } from "../../common/themes/themeLoader";
import { QUIZ_CONFIG, QUIZ_STYLE } from "../../common/quizzes";
import {
    CorrectAnswerFeedback,
    CorrectAnswerLabel,
    Feedback,
    FeedbackRow,
    QuestionRow,
    RadioStyleDangerous,
} from "../../sass/exercises";
import {
    AnswerInput,
    AnswerLetter,
    AnswerRow,
    AnswerText,
    ${options.name}Plugin,
    RadioInput,
} from "./Styles";

/* eslint-disable react/prop-types */

export const ${options.name} = () => ({
    getConfig: () => ({
        ...QUIZ_CONFIG,
        name: '${options.name}',
        displayName: Ediphy.i18n.t('${options.name}.PluginName'),
        icon: 'school',
        defaultCorrectAnswer: 0,
        defaultCurrentAnswer: false,
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
                            __name: i18n.t("${options.name}.Number"),
                            type: 'number',
                            value: state.nBoxes,
                            max: 10,
                            min: 1,
                        },
                        showFeedback: {
                            __name: i18n.t("${options.name}.ShowFeedback"),
                            type: 'checkbox',
                            checked: state.showFeedback,
                        },
                        letters: {
                            __name: i18n.t("${options.name}.ShowLettersInsteadOfNumbers"),
                            type: 'radio',
                            value: state.letters,
                            options: [i18n.t("${options.name}.ShowLetters"), i18n.t("${options.name}.ShowNumbers")],
                        },

                        quizColor: {
                            __name: Ediphy.i18n.t('${options.name}.Color'),
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
        letters: i18n.t("${options.name}.ShowLetters"),
        quizColor: { color: document.documentElement.style.getPropertyValue('--themeColor1'), custom: false },
    }),
    getRenderTemplate: (state, props = {}) => {
        let correctAnswers = "";
        let quizColor = state.quizColor.color;
        let customColor = generateCustomColors(quizColor, 1, true);
        let customStyle = { ...customColor };

        const clickHandler = e => props.setCorrectAnswer(parseInt(e.target.value, 10));
        const isCorrect = i => props.exercises.correctAnswer === i;

        const Answer = i => (
            <AnswerRow key={i + 1} className={"row answerRow"}>
                <AnswerInput>
                    <AnswerLetter>{(state.letters === i18n.t("${options.name}.ShowLetters")) ? letterFromNumber(i) : (i + 1)}</AnswerLetter>
                    <RadioInput name={props.id} value={i} checked={isCorrect(i)}
                        onChange={clickHandler} />
                </AnswerInput>
                <AnswerText>
                    <PluginPlaceholder {...props} key={i + 1}
                        pluginContainerName={i18n.t("${options.name}.Answer") + " " + (i + 1)}
                        pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("${options.name}.Answer") + " " + (1 + i) + '</p>' } }]}
                        pluginContainer={"Answer" + i} />
                </AnswerText>
            </AnswerRow>
        );

        const answers = [...Array(state.nBoxes)].map((a, i) => {
            if (isCorrect(i)) {correctAnswers += state.letters === i18n.t("${options.name}.ShowLetters") ? letterFromNumber(i) : (i + 1);}
            return Answer(i);
        });

        return (
            <${options.name}Plugin className="${options.camelCaseName}" style={customStyle}>
                <QuestionRow key={0}>
                    <PluginPlaceholder {...props} key="1"
                        pluginContainerName={i18n.t("${options.name}.Question")}
                        pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("${options.name}.Statement") + '</p>' } }]}
                        pluginContainer={"Question"}/>
                </QuestionRow>
                {answers}
                <FeedbackRow show={state.showFeedback} key={-2}>
                    <Feedback>
                        <PluginPlaceholder {...props} key="-2"
                            pluginContainerName={i18n.t("${options.name}.Feedback")}
                            pluginContainer={"Feedback"}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("${options.name}.FeedbackMsg") + '</p>' } }]}
                        />
                    </Feedback>
                </FeedbackRow>
                <CorrectAnswerFeedback>
                    <CorrectAnswerLabel className="correctAnswerLabel"> {i18n.t("${options.name}.correctAnswerFeedback") }:</CorrectAnswerLabel> {correctAnswers}
                </CorrectAnswerFeedback>
                <style dangerouslySetInnerHTML={{
                    __html: RadioStyleDangerous('${options.camelCaseName}'),
                }}/>
            </${options.name}Plugin>);
    },
});
/* eslint-enable react/prop-types */
`;
