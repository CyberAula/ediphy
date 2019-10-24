import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import i18n from 'i18next';
import { correctLongAnswer } from '../../../core/visor/correctionFunctions';
import { generateCustomColors } from "../../../common/themes/themeLoader";
import { AnswerRow, FreeResponsePlugin, TextAreaVisor } from "../Styles";
import { checkFeedback } from "../../../common/utils";
import { ExerciseScore, Feedback, FeedbackRow } from "../../../sass/exercises";

/* eslint-disable react/prop-types */

export const FreeResponse = () => ({
    getRenderTemplate: function(state, props) {
        let attempted = props.exercises && props.exercises.attempted;
        let score = props.exercises.score || 0;
        score = Math.round(score * 100) / 100;
        score = (props.exercises.weight === 0) ? i18n.t("FreeResponse.notCount") : ((score) + "/" + (props.exercises.weight));

        let quizColor = state.quizColor.color || 'rgba(0, 173, 156, 1)';
        let customStyle = state.quizColor.custom ? generateCustomColors(quizColor, 1, true) : null;

        let showFeedback = attempted && state.showFeedback;
        let checkEmptyFeedback = checkFeedback('FreeResponse', props);

        return (
            <FreeResponsePlugin className={"exercisePlugin freeResponsePlugin " + (attempted ? " attempted" : "")} style={ customStyle }>
                <AnswerRow className={"row"} key={0}>
                    <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                    <TextAreaVisor autoCapitalize="sentences" value={props.exercises.currentAnswer}
                        disabled={attempted} spellCheck placeholder={"..."}
                        onChange={e=>{ props.setAnswer(e.target.value);}}/>
                </AnswerRow>
                <FeedbackRow show={showFeedback && !checkEmptyFeedback} key={-2}>
                    <Feedback>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Feedback"}/>
                    </Feedback>
                </FeedbackRow>
                <ExerciseScore>{score}</ExerciseScore>
            </FreeResponsePlugin>
        );
    },
    checkAnswer(current, correct, state) {
        return state.correct ? correctLongAnswer(current, correct, !state.characters) : ((current && current.length && current.length > 1) ? 1 : 0);
    },
});
/* eslint-enable react/prop-types */
