import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import Answer from '../../core/scorm/components/editor/Answer';
import './_multipleAnswer.scss';
/* eslint-disable react/prop-types */

export function MultipleAnswer(base) {
    return {
        getConfig: function() {
            return {
                name: 'MultipleAnswer',
                displayName: Ediphy.i18n.t('MultipleAnswer.PluginName'),
                category: 'evaluation',
                icon: 'check_box',
                initialWidth: '60%',
                flavor: 'react',
                isComplex: true,
                defaultCorrectAnswer: [],
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
            for (let i = 0; i < state.nBoxes; i++) {
                answers.push(<div key={i + 1} className={"row"}>
                    <div className={"col-xs-2 h3"}>
                        {i + 1}
                        <input type="checkbox" className="checkQuiz" name={props.id} value={i} checked={(props.exercises.correctAnswer && (props.exercises.correctAnswer instanceof Array) && props.exercises.correctAnswer.indexOf(i) > -1)} onClick={(e)=>{
                            let newCorrectAnswer = Object.assign([], props.exercises.correctAnswer);
                            let index = newCorrectAnswer.indexOf(i);
                            if (index === -1) {
                                newCorrectAnswer.push(i);
                            } else {
                                newCorrectAnswer.splice(index, 1);
                            }
                            props.setCorrectAnswer(newCorrectAnswer);
                        }}/>
                    </div>
                    <div className={"col-xs-10"}>
                        <PluginPlaceholder {...props} key={i + 1} plugin-data-display-name={"Respuesta " + (i + 1)} plugin-data-default="BasicText" pluginContainer={"Respuesta" + (i + 1)} />
                    </div>
                </div>
                );
            }
            return <div className={"exercisePlugin"} ><h1>Multiple Answer</h1>
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
