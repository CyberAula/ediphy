
import React from 'react';
import Poly from "../Poly";
/* eslint-disable react/prop-types */

export function Polygons() {
    return {
        getRenderTemplate: function(state) {
            return(
                <Poly sides={state.nSides}
                    polygonstrokeWidth={state.polygonstrokeWidth} borderColor={borderColor}
                    shapeColor={state.shapeColor.color} polygonBorderStyle={state.polygonBorderStyle}
                    polygonOpacity={state.polygonOpacity}/>
            );
        },
    };
}
/* eslint-enable react/prop-types */
