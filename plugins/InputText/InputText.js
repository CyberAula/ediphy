import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import './_inputText.scss';
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
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        _general: {
                            __name: "General",
                            icon: 'web',
                            buttons: {
                                type: {
                                    __name: "Tipo de respuesta",
                                    type: 'select',
                                    value: base.getState().type,
                                    options: ['text', 'number', 'color', 'datetime-local'],
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
            };
        },
        getRenderTemplate: function(state, props = {}) {
            let clickHandler = (e)=>{
                props.setCorrectAnswer(e.target.value);
            };
            return <span className={"exercisePlugin inputTextPlugin"}>
                <input type={state.type} className="inputText" name={props.id} value={props.exercises.correctAnswer} onChange={clickHandler}/>
                <span className="dragHandleInputPlugin"><i className="material-icons">apps</i></span>
            </span>;

        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },
    };
}
/* eslint-enable react/prop-types */
