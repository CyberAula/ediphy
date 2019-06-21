import React from 'react';
import PropTypes from 'prop-types';
export default class ProgressBall extends React.Component {
    render() {
        let { isVisited, isTop, isBottom } = this.props;
        return (
            <svg width="14" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect fill="none" id="canvas_background" height="36" width="16" y="-1" x="-1"/>
                {/* <rect fill="url(#gridpattern)" strokeWidth="0" y="0" x="0" height="100%" width="100%"/>*/}
                {isTop ? null : <line stroke={isVisited ? "#00f7f7" : "#aaa"} strokeLinecap="null" strokeLinejoin="null" id="svg_5" y2="13" x2="7" y1="-0.1" x1="7" fillOpacity="null" strokeWidth="0.5" fill="none"/>}
                {isBottom ? null : <line stroke={isVisited ? "#00f7f7" : "#aaa"} strokeLinecap="null" strokeLinejoin="null" id="svg_6" y2="38" x2="7" y1="22" x1="7" fillOpacity="null" strokeWidth="0.5" fill="none"/>}
                <ellipse ry="4.2" rx="4.2" id="svg_1" cy="18" cx="7" strokeWidth="1" stroke={isVisited ? "#00f7f7" : "#aaa"} fill={isVisited ? "#00f7f7" : "#aaa"} />

            </svg>
        );
    }
}

ProgressBall.propTypes = {
    /**
   * Completed page
   */
    isVisited: PropTypes.bool,
    /**
   * Is first page
   */
    isTop: PropTypes.bool,
    /**
   * Is last page
   */
    isBottom: PropTypes.bool,

};
