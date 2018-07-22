import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import i18n from 'i18next';
import { letterFromNumber } from '../../../common/common_tools';
import { compareNumbersLiterally } from '../../../core/visor/correction_functions';
import star from '../star.svg';
/* eslint-disable react/prop-types */

export function Rating() {
    return {
        getRenderTemplate: function(state, props) {
            let els = [];
            let attempted = props.exercises && props.exercises.attempted;
            for (let i = 0; i < state.range; i++) {
                let checked = props.exercises.currentAnswer === i;

                if (state.numeric) {

                    els.push(<button className={"ratingElement" + (checked ? " ratingSelected" : "")} onClick={(e)=>{
                        if (!attempted) {
                            props.setAnswer(i);
                        }
                    }}>{i + 1}</button>);
                } else {
                    checked = props.exercises.currentAnswer >= i;

                    els.push(<button className={"ratingElementStar" + (checked ? " ratingSelected" : "")} onClick={(e)=>{
                        if (!attempted) {
                            props.setAnswer(i);
                        }
                    }}><img src={star} alt=""/></button>);
                }
            }
            return <div className={"exercisePlugin ratingPlugin"}>
                {els}
            </div>;
        },
        checkAnswer(current, correct, state) {
            return (current + 1) / (state.range || 1);

        },
    };
}
/* eslint-enable react/prop-types */
