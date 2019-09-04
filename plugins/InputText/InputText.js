import React from 'react';
import './_inputText.scss';
import i18n from 'i18next';

/* eslint-disable react/prop-types */

export function InputText() {
    return {
        getConfig: function() {
            return {
                name: 'InputText',
                displayName: Ediphy.i18n.t('InputText.PluginName'),
                category: 'evaluation',
                icon: 'space_bar',
                initialWidth: 'auto',
                flavor: 'react',
                isComplex: true,
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
                                type: {
                                    __name: i18n.t("InputText.answerType"),
                                    type: 'radio',
                                    value: state.type,
                                    options: ['text', 'number'],
                                    labels: [i18n.t("InputText.text"), i18n.t("InputText.number")],
                                },
                                precision: {
                                    __name: i18n.t("InputText.Precision"),
                                    type: 'number',
                                    step: 0.01,
                                    hide: state.type !== "number",
                                    value: state.precision,
                                },
                                characters: {
                                    __name: i18n.t("InputText.Characters"),
                                    type: 'checkbox',
                                    hide: state.type !== "text",
                                    checked: state.characters,
                                },
                                fontSize: {
                                    __name: i18n.t("InputText.fontSize"),
                                    type: 'range',
                                    value: state.fontSize,
                                    min: 8,
                                    max: 72,
                                    step: 1,
                                },

                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                type: 'text',
                fontSize: 14,
                precision: 0.01,
                characters: true,
            };
        },
        getRenderTemplate: function(state, props = {}) {
            let clickHandler = (e)=>{
                props.setCorrectAnswer(e.target.value);
            };
            let fs = state.fontSize / 14 + 'em';
            return <div className={"exercisePlugin inputTextPlugin"} >
                <input placeholder={i18n.t("InputText.Placeholder")} type={state.type} style={{ fontSize: fs }} className="inputText" name={props.id} value={props.exercises.correctAnswer} onChange={clickHandler}/>
                <div className="dragHandleInputPlugin" style={{ fontSize: fs }}><i className="material-icons">reorder</i></div>
            </div>;

        },
    };
}
/* eslint-enable react/prop-types */
