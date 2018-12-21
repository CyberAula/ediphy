import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import { letterFromNumber } from '../../../common/common_tools';
import { setRgbaAlpha } from "../../../common/common_tools";
import { correctArrayUnordered } from '../../../core/visor/correction_functions';
import i18n from "i18next";
/* eslint-disable react/prop-types */

export function MultipleAnswer() {
    return {
        getRenderTemplate: function(state, props) {
            let content = [];
            let attempted = props.exercises && props.exercises.attempted;
            let score = props.exercises.score || 0;
            score = Math.round(score * 100) / 100;
            score = (props.exercises.weight === 0) ? i18n.t("MultipleAnswer.notCount") : ((score) + "/" + (props.exercises.weight));
            let showFeedback = attempted && state.showFeedback;

            let quizColor = state.quizColor || 'rgba(0, 173, 156, 1)';
            let correctAnswers = "";

            let setAnswer = (i) => {
                let newCurrentAnswer = props.exercises.currentAnswer ? Object.assign([], props.exercises.currentAnswer) : [];
                let index = newCurrentAnswer.indexOf(i);
                if (index === -1) {
                    newCurrentAnswer.push(i);
                } else {
                    newCurrentAnswer.splice(index, 1);
                }
                props.setAnswer(newCurrentAnswer);
            };
            function removeLastChar(s) {
                if (!s || s.length === 0) {
                    return s;
                }
                return s.substring(0, s.length - 1);
            }
            for (let i = 0; i < state.nBoxes; i++) {
                let checked = (props.exercises.currentAnswer && (props.exercises.currentAnswer instanceof Array) && props.exercises.currentAnswer.indexOf(i) > -1);
                let correctAnswer = (props.exercises.correctAnswer && (props.exercises.correctAnswer instanceof Array) && props.exercises.correctAnswer.indexOf(i) > -1);
                let correct = attempted && ((correctAnswer && checked) || (!correctAnswer && !checked));
                let incorrect = attempted && ((!correctAnswer && checked) || (correctAnswer && !checked));
                content.push(
                    <div key={i + 1} className={"row answerRow " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : "")}>
                        <div className={"col-xs-2 answerPlaceholder"}>
                            <div className={"answer_letter"} style={{ backgroundColor: quizColor }}>{(state.letters === i18n.t("MultipleChoice.ShowLetters")) ? letterFromNumber(i) : (i + 1)}</div>
                            <input type="checkbox" disabled={attempted} className="checkQuiz" name={props.id} value={i} checked={checked} onClick={(e)=>{
                                // props.setAnswer(e.target.value);
                                setAnswer(i);
                            }}/>
                        </div>
                        <div className={"col-xs-10"} onClick={(e)=>{setAnswer(i);}}>
                            <VisorPluginPlaceholder {...props} key={i } pluginContainer={"Answer" + (i)} />
                        </div>
                        {/* <i className={ "material-icons " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : " ")} style={{ display: (correct || incorrect) ? "block" : "none" }}>{(correct ? "done " : "clear")}</i>*/}
                        {(correct) ? <i className={ "material-icons correct"}>done</i> : null}
                        {(incorrect) ? <i className={ "material-icons incorrect"}>clear</i> : null}
                    </div>);

                if (correctAnswer) {
                    correctAnswers += (state.letters === i18n.t("MultipleChoice.ShowLetters") ? letterFromNumber(i) : (i + 1)) + ", ";
                }

            }
            if (!props.exercises.correctAnswer || props.exercises.correctAnswer.length === 0) {
                correctAnswers += i18n.t("MultipleAnswer.None") + ".";
            } else {
                correctAnswers = removeLastChar(removeLastChar(correctAnswers)) + ".";
            }
            let checkEmptyFeedback = !props.boxes[props.id].sortableContainers['sc-Feedback'].children ||
                props.boxes[props.id].sortableContainers['sc-Feedback'].children.length === 0 ||
                props.toolbars[props.boxes[props.id].sortableContainers['sc-Feedback'].children[0]].state.__text === "<p>" + i18n.t("text_here") + "</p>" ||
                props.toolbars[props.boxes[props.id].sortableContainers['sc-Feedback'].children[0]].state.__text === encodeURI("<p>" + i18n.t("text_here") + "</p>") ||
                props.toolbars[props.boxes[props.id].sortableContainers['sc-Feedback'].children[0]].state.__text === encodeURI("<p>" + i18n.t("text_here") + "</p>\n") ||
                props.toolbars[props.boxes[props.id].sortableContainers['sc-Feedback'].children[0]].state.__text === encodeURI('<p>' + i18n.t("MultipleAnswer.FeedbackMsg") + '</p>\n') ||
                props.toolbars[props.boxes[props.id].sortableContainers['sc-Feedback'].children[0]].state.__text === '<p>' + i18n.t("MultipleAnswer.FeedbackMsg") + '</p>';

            return <div className={"exercisePlugin multipleAnswerPlugin" + (attempted ? " attempted " : " ") + (props.exercises.showFeedback ? "showFeedback" : "")}>{/* <h1>Multiple Answer</h1>*/}
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                    </div>

                </div>
                {content}
                {checkEmptyFeedback ? null : <div className={"row feedbackRow"} key={-2} style={{ display: showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"} style={{ color: quizColor, borderColor: quizColor, backgroundColor: setRgbaAlpha(quizColor, 0.15) }}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Feedback"}/>
                    </div>
                </div> }
                {attempted ? <div className="correctAnswerFeedback" style={{ color: quizColor }}>
                    <span className="correctAnswerLabel"> {i18n.t("MultipleAnswer.correctAnswerFeedback") }:</span> {correctAnswers}
                </div> : null}
                <div key={-1} className={"exerciseScore"} style={{ color: quizColor }}>{score}</div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                   .multipleAnswerPlugin .checkQuiz:checked:after {
                      color: ${quizColor};
                    }
                  `,
                }} />
            </div>;
        },
        /* checkAnswer(current, correct, state) {
            return correctArrayUnordered(current, correct, state.allowPartialScore, state.nBoxes);
        },*/
    };
}
/* eslint-enable react/prop-types */
