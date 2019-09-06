import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/pluginPlaceholder/PluginPlaceholder';
import './_truefalse.scss';
import i18n from 'i18next';
import { generateCustomColors } from "../../common/themes/themeLoader";
/* eslint-disable react/prop-types */

export function TrueFalse() {
    return {
        getConfig: function() {
            return {
                name: 'TrueFalse',
                displayName: Ediphy.i18n.t('TrueFalse.PluginName'),
                category: 'evaluation',
                icon: 'check_circle',
                initialWidth: '60%',
                flavor: 'react',
                isComplex: true,
                defaultCorrectAnswer: ["false", "false", "false"],
                defaultCurrentAnswer: ["", "", ""],
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
                allowPartialScore: true,
                quizColor: 'rgba(0, 173, 156, 1)',
            };
        },
        getRenderTemplate: function(state, props = {}) {
            let answers = [];
            let quizColor = state.quizColor.color;
            let customStyle = state.quizColor.custom ? generateCustomColors(quizColor, 1, true) : null;

            for (let i = 0; i < state.nBoxes; i++) {
                let clickHandler = (index, value)=>{
                    if(props.exercises && props.exercises.correctAnswer && (props.exercises.correctAnswer instanceof Array)) {
                        let nBoxes = Array(state.nBoxes).fill("");
                        let newAnswer = nBoxes.map((ans, ind)=>{
                            if (index === ind) {
                                return value;
                            }
                            return props.exercises.correctAnswer[ind];
                        });
                        props.setCorrectAnswer(newAnswer);
                    }

                };
                answers.push(<div key={i + 1} className={"row answerRow"}>
                    <div className={"col-xs-2 answerPlaceholder"}>
                        <input type="radio" className="radioQuiz" name={props.id + "_" + i} value={"true"} checked={props.exercises && props.exercises.correctAnswer[i] === "true" || props.exercises && props.exercises.correctAnswer[i] === true}
                            onChange={()=>{clickHandler(i, "true");}} />
                        <input type="radio" className="radioQuiz" name={props.id + "_" + i} value={"false"} checked={props.exercises && props.exercises.correctAnswer[i] === "false" || props.exercises && props.exercises.correctAnswer[i] === false}
                            onChange={()=>{clickHandler(i, "false");}} />
                    </div>
                    <div className={"col-xs-10"}>
                        <PluginPlaceholder {...props} key={i + 1}
                            pluginContainerName={i18n.t("TrueFalse.Answer") + " " + (i + 1)}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("TrueFalse.Answer") + " " + (1 + i) + '</p>' } }]}
                            pluginContainer={"Answer" + i} />
                    </div>
                </div>
                );
            }
            return <div className={"exercisePlugin truefalsePlugin"} style={ state.quizColor.custom ? customStyle : null}>
                <div className={"row"} key={-1}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="1"
                            pluginContainerName={i18n.t("TrueFalse.Question")}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("TrueFalse.Statement") + '</p>' } }]}
                            pluginContainer={"Question"} />
                    </div>
                </div>
                <div className={"row TFRow"} key={0}>
                    <div className={"col-xs-2 iconCol"}>
                        <i className="material-icons true">done</i>
                        <i className="material-icons false">clear</i>
                    </div>
                    <div className={"col-xs-10"} /></div>
                {answers}
                <div className={"row feedbackRow"} key={-2} style={{ display: state.showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"}>
                        <PluginPlaceholder {...props} key="-2"
                            pluginContainerName={i18n.t("TrueFalse.Feedback")}
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("TrueFalse.FeedbackMsg") + '</p>' } }/* , {plugin: 'HotspotImages', initialState:{url: 'nooo'}}*/]}
                            pluginContainer={"Feedback"} />
                    </div>
                </div>
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
            </div>;

        },
    };
}
/* eslint-enable react/prop-types */

