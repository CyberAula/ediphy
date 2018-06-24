
import React from 'react';
import VirtualRealityPlugin from '../components/VirtualRealityPlugin';
/* eslint-disable react/prop-types */
export function VirtualReality(base) {
    return {
        getRenderTemplate: function(state, props) {
            return <VirtualRealityPlugin state={state} id={props.id}
                marks={props.marks} onMarkClicked={props.onMarkClicked}/>;
        },

    };
}
/* eslint-enable react/prop-types */

