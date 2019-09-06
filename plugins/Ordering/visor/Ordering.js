import React from 'react';
import OrderVisor from '../OrderVisor';
import { correctArrayOrdered } from '../../../core/visor/correctionFunctions';
/* eslint-disable react/prop-types */

export function Ordering() {
    return {
        getRenderTemplate: function(state, props) {
            return <OrderVisor state={state} props={props}/>;
        },
        checkAnswer(current, correct, state) {
            let correct2 = [...current].sort();
            return correctArrayOrdered(current, correct2, state.nBoxes, state.allowPartialScore);

        },
    };
}
/* eslint-enable react/prop-types */
