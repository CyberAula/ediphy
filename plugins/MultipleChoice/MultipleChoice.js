import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import Answer from '../../core/scorm/components/editor/Answer';
import './_multipleChoice.scss';
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
                defaultCorrectAnswer: 1,
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
                                    __name: "Número de cajas",
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
            console.log(state.__score.correctAnswer);
            for (let i = 0; i < state.nBoxes; i++) {
                let clickHandler = (e)=>{
                    props.setCorrectAnswer(parseInt(e.target.value, 10));
                };
                answers.push(<div key={i + 1} className={"row"}>
                    <div className={"col-xs-2 h3"}>
                        {i + 1}
                        <input type="radio" className="radioQuiz" name={props.id} value={i} checked={props.exercises.correctAnswer === i ? 'checked' : 'unchecked'}
                            onChange={clickHandler} onClick={clickHandler} />
                    </div>
                    <div className={"col-xs-10"}>
                        <PluginPlaceholder {...props} key={i + 1} plugin-data-display-name={"Respuesta " + (i + 1)} plugin-data-default="BasicText" pluginContainer={"Respuesta" + (i + 1)} />
                    </div>
                </div>
                );
            }
            return <div className={"exercisePlugin"}><h1>Multiple Choice</h1>
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="1" plugin-data-display-name={"Pregunta"} plugin-data-default="BasicText" pluginContainer={"Pregunta"} />
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
