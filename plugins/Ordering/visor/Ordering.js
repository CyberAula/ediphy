import React from 'react';
import OrderVisor from '../OrderVisor';
import sortable from 'jquery-ui/ui/widgets/sortable';
import { correctArrayOrdered } from '../../../core/visor/correction_functions';
/* eslint-disable react/prop-types */

export function Ordering() {
    return {
        init: function() {
            // eslint-disable-next-line  no-new
            // new sortable();
        },
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
