
import React from 'react';

import { PluginContainer } from '../Styles';
/* eslint-disable react/prop-types */

export function Circle(base) {

    return {
        getRenderTemplate: (state, props) => {

            return
               <Poly sides={state.nSides} size={40} cx={50} cy={50} r={30}
               circlestrokeWidth={state.circlestrokeWidth} borderColor={state.borderColor.color}
               shapeColor={state.shapeColor.color} circleBorderStyle={state.circleBorderStyle}
               circleOpacity={state.circleOpacity}/>
        }
    };
}
/* eslint-enable react/prop-types */
