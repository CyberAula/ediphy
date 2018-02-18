import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
/* eslint-disable react/prop-types */

export function InputText() {
    return {
        getRenderTemplate: function(state, id, props) {
            let clickHandler = (e)=>{
                props.setAnswer(e.target.value);
            };
            return <span className={"exercisePlugin"}>
                <input type={state.type} className="inputText" name={id} value={props.exercises.currentAnswer} onChange={clickHandler}/>
            </span>;
        },
    };
}
/* eslint-enable react/prop-types */
