import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import i18n from 'i18next';
import { letterFromNumber } from '../../../common/commonTools';
import { generateCustomColors } from "../../../common/themes/themeLoader";
import { checkFeedback, getScore } from "../../../common/utils";
import {
    CorrectAnswerFeedback,
    CorrectAnswerLabel,
    ExerciseScore,
    Feedback,
    FeedbackRow, MatIconFeedback,
    QuestionRow,
    RadioStyleDangerous,
} from "../../../sass/exercises";
import {
    AnswerInput,
    AnswerLetter,
    AnswerRow,
    AnswerText,
    MultipleChoicePlugin,
    RadioInput,
} from "../Styles";
/* eslint-disable react/prop-types */

export function MultipleChoice() {
    return {
        getRenderTemplate: function(state, props) {
            let correctAnswers = "";

            const attempted = props.exercises && props.exercises.attempted;
            const score = getScore('MultipleChoice', props);

            const showFeedback = attempted && state.showFeedback;
            const checkEmptyFeedback = checkFeedback('MultipleChoice', props);

            const quizColor = state.quizColor.color || 'rgba(0, 173, 156, 1)';
            const customStyle = state.quizColor.custom ? generateCustomColors(quizColor, 1, true) : null;

            const correct = i => attempted && props.exercises.correctAnswer === i;
            const incorrect = i => attempted && ((props.exercises.correctAnswer !== i && props.exercises.currentAnswer === i));
            const checked = i => props.exercises.currentAnswer === i;
            const clickHandler = i => props.setAnswer(parseInt(i, 10));

            const Answer = i => (
                <AnswerRow key={i + 1} className={"row answerRow " + (correct(i) ? "correct " : " ") + (incorrect(i) ? "incorrect " : " ")}>
                    <AnswerInput>
                        <AnswerLetter>{(state.letters === i18n.t("MultipleChoice.ShowLetters")) ? letterFromNumber(i) : (i + 1)}</AnswerLetter>
                        <RadioInput disabled={attempted} name={props.id} value={i} checked={checked(i)}
                            onChange={() => clickHandler(i)}/>
                    </AnswerInput>
                    <AnswerText onClick={() => clickHandler(i)}>
                        <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Answer" + i} />
                    </AnswerText>
                    {(checked(i) && correct(i)) ? <MatIconFeedback className={ "correct"}>done</MatIconFeedback> : null}
                    {(checked(i) && incorrect(i)) ? <MatIconFeedback className={ "incorrect"}>clear</MatIconFeedback> : null}
                </AnswerRow>
            );

            const answers = [...Array(state.nBoxes)].map((a, i) => {
                if (correct(i)) {correctAnswers += state.letters === i18n.t("MultipleChoice.ShowLetters") ? letterFromNumber(i) : (i + 1);}
                return Answer(i);
            });

            return (
                <MultipleChoicePlugin className="multipleChoicePlugin" style={ customStyle }>
                    <QuestionRow key={0} >
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                    </QuestionRow>
                    {answers}
                    <FeedbackRow show={showFeedback && !checkEmptyFeedback} key={-2}>
                        <Feedback>
                            <VisorPluginPlaceholder {...props} key="0"
                                pluginContainer={"Feedback"}/>
                        </Feedback>
                    </FeedbackRow>
                    <CorrectAnswerFeedback show={attempted}>
                        <CorrectAnswerLabel> {i18n.t("MultipleChoice.correctAnswerFeedback") }:</CorrectAnswerLabel> {correctAnswers}
                    </CorrectAnswerFeedback>
                    <ExerciseScore attempted={attempted}>{score}</ExerciseScore>
                    <style dangerouslySetInnerHTML={{
                        __html: RadioStyleDangerous('multipleChoicePlugin'),
                    }}/>
                </MultipleChoicePlugin>
            );
        },
    };
}
/* eslint-enable react/prop-types */
