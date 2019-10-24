import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import { correctArrayOrdered } from '../../../core/visor/correctionFunctions';
import { generateCustomColors } from "../../../common/themes/themeLoader";
import {
    AnswerInput, AnswerRow, AnswerText, False, Feedback, FeedbackRow, IconCol, RadioInput, TFRow, True, TrueFalsePlugin,
} from "../Styles";
import { checkFeedback, getScore } from "../../../common/utils";
import { ExerciseScore, QuestionRow, RadioStyleDangerous } from "../../../sass/exercises";

/* eslint-disable react/prop-types */

export const TrueFalse = () => ({
    getRenderTemplate: (state, props) => {
        const { exercises, setAnswer } = props;
        let quizColor = state.quizColor.color || 'rgba(0, 173, 156, 1)';
        let customStyle = state.quizColor.custom ? generateCustomColors(quizColor, 1, true) : null;

        let attempted = exercises?.attempted;
        let score = getScore('TrueFalse', props);

        let showFeedback = attempted && state.showFeedback;
        const checkEmptyFeedback = checkFeedback('TrueFalse', props);

        const clickHandler = (ind, val) => {
            if(exercises?.currentAnswer instanceof Array) {
                let newAnswer = [...Array(state.nBoxes)].map((a, i) => (ind === i) ? val : exercises.currentAnswer[i]);
                setAnswer(newAnswer);
            }
        };

        const Answer = i => {
            let correct = attempted && props.exercises.correctAnswer[i] === props.exercises.currentAnswer[i];
            return(
                <AnswerRow key={i + 1} className={(correct ? "correct " : "incorrect")}>
                    <AnswerInput>
                        <RadioInput disabled={attempted} name={props.id + '_' + i}
                            value={i} checked={ props.exercises?.currentAnswer[i] === "true" }
                            onChange={()=>{ clickHandler(i, "true"); }}/>
                        <RadioInput disabled={attempted} name={props.id + '_' + i}
                            value={i} checked={ props.exercises?.currentAnswer[i] === "false"}
                            onChange={()=>{ clickHandler(i, "false"); }}/>
                    </AnswerInput>
                    <AnswerText>
                        <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Answer" + i} />
                    </AnswerText>
                    <i className={ "material-icons " + (correct ? "correct " : "incorrect")}
                        style={{ display: attempted ? "block" : "none" }}>{(correct ? "done " : "clear")}</i>
                </AnswerRow>
            );
        };

        const answers = [...Array(state.nBoxes)].map((a, i) => Answer(i));

        return (
            <TrueFalsePlugin className="truefalsePlugin" style={ customStyle }>
                <QuestionRow key={-1} >
                    <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                </QuestionRow>
                <TFRow key={0}>
                    <IconCol>
                        <True className="material-icons true">done</True>
                        <False className="material-icons false">clear</False>
                    </IconCol>
                </TFRow>
                {answers}
                <FeedbackRow show={showFeedback && !checkEmptyFeedback} key={-2}>
                    <Feedback>
                        <VisorPluginPlaceholder {...props} key="0"
                            pluginContainer={"Feedback"}/>
                    </Feedback>
                </FeedbackRow>
                <ExerciseScore attempted={attempted}>{score}</ExerciseScore>
                <style dangerouslySetInnerHTML={{ __html: RadioStyleDangerous('truefalsePlugin') }}/>
            </TrueFalsePlugin>);
    },
    checkAnswer(current, correct, state) {
        return correctArrayOrdered(current, correct, state.nBoxes, state.allowPartialScore);
    },
});
/* eslint-enable react/prop-types */
