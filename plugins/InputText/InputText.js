import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import './_inputText.scss';
import i18n from 'i18next';

/* eslint-disable react/prop-types */

export function InputText(base) {
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
                        _general: {
                            __name: i18n.t("InputText.General"),
                            icon: 'web',
                            buttons: {
                                type: {
                                    __name: i18n.t("InputText.answerType"),
                                    type: 'select',
                                    value: state.type,
                                    options: ['text', 'number'],
                                    autoManaged: false,
                                },
                                precision: {
                                    __name: i18n.t("InputText.Precision"),
                                    type: 'number',
                                    step: 0.01,
                                    autoManaged: false,
                                    hide: state.type !== "number",
                                    value: state.precision,
                                },
                                characters: {
                                    __name: i18n.t("InputText.Characters"),
                                    type: 'checkbox',
                                    autoManaged: false,
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
            let fs = state.fontSize + 'px';
            return <div className={"exercisePlugin inputTextPlugin"} >
                <input type={state.type} style={{ fontSize: fs, lineHeight: fs, height: fs }} className="inputText" name={props.id} value={props.exercises.correctAnswer} onChange={clickHandler}/>
                <div className="dragHandleInputPlugin" style={{ lineHeight: fs, height: fs, width: fs }}><i className="material-icons">reorder</i></div>
            </div>;

        },
    };
}
/* eslint-enable react/prop-types */
