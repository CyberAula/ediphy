import React from 'react';

export default class ProgressBall extends React.Component {
    render() {
        let { isVisited, isTop, isBottom } = this.props;
        return (
            <svg width="14" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect fill="none" id="canvas_background" height="36" width="16" y="-1" x="-1"/>
                <rect fill="url(#gridpattern)" strokeWidth="0" y="0" x="0" height="100%" width="100%"/>
                <ellipse ry="5.1903" rx="5.276805" id="svg_1" cy="17.913492" cx="6.913494" strokeWidth="1" stroke="#ffffff" fill={isVisited ? "#00f7f7" : "none"} />
                {isTop ? null : <line stroke="#ffffff" strokeLinecap="null" strokeLinejoin="null" id="svg_5" y2="12.896203" x2="6.999999" y1="-0.079548" x1="6.999999" fillOpacity="null" strokeWidth="0.5" fill="none"/>}
                {isBottom ? null : <line stroke="#ffffff" strokeLinecap="null" strokeLinejoin="null" id="svg_6" y2="37.636631" x2="6.999999" y1="23.449812" x1="6.999999" fillOpacity="null" strokeWidth="0.5" fill="none"/>}
            </svg>
        );
    }
}
