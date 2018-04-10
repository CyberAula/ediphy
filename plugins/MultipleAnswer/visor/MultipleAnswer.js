import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import { arrayContainsArray } from '../../../common/utils';
import { letterFromNumber } from '../../../common/common_tools';
/* eslint-disable react/prop-types */

export function MultipleAnswer() {
    return {
        getRenderTemplate: function(state, props) {
            let content = [];
            let attempted = props.exercises && props.exercises.attempted;
            let score = (props.exercises.score || 0) + "/" + (props.exercises.weight || 0);
            let showFeedback = attempted && state.showFeedback;
            for (let i = 0; i < state.nBoxes; i++) {
                let checked = (props.exercises.currentAnswer && (props.exercises.currentAnswer instanceof Array) && props.exercises.currentAnswer.indexOf(i) > -1);
                let correctAnswer = (props.exercises.correctAnswer && (props.exercises.correctAnswer instanceof Array) && props.exercises.correctAnswer.indexOf(i) > -1);
                let correct = attempted && correctAnswer;
                let incorrect = attempted && !correctAnswer && checked;
                content.push(
                    <div key={i + 1} className={"row answerRow " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : "")}>
                        <div className={"col-xs-2 answerPlaceholder"}>
                            <div className={"answer_letter"} >{state.letters ? letterFromNumber(i) : (i + 1)}</div>
                            <input type="checkbox" disabled={attempted} className="checkQuiz" name={props.id} value={i} checked={checked} onClick={(e)=>{
                                props.setAnswer(e.target.value);
                                let newCurrentAnswer = props.exercises.currentAnswer ? Object.assign([], props.exercises.currentAnswer) : [];
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
                            <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Answer" + (i + 1)} />
                        </div>
                        <i className={ "material-icons " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : " ")} style={{ display: (correct || incorrect) ? "block" : "none" }}>{(correct ? "done " : "clear")}</i>
                    </div>);

            }

            return <div className={"exercisePlugin multipleAnswerPlugin" + (attempted ? " attempted " : " ") + (props.exercises.showFeedback ? "showFeedback" : "")}>{/* <h1>Multiple Answer</h1>*/}
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                    </div>

                </div>
                {content}
                <div className={"row feedbackRow"} key={-2} style={{ display: showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Feedback"}/>
                    </div>
                </div>
                <div key={-1} className={"exerciseScore"}>{score}</div>
            </div>;
        },
        checkAnswer(current, correct, state) {
            let correctSanitized = correct.filter((c)=>{
                return (c < state.nBoxes);
            });
            if(Array.isArray(current) && Array.isArray(correctSanitized)) {
                return (arrayContainsArray(correctSanitized, current) && (current.length === correctSanitized.length)) || (current.length === 0 && correctSanitized.length === 0);
            }
            return false;
        },
    };
}
/* eslint-enable react/prop-types */
