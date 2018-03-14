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
            let correct = props.exercises.correctAnswer === props.exercises.currentAnswer;
            let fs = state.fontSize + 'px';
            return <span className={"exercisePlugin inputTextPlugin" + (attempted ? " attempted " : " ") + (correct ? "correct " : "incorrect ") + (props.exercises.showFeedback ? "showFeedback" : "") }>
                <input type={state.type} disabled={attempted} style={{ fontSize: fs, lineHeight: fs }} className="inputText" name={id} value={props.exercises.currentAnswer} onChange={clickHandler}/>
                <span className="exerciseScore">{score}</span>
            </span>;
        },
        checkAnswer(current, correct) {
            // TODO Comprobar tipo
            return (current) === (correct);
        },
    };
}
/* eslint-enable react/prop-types */
