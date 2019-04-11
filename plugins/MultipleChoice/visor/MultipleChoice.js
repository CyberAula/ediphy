import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import i18n from 'i18next';
import { letterFromNumber } from '../../../common/common_tools';
import { generateCustomColors } from "../../../common/themes/theme_loader";
/* eslint-disable react/prop-types */

export function MultipleChoice() {
    return {
        getRenderTemplate: function(state, props) {
            let content = [];
            let correctAnswers = "";

            let attempted = props.exercises && props.exercises.attempted;
            let score = props.exercises.score || 0;
            score = Math.round(score * 100) / 100;
            score = (props.exercises.weight === 0) ? i18n.t("MultipleChoice.notCount") : ((score) + "/" + (props.exercises.weight));

            let showFeedback = attempted && state.showFeedback;
            let feedbackText = props.toolbars[props.boxes[props.id].sortableContainers['sc-Feedback'].children[0]].state.__text;
            let checkEmptyFeedback = !props.boxes[props.id].sortableContainers['sc-Feedback'].children ||
                props.boxes[props.id].sortableContainers['sc-Feedback'].children.length === 0 ||
                feedbackText === "<p>" + i18n.t("text_here") + "</p>" ||
                feedbackText === encodeURI("<p>" + i18n.t("text_here") + "</p>") ||
                feedbackText === encodeURI("<p>" + i18n.t("text_here") + "</p>\n") ||
                feedbackText === encodeURI('<p>' + i18n.t("MultipleChoice.FeedbackMsg") + '</p>\n') ||
                feedbackText === '<p>' + i18n.t("MultipleChoice.FeedbackMsg") + '</p>';

            let quizColor = state.quizColor.color || 'rgba(0, 173, 156, 1)';
            let customStyle = state.quizColor.custom ? generateCustomColors(quizColor, 1, true) : null;

            for (let i = 0; i < state.nBoxes; i++) {
                let correct = attempted && props.exercises.correctAnswer === i;
                let incorrect = attempted && ((props.exercises.correctAnswer !== i && props.exercises.currentAnswer === i));
                let checked = props.exercises.currentAnswer === i;
                content.push(
                    <div key={i + 1} className={"row answerRow " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : " ")}>
                        <div className={"col-xs-2 answerPlaceholder"}>
                            <div className={"answer_letter"}>{(state.letters === i18n.t("MultipleChoice.ShowLetters")) ? letterFromNumber(i) : (i + 1)}</div>
                            <input type="radio" disabled={attempted} className="radioQuiz" name={props.id}
                                value={i} checked={ checked}
                                onChange={(e)=>{
                                    props.setAnswer(parseInt(e.target.value, 10));
                                }}/>
                        </div>
                        <div className={"col-xs-10"} onClick={(e)=>{props.setAnswer(parseInt(i, 10));}}>
                            <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Answer" + i} />
                        </div>
                        {(checked && correct) ? <i className={ "material-icons correct"}>done</i> : null}
                        {(checked && incorrect) ? <i className={ "material-icons incorrect"}>clear</i> : null}
                    </div>);
                if (correct) {correctAnswers += state.letters === i18n.t("MultipleChoice.ShowLetters") ? letterFromNumber(i) : (i + 1);}
            }
            let exerciseClass = "exercisePlugin multipleChoicePlugin" + (attempted ? " attempted " : " ") + (props.exercises.showFeedback ? "showFeedback" : "");

            return <div className={ exerciseClass } style={ customStyle }>
                <div className={"row"} key={0} >
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                    </div>
                </div>
                {content}
                {checkEmptyFeedback ? null : <div className={"row feedbackRow"} key={-2} style={{ display: showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Feedback"}/>
                    </div>
                </div>}
                {attempted ? <div className="correctAnswerFeedback">
                    <span className="correctAnswerLabel"> {i18n.t("MultipleChoice.correctAnswerFeedback") }:</span> {correctAnswers}
                </div> : null}
                <div className={"exerciseScore"}>{score}</div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .multipleChoicePlugin input[type="radio"]  {
                      background-color: transparent;
                    }
                   .multipleChoicePlugin input[type="radio"]:checked:after {
                      background-color: var(--themeColor1);
                    }
                  `,
                }} />
            </div>;
        },
    };
}
/* eslint-enable react/prop-types */
