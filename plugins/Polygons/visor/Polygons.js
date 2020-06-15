
import React from 'react';
import Poly from "../Poly";
/* eslint-disable react/prop-types */

export function Polygons() {
    return {
      getRenderTemplate: function(state) {
          return(
            <Poly sides={state.nSides} size={40} cx={50} cy={50} r={30}
             polygonstrokeWidth={state.polygonstrokeWidth} borderColor={state.borderColor.color}
             shapeColor={state.shapeColor.color} polygonBorderStyle={state.polygonBorderStyle}
             polygonOpacity={state.polygonOpacity}/>
      );
    },
  };
}
/* eslint-enable react/prop-types */
