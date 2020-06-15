import React from "react";
import Polygons from "./Polygons";
import { generateCustomColors } from "../../common/themes/themeLoader";


const Poly = props => {
  let points = [];
  for (let i = 1; i < props.sides + 2; i++) {
    points.push({
      x:
        props.cx +
        Math.round(props.r * Math.sin((Math.PI / (props.sides / 2)) * i)),
      y:
        props.cy +
        Math.round(props.r * Math.cos((Math.PI / (props.sides / 2)) * i))
    });
  }

  let pointsStr = "";
  points.forEach(val => {
    pointsStr += `${val.x},${val.y} `;
  });



  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <circle
        cx={props.cx}
        cy={props.cy}
        r={props.r}
        //Estilo de la circunferencia circunscrita
        stroke={"none"}
        strokeWidth={1}
        fill={"none"}
      />
      <polyline points={pointsStr} fill={props.shapeColor} stroke={props.borderColor}
      strokeWidth={props.polygonstrokeWidth} opacity={props.polygonOpacity} viewBox={"0 0 100 60"}
      />
    </svg>
  );
};

export default Poly;
