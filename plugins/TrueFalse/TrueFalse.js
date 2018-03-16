import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import './_truefalse.scss';
import i18n from 'i18next';
import { letterFromNumber } from '../../common/common_tools';
/* eslint-disable react/prop-types */

export function TrueFalse(base) {
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
                defaultCorrectAnswer: ["", "", ""],
            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        _general: {
                            __name: "General",
                            icon: 'web',
                            buttons: {
                                nBoxes: {
                                    __name: i18n.t("TrueFalse.Number"),
                                    type: 'number',
                                    value: base.getState().nBoxes,
                                    min: 1,
                                    autoManaged: false,
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
            };
        },
        getRenderTemplate: function(state, props = {}) {
            let answers = [];
            for (let i = 0; i < state.nBoxes; i++) {
                let clickHandler = (index, value)=>{
                    if(props.exercises && props.exercises.correctAnswer && (props.exercises.correctAnswer instanceof Array)) {
                        let newAnswer = props.exercises.correctAnswer.map((ans, ind)=>{
                            if (index === ind) {
                                return value;
                            }
                            return ans;
                        });
                        props.setCorrectAnswer(newAnswer);
                    }

                };
                answers.push(<div key={i + 1} className={"row answerRow"}>
                    <div className={"col-xs-1 answerPlaceholder"}>
                        <input type="radio" className="radioQuiz" name={props.id + "_" + i} value={"true"} checked={props.exercises && props.exercises.correctAnswer[i] === "true" /* ? 'checked' : 'unchecked'*/ }
                            onChange={()=>{clickHandler(i, "true");}} /></div>
                    <div className={"col-xs-1 answerPlaceholder"}>
                        <input type="radio" className="radioQuiz" name={props.id + "_" + i} value={"false"} checked={props.exercises && props.exercises.correctAnswer[i] === "false" /* ? 'checked' : 'unchecked'*/ }
                            onChange={()=>{clickHandler(i, "false");}} />
                    </div>
                    <div className={"col-xs-10"}>
                        <PluginPlaceholder {...props} key={i + 1} plugin-data-display-name={i18n.t("TrueFalse.Answer") + " " + (i + 1)} plugin-data-default="BasicText" plugin-data-text={i18n.t("TrueFalse.Answer") + " " + (1 + i)} pluginContainer={"Answer" + i} />
                    </div>
                </div>
                );
            }
            return <div className={"exercisePlugin truefalsePlugin"}>
                <div className={"row"} key={-1}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="1" plugin-data-display-name={i18n.t("TrueFalse.Question")} plugin-data-default="BasicText" plugin-data-text={i18n.t("TrueFalse.Statement")} pluginContainer={"Question"} />
                    </div>
                </div>
                <div className={"row TFRow"} key={0}>
                    <div className={"col-xs-1 "}>T</div><div className={"col-xs-1"}>F</div><div className={"col-xs-10"} />
                </div>
                {answers}
            </div>;

        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },
    };
}
/* eslint-enable react/prop-types */

