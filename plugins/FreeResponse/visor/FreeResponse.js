import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import './../_freeResponse.scss';
import i18n from 'i18next';
import { correctLongAnswer } from '../../../core/visor/correction_functions';
import { setRgbaAlpha } from "../../../common/common_tools";

/* eslint-disable react/prop-types */

export function FreeResponse() {
    return {
        getRenderTemplate: function(state, props) {
            let attempted = props.exercises && props.exercises.attempted;
            let score = props.exercises.score || 0;
            score = Math.round(score * 100) / 100;
            score = (props.exercises.weight === 0) ? i18n.t("FreeResponse.notCount") : ((score) + "/" + (props.exercises.weight));
            let showFeedback = attempted && state.showFeedback;
            let quizColor = state.quizColor || 'rgba(0, 173, 156, 1)';
            let checkEmptyFeedback = !props.boxes[props.id].sortableContainers['sc-Feedback'].children ||
            props.boxes[props.id].sortableContainers['sc-Feedback'].children.length === 0 ||
            props.toolbars[props.boxes[props.id].sortableContainers['sc-Feedback'].children[0]].state.__text === "<p>" + i18n.t("text_here") + "</p>" ||
            props.toolbars[props.boxes[props.id].sortableContainers['sc-Feedback'].children[0]].state.__text === encodeURI("<p>" + i18n.t("text_here") + "</p>") ||
            props.toolbars[props.boxes[props.id].sortableContainers['sc-Feedback'].children[0]].state.__text === encodeURI("<p>" + i18n.t("text_here") + "</p>\n") ||
            props.toolbars[props.boxes[props.id].sortableContainers['sc-Feedback'].children[0]].state.__text === encodeURI('<p>' + i18n.t("FreeResponse.FeedbackMsg") + '</p>\n') ||
            props.toolbars[props.boxes[props.id].sortableContainers['sc-Feedback'].children[0]].state.__text === '<p>' + i18n.t("FreeResponse.FeedbackMsg") + '</p>';

            return <div className={"exercisePlugin freeResponsePlugin " + (attempted ? " attempted" : "")} > {/* <h1>Free Response</h1>*/}
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                        <textarea autoCapitalize="sentences" value={props.exercises.currentAnswer} disabled={attempted} spellCheck placeholder={"..."/* i18n.t('FreeResponse.Placeholder')*/} onChange={e=>{ props.setAnswer(e.target.value);}} className="form-control textAreaQuiz textAreaQuizVisor"/>
                    </div>
                </div>
                {checkEmptyFeedback ? null : <div className={"row feedbackRow"} key={-2} style={{ display: showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"} style={{ color: quizColor, borderColor: quizColor, backgroundColor: setRgbaAlpha(quizColor, 0.15) }}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Feedback"}/>
                    </div>
                </div>}
                <div className={"exerciseScore"} style={{ color: quizColor }}>{score}</div>
            </div>;
        },
        checkAnswer(current, correct, state) {
            return state.correct ? correctLongAnswer(current, correct, !state.characters) : ((current && current.length && current.length > 1) ? 1 : 0);
        },
    };
}
/* eslint-enable react/prop-types */
