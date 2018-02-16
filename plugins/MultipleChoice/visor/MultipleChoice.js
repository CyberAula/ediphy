import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
/* eslint-disable react/prop-types */

export function MultipleChoice() {
    return {
        getRenderTemplate: function(state, id, props) {
            let content = [];
            for (let i = 0; i < state.nBoxes; i++) {
                content.push(
                    <div className={"row"}>
                        <div className={"col-xs-2 h3"}>
                            {i + 1}
                            <input type="radio" className="radioQuiz" name={props.id} value={i} /* checked={state.__score.correctAnswer === i ? 'checked' : 'unchecked'} */ onChange={(e)=>{
                                // props.setCorrectAnswer(parseInt(e.target.value));
                            }}/>
                        </div>
                        <div className={"col-xs-10"}>
                            <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Respuesta" + (i + 1)} />
                        </div>
                    </div>);

            }

            return <div className={"exercisePlugin"}>
                <h1>Multiple Choice</h1>
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
