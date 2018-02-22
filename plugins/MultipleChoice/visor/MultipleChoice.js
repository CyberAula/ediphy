import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import i18n from 'i18next';
/* eslint-disable react/prop-types */

export function MultipleChoice() {
    return {
        getRenderTemplate: function(state, id, props) {
            let content = [];
            let attempted = props.exercises && props.exercises.attempted;
            let score = (props.exercises.score || 0) + "/" + (props.exercises.weight || 0);

            for (let i = 0; i < state.nBoxes; i++) {
                let correct = attempted && props.exercises.correctAnswer === i; // && props.exercises.currentAnswer === i ;
                let incorrect = attempted && (/* (props.exercises.correctAnswer === i && props.exercises.currentAnswer !== i)||*/(props.exercises.correctAnswer !== i && props.exercises.currentAnswer === i));
                let checked = props.exercises.currentAnswer === i; //  (attempted && props.exercises.correctAnswer === i) || (!attempted && props.exercises.currentAnswer === i)
                content.push(
                    <div className={"row answerRow " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : "")}>
                        <div className={"col-xs-2 answerPlaceholder"}>
                            {i + 1}
                            <input type="radio" disabled={attempted} className="radioQuiz" name={props.id}
                                value={i} checked={ checked}
                                onChange={(e)=>{
                                    props.setAnswer(parseInt(e.target.value, 10));
                                }}/>
                        </div>
                        <div className={"col-xs-10"}>
                            <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Answer" + i} />
                        </div>
                    </div>);

            }

            return <div className={"exercisePlugin multipleChoicePlugin" + (attempted ? " attempted " : " ") + (props.exercises.showFeedback ? "showFeedback" : "")}>
                {/* <h1>Multiple Choice</h1>*/}
                <div className={"row"}>
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                    </div>

                </div>
                {content}
                <div className={"exerciseScore"}>{score}</div>
            </div>;
        },
        checkAnswer(current, correct) {
            return (current) === (correct);
        },
    };
}
/* eslint-enable react/prop-types */
