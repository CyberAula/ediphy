import React from 'react';
import StarComponent from '../StarComponent';
/* eslint-disable react/prop-types */

export function Rating() {
    return {
        getRenderTemplate: function(state, props) {
            let els = [];
            let attempted = props.exercises && props.exercises.attempted;
            for (let i = 0; i < state.range; i++) {
                let checked = props.exercises.currentAnswer === i + 1;

                if (!state.stars) {

                    els.push(<button className={"ratingElement" + (checked ? " ratingSelected" : "")} onClick={()=>{
                        if (!attempted) {
                            props.setAnswer(i + 1);
                        }
                    }}>{i + 1}</button>);
                } else {
                    checked = props.exercises.currentAnswer > i;

                    els.push(<button className={"ratingElementStar" + (checked ? " ratingSelected" : "")} onClick={()=>{
                        if (!attempted) {
                            props.setAnswer(i + 1);
                        }
                    }}><StarComponent/></button>);
                }
            }
            return <div className={"exercisePlugin ratingPlugin"}>
                {els}
            </div>;
        },
        checkAnswer(current, correct, state) {
            return (current) / (state.range || 1);

        },
    };
}
/* eslint-enable react/prop-types */
