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
                            __name: "General",
                            icon: 'web',
                            buttons: {
                                type: {
                                    __name: i18n.t("InputText.answerType"),
                                    type: 'select',
                                    value: state.type,
                                    options: ['text', 'number', 'color', 'datetime-local'],
                                    autoManaged: false,
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
            };
        },
        getRenderTemplate: function(state, props = {}) {
            let clickHandler = (e)=>{
                props.setCorrectAnswer(e.target.value);
            };
            let fs = state.fontSize + 'px';
            return <span className={"exercisePlugin inputTextPlugin"}>
                <input type={state.type} style={{ fontSize: fs, lineHeight: fs }} className="inputText" name={props.id} value={props.exercises.correctAnswer} onChange={clickHandler}/>
                <span className="dragHandleInputPlugin"><i className="material-icons">apps</i></span>
            </span>;

        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },
    };
}
/* eslint-enable react/prop-types */
