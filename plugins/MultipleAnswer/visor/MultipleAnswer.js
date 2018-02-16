import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
/* eslint-disable react/prop-types */

export function MultipleAnswer() {
    return {
        getRenderTemplate: function(state, id, props) {
            let content = [];
            for (let i = 0; i < state.nBoxes; i++) {
                content.push(
                    <div className={"row"}>
                        <div className={"col-xs-2 h3"}>
                            {i + 1}
                            <input type="checkbox" className="checkQuiz" name={props.id} value={i} checked={ (props.exercises.currentAnswer && props.exercises.currentAnswer.indexOf(i) > -1)} onClick={(e)=>{
                                props.setAnswer(e.target.value);
                                console.log(props.exercises);
                                let newCurrentAnswer = props.exercises.currentAnswer ? Object.assign([], props.exercises.currentAnswer) : [];
                                console.log('handler', newCurrentAnswer, props.exercises.currentAnswer);
                                let index = newCurrentAnswer.indexOf(i);
                                if (index === -1) {
                                    newCurrentAnswer.push(i);
                                } else {
                                    newCurrentAnswer.splice(index, 1);
                                }
                                props.setAnswer(newCurrentAnswer);
                            }}/>
                        </div>
                        <div className={"col-xs-10"}>
                            <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Respuesta" + (i + 1)} />
                        </div>
                    </div>);

            }

            return <div className={"exercisePlugin"}><h1>Multiple Answer</h1>
                <div className={"row"}>
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Pregunta"}/>
                    </div>
                    {content}
                </div>
            </div>;
        },
    };
}
/* eslint-enable react/prop-types */
