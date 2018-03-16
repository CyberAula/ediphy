import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import i18n from 'i18next';
import { letterFromNumber } from '../../../common/common_tools';
/* eslint-disable react/prop-types */

export function TrueFalse() {
    return {
        getRenderTemplate: function(state, id, props) {
            let content = [];
            let attempted = props.exercises && props.exercises.attempted;
            let score = (props.exercises.score || 0) + "/" + (props.exercises.weight || 0);

            for (let i = 0; i < state.nBoxes; i++) {
                let correct = attempted && props.exercises.correctAnswer[i] === props.exercises.currentAnswer[i];
                let incorrect = attempted && !correct;
                let clickHandler = (index, value)=>{
                    if(props.exercises && props.exercises.currentAnswer && (props.exercises.currentAnswer instanceof Array)) {
                        let newAnswer = props.exercises.currentAnswer.map((ans, ind)=>{
                            if (index === ind) {
                                return value;
                            }
                            return ans;
                        });
                        props.setAnswer(newAnswer);
                    }

                };
                content.push(
                    <div key={i + 1} className={"row answerRow " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : "")}>
                        <div className={"col-xs-1 answerPlaceholder"}>
                            <input type="radio" disabled={attempted} className="radioQuiz" name={props.id + '_' + i}
                                value={i} checked={ props.exercises && props.exercises.currentAnswer[i] === "true" }
                                onChange={(e)=>{ clickHandler(i, "true"); }}/>
                        </div>
                        <div className={"col-xs-1 answerPlaceholder"}>
                            <input type="radio" disabled={attempted} className="radioQuiz" name={props.id + '_' + i}
                                value={i} checked={props.exercises && props.exercises.currentAnswer[i] === "false"}
                                onChange={(e)=>{ clickHandler(i, "false"); }}/>
                        </div>
                        <div className={"col-xs-10"}>
                            <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Answer" + i} />
                        </div>
                    </div>);

            }

            return <div className={"exercisePlugin truefalsePlugin" + (attempted ? " attempted " : " ") + (props.exercises.showFeedback ? "showFeedback" : "")}>
                <div className={"row"} key={0} >
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                    </div>

                </div>
                <div className={"row TFRow"} key={0}>
                    <div className={"col-xs-1 "}>T</div><div className={"col-xs-1"}>F</div><div className={"col-xs-10"} />
                </div>
                {content}
                <div className={"exerciseScore"}>{score}</div>
            </div>;
        },
        checkAnswer(current, correct) {
            let total = current.length || 1;
            let score = 0;
            for (let q in current) {
                if (current[q] === correct[q]) {
                    score += 1;
                }
            }
            return (score / total);
        },
    };
}
/* eslint-enable react/prop-types */
