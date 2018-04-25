import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import './../_freeResponse.scss';
import i18n from 'i18next';

/* eslint-disable react/prop-types */

export function FreeResponse() {
    return {
        getRenderTemplate: function(state, props) {
            let attempted = props.exercises && props.exercises.attempted;
            let score = props.exercises.score || 0;
            score = Math.round(score * 100) / 100;
            score = (score) + "/" + (props.exercises.weight || 0);
            let showFeedback = attempted && state.showFeedback;
            return <div className={"exercisePlugin freeResponsePlugin " + (attempted ? " attempted" : "")} > {/* <h1>Free Response</h1>*/}
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                        <textarea autoCapitalize="sentences" disabled={attempted} spellCheck placeholder={"..."/* i18n.t('FreeResponse.Placeholder')*/} onChange={e=>{ props.setAnswer(e.target.value);}} className="form-control textAreaQuiz textAreaQuizVisor"/>
                        <div className={"exerciseScore"}>{score}</div>
                    </div>
                </div>
                <div className={"row feedbackRow"} key={-2} style={{ display: showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Feedback"}/>
                    </div>
                </div>
            </div>;
        },
        checkAnswer(current, correct) {
            return current && current.length && current.length > 0;
        },
    };
}
/* eslint-enable react/prop-types */
