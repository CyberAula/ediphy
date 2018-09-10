import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import './../_freeResponse.scss';
import i18n from 'i18next';
import { correctLongAnswer } from '../../../core/visor/correction_functions';

/* eslint-disable react/prop-types */

export function FreeResponse() {
    return {
        getRenderTemplate: function(state, props) {
            let attempted = props.exercises && props.exercises.attempted;
            let score = props.exercises.score || 0;
            score = Math.round(score * 100) / 100;
            score = (score) + "/" + (props.exercises.weight || 0);
            let showFeedback = attempted && state.showFeedback;
            function setRgbaAlpha(color, alpha) {

                if (color.charAt(0) === "#") {
                    let cutHex = color.substring(1, 7);
                    let r = parseInt(cutHex.substring(0, 2), 16);
                    let g = parseInt(cutHex.substring(2, 4), 16);
                    let b = parseInt(cutHex.substring(4, 6), 16);
                    color = 'rgba(' + r + ',' + g + ',' + b + ',0.25)';
                    console.log(color);
                }
                return color.replace(/[\d\.]+\)$/g, alpha.toString() + ")");
            }
            return <div className={"exercisePlugin freeResponsePlugin " + (attempted ? " attempted" : "")} > {/* <h1>Free Response</h1>*/}
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                        <textarea autoCapitalize="sentences" value={props.exercises.currentAnswer} disabled={attempted} spellCheck placeholder={"..."/* i18n.t('FreeResponse.Placeholder')*/} onChange={e=>{ props.setAnswer(e.target.value);}} className="form-control textAreaQuiz textAreaQuizVisor"/>
                        <div className={"exerciseScore"} style={{ color: state.quizColor }}>{score}</div>
                    </div>
                </div>
                <div className={"row feedbackRow"} key={-2} style={{ display: showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"} style={{ color: state.quizColor, borderColor: state.quizColor, backgroundColor: setRgbaAlpha(state.quizColor, 0.15) }}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Feedback"}/>
                    </div>
                </div>
            </div>;
        },
        checkAnswer(current, correct, state) {
            return state.correct ? correctLongAnswer(current, correct, !state.characters) : ((current && current.length && current.length > 1) ? 1 : 0);
        },
    };
}
/* eslint-enable react/prop-types */
