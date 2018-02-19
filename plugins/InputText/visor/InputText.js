import React from 'react';
/* eslint-disable react/prop-types */

export function InputText() {
    return {
        getRenderTemplate: function(state, id, props) {
            let clickHandler = (e)=>{
                props.setAnswer(e.target.value);
            };
            let attempted = props.exercises && props.exercises.attempted;
            let score = (props.exercises.score || 0) + "/" + (props.exercises.weight || 0);

            return <span className={"exercisePlugin inputTextPlugin" + (attempted ? " attempted" : "")}>
                <input type={state.type} disabled={attempted} className="inputText" name={id} value={props.exercises.currentAnswer} onChange={clickHandler}/>
                <span className="exerciseScore">{score}</span>
            </span>;
        },
    };
}
/* eslint-enable react/prop-types */
