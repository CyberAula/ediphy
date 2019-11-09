import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import { letterFromNumber } from '../../../common/commonTools';
import { generateCustomColors } from "../../../common/themes/themeLoader";
import i18n from "i18next";
import { checkFeedback, getScore, removeLastChar } from "../../../common/utils";
import {
    CheckBoxStyleDangerous,
    CorrectAnswerFeedback,
    CorrectAnswerLabel,
    ExerciseScore, Feedback, FeedbackRow, QuestionRow,
} from "../../../sass/exercises";
import { AnswerInput, AnswerLetter, AnswerRow, AnswerText, CheckboxInput, MultipleAnswerPlugin } from "../Styles";
/* eslint-disable react/prop-types */

export function MultipleAnswer() {
    return {
        getRenderTemplate: function(state, props) {
            let correctAnswers = "";
            const attempted = props.exercises && props.exercises.attempted;
            const score = getScore('MultipleAnswer', props);
            const showFeedback = attempted && state.showFeedback;
            const checkEmptyFeedback = checkFeedback('MultipleAnswer', props);
            const quizColor = state.quizColor.color || 'rgba(0, 173, 156, 1)';
            const customStyle = state.quizColor.custom ? generateCustomColors(quizColor, 1, true) : null;
            const showLetters = state.letters === i18n.t("MultipleChoice.ShowLetters");
            const setAnswer = (i) => {
                let newCurrentAnswer = props.exercises.currentAnswer ? [...props.exercises.currentAnswer] : [];
                let index = newCurrentAnswer.indexOf(i);
                if (index === -1) {
                    newCurrentAnswer.push(i);
                } else {
                    newCurrentAnswer.splice(index, 1);
                }
                props.setAnswer(newCurrentAnswer);
            };

            const isChecked = i => (props.exercises?.currentAnswer instanceof Array) && props.exercises.currentAnswer.indexOf(i) > -1;
            const isCorrectAnswer = i => (props.exercises?.correctAnswer instanceof Array) && props.exercises.correctAnswer.indexOf(i) > -1;

            const Answer = i => {
                let checked = isChecked(i);
                let correctAnswer = isCorrectAnswer(i);
                let correct = attempted && ((correctAnswer && checked) || (!correctAnswer && !checked));
                let incorrect = attempted && ((!correctAnswer && checked) || (correctAnswer && !checked));
                return (
                    <AnswerRow key={i + 1}
                        className={"row answerRow " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : "")}>
                        <AnswerInput>
                            <AnswerLetter>
                                {showLetters ? letterFromNumber(i) : (i + 1)}
                            </AnswerLetter>
                            <CheckboxInput disabled={attempted} name={props.id} value={i} checked={checked}
                                onChange={() => setAnswer(i)}/>
                        </AnswerInput>
                        <AnswerText onClick={() => setAnswer(i)}>
                            <VisorPluginPlaceholder {...props} key={i} pluginContainer={"Answer" + (i)}/>
                        </AnswerText>
                        {(correct) ? <i className={"material-icons correct"}>done</i> : null}
                        {(incorrect) ? <i className={"material-icons incorrect"}>clear</i> : null}
                    </AnswerRow>
                );
            };

            const answers = [...Array(state.nBoxes)].map((a, i) => {
                if (isCorrectAnswer(i)) { correctAnswers += showLetters ? letterFromNumber(i) : (i + 1) + ", "; }
                return Answer(i);
            });

            if (!props.exercises.correctAnswer || props.exercises.correctAnswer.length === 0) {
                correctAnswers += i18n.t("MultipleAnswer.None") + ".";
            } else {
                correctAnswers = removeLastChar(removeLastChar(correctAnswers)) + ".";
            }

            return (
                <MultipleAnswerPlugin className={"multipleAnswerPlugin"} style={ customStyle }>
                    <QuestionRow key={0}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                    </QuestionRow>
                    {answers}
                    <FeedbackRow show={showFeedback && !checkEmptyFeedback} key={-2}>
                        <Feedback>
                            <VisorPluginPlaceholder {...props} key="0"
                                pluginContainer={"Feedback"}/>
                        </Feedback>
                    </FeedbackRow>
                    <CorrectAnswerFeedback className="correctAnswerFeedback">
                        <CorrectAnswerLabel> {i18n.t("MultipleAnswer.correctAnswerFeedback") }:</CorrectAnswerLabel> {correctAnswers}
                    </CorrectAnswerFeedback>
                    <ExerciseScore attempted={attempted}>{score}</ExerciseScore>
                    <style dangerouslySetInnerHTML={{
                        __html: CheckBoxStyleDangerous('multipleAnswerPlugin'),
                    }} />
                </MultipleAnswerPlugin>);
        },
    };
}
/* eslint-enable react/prop-types */
