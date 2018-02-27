import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import './_multipleChoice.scss';
import i18n from 'i18next';
/* eslint-disable react/prop-types */

export function MultipleChoice(base) {
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
                defaultCorrectAnswer: false,
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
                                    __name: i18n.t("MultipleChoice.Number"),
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
            console.log(base.getState(), state);
            for (let i = 0; i < state.nBoxes; i++) {
                let clickHandler = (e)=>{
                    props.setCorrectAnswer(parseInt(e.target.value, 10));
                };
                answers.push(<div key={i + 1} className={"row answerRow"}>
                    <div className={"col-xs-2 answerPlaceholder"}>
                        {i + 1}
                        <input type="radio" className="radioQuiz" name={props.id} value={i} checked={props.exercises.correctAnswer === i /* ? 'checked' : 'unchecked'*/ }
                            onChange={clickHandler} />
                    </div>
                    <div className={"col-xs-10"}>
                        <PluginPlaceholder {...props} key={i + 1} plugin-data-display-name={i18n.t("MultipleChoice.Answer") + " " + (i + 1)} plugin-data-default="BasicText" plugin-data-text={i18n.t("MultipleChoice.Answer") + " " + (1 + i)} pluginContainer={"Answer" + i} />
                    </div>
                </div>
                );
            }
            return <div className={"exercisePlugin multipleChoicePlugin"}>
                {/* <h1>Multiple Choice</h1>*/}
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="1" plugin-data-display-name={i18n.t("MultipleChoice.Question")} plugin-data-default="BasicText" plugin-data-text={i18n.t("MultipleChoice.Statement")} pluginContainer={"Question"} />
                    </div>
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
