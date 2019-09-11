import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/pluginPlaceholder/PluginPlaceholder';
import './_ordering.scss';
import i18n from 'i18next';
import { letterFromNumber } from '../../common/commonTools';
import { generateCustomColors } from "../../common/themes/themeLoader";
import { QUIZ_CONFIG, QUIZ_STYLE } from "../../common/quizzes";
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
        let answers = [];

        let quizColor = state.quizColor.color;
        let customStyle = state.quizColor.custom ? generateCustomColors(quizColor, 1, true) : null;

        for (let i = 0; i < state.nBoxes; i++) {
            let isCorrect = props.exercises.correctAnswer === i;
            answers.push(<div key={i + 1} className={"row answerRow"} >
                <div className={"col-xs-2 answerPlaceholder"} >
                    <div className={"answer_letter"}>{ (i + 1)}</div>
                </div>
                <div className={"col-xs-10"} >
                    <PluginPlaceholder {...props} key={i + 1}
                        pluginContainerName={i18n.t("Ordering.Answer") + " " + (i + 1)}
                        pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("Ordering.Answer") + " " + (1 + i) + '</p>' } }]}
                        pluginContainer={"Answer" + i} />
                </div>
            </div>
            );
            if (isCorrect) {correctAnswers += state.letters === i18n.t("Ordering.ShowLetters") ? letterFromNumber(i) : (i + 1);}
        }
        return <div className={"exercisePlugin orderingPlugin"} style={ state.quizColor.custom ? customStyle : null }>
            <div className={"row"} key={0}>
                <div className={"col-xs-12"}>
                    <PluginPlaceholder {...props} key="1"
                        pluginContainerName={i18n.t("Ordering.Question")}
                        pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("Ordering.Statement") + '</p>' } }]}
                        pluginContainer={"Question"} />
                </div>
            </div>
            {answers}
            <div className={"row feedbackRow"} key={-2} style={{ display: state.showFeedback ? 'block' : 'none' }}>
                <div className={"col-xs-12 feedback"}>
                    <PluginPlaceholder {...props} key="-2"
                        pluginContainerName={i18n.t("Ordering.Feedback")}
                        pluginContainer={"Feedback"}
                        pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("Ordering.FeedbackMsg") + '</p>' } }/* , {plugin: 'HotspotImages', initialState:{url: 'nooo'}}*/]}
                    />
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                    .orderingPlugin input[type="radio"]  {
                      background-color: transparent;
                    }
                   .orderingPlugin input[type="radio"]:checked:after {
                      background-color: var(--themeColor1);
                    }
                  `,
            }} />
        </div>;

    },
});
/* eslint-enable react/prop-types */

