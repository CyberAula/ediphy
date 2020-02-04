import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/pluginPlaceholder/PluginPlaceholder';
import i18n from 'i18next';
import { letterFromNumber } from '../../common/commonTools';
import { generateCustomColors } from "../../common/themes/themeLoader";
import { QUIZ_CONFIG, QUIZ_STYLE } from "../../common/quizzes";
import { OrderingPlugin, AnswerLetter, AnswerRow, AnswerPlaceholder, AnswerText } from "./Styles";
import { Feedback, FeedbackRow, QuestionRow } from "../../sass/exercises";
import { PRIMARY_BLUE } from "../../sass/general/constants";
/* eslint-disable react/prop-types */

export const Ordering = () => ({
    getConfig: () => ({
        ...QUIZ_CONFIG,
        name: 'Ordering',
        displayName: Ediphy.i18n.t('Ordering.PluginName'),
        icon: 'format_list_numbered',
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
                            __name: i18n.t("Ordering.Number"),
                            type: 'number',
                            value: state.nBoxes,
                            max: 10,
                            min: 1,
                        },
                        showFeedback: {
                            __name: i18n.t("Ordering.ShowFeedback"),
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
        quizColor: 'rgba(0, 173, 156, 1)',
        allowPartialScore: false,
    }),
    getRenderTemplate: (state, props = {}) => {
        // eslint-disable-next-line no-unused-vars
        let correctAnswers = "";
        let quizColor = state.quizColor.color || PRIMARY_BLUE;
        let customStyle = state.quizColor.custom ? generateCustomColors(quizColor, 1, true) : null;
        const showLetters = state.letters === i18n.t("Ordering.ShowLetters");
        const Answer = i => (
            <AnswerRow key={i + 1}>
                <AnswerPlaceholder>
                    <AnswerLetter>{ (i + 1)}</AnswerLetter>
                </AnswerPlaceholder>
                <AnswerText>
                    <PluginPlaceholder {...props} key={i + 1}
                        pluginContainerName={i18n.t("Ordering.Answer") + " " + (i + 1)}
                        pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("Ordering.Answer") + " " + (1 + i) + '</p>' } }]}
                        pluginContainer={"Answer" + i} />
                </AnswerText>
            </AnswerRow>
        );

        const answers = [...Array(state.nBoxes)].map((a, i) => {
            const isCorrect = props.exercises.correctAnswer === i;
            if (isCorrect) {correctAnswers += showLetters ? letterFromNumber(i) : (i + 1);}
            return Answer(i);
        });

        return (
            <OrderingPlugin className={"orderingPlugin"} style={customStyle}>
                <QuestionRow>
                    <PluginPlaceholder {...props} key="1"
                        pluginContainerName={i18n.t("Ordering.Question")}
                        pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("Ordering.Statement") + '</p>' } }]}
                        pluginContainer={"Question"} />
                </QuestionRow>
                {answers}
                <FeedbackRow show={state.showFeedback} key={-2}>
                    <Feedback>
                        <PluginPlaceholder {...props} key="-2"
                            pluginContainerName={i18n.t("Ordering.Feedback")}
                            pluginContainer={"Feedback"}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("Ordering.FeedbackMsg") + '</p>' } }/* , {plugin: 'HotspotImages', initialState:{url: 'nooo'}}*/]}
                        />
                    </Feedback>
                </FeedbackRow>
            </OrderingPlugin>
        );
    },
});
/* eslint-enable react/prop-types */

