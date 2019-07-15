import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isSlide } from '../../../common/utils';
import VisorCanvasDoc from './VisorCanvasDoc';
import VisorCanvasSli from './VisorCanvasSli';
import Watermark from './Watermark';
import { CSSTransition } from 'react-transition-group';

export default class VisorContainedCanvas extends Component {
    componentDidMount() {

    }
    render() {
        let visorContent;
        if (isSlide(this.props.containedViews[this.props.currentView].type)) {
            visorContent = <VisorCanvasSli {...this.props} />;
        }else{
            visorContent = <VisorCanvasDoc {...this.props} />;
        }
        return (
            [<CSSTransition
                key="anim"
                classNames={{
                    appear: 'appear',
                    appearActive: 'active-appear',
                    enter: 'enter',
                    enterActive: 'active-enter',
                    exit: 'exit',
                    exitActive: 'active-exit',
                }}
                timeout={{ enter: 500, exit: 300 }}>
                {visorContent}
            </CSSTransition>,
            <Watermark ediphy_document_id={this.props.ediphy_document_id} ediphy_platform={this.props.ediphy_platform} key={"1"}/>]
        );
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        document.getElementById('contained_maincontent').scrollTop = 0;

    }

    componentDidUpdate() {
        if (window.MathJax) {
            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
        }
    }
}

VisorContainedCanvas.propTypes = {
    /**
    * Show the current view
    */
    show: PropTypes.bool,
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Slide aspect ratio
     */
    canvasRatio: PropTypes.number.isRequired,
    /**
     * Changes current view
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Current view
     */
    currentView: PropTypes.any,
    /**
     * Object containing all views (by id)
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Function to delete last view
     */
    removeLastView: PropTypes.func.isRequired,
    /**
     * Rich plugin state during transition
     */
    richElementsState: PropTypes.object,
    /**
     * Show canvas (a navItem needs to be chosen)
     */
    showCanvas: PropTypes.bool,
    /**
     * Course title
     */
    title: PropTypes.any,
    /**
     * Pages toolbars
     */
    viewToolbars: PropTypes.object.isRequired,
    /**
     * Boxes toolbars
     */
    pluginToolbars: PropTypes.object.isRequired,
    /**
     *  Contains created views
     */
    viewsArray: PropTypes.array,
    /**
   * Ediphy Document id
   */
    ediphy_document_id: PropTypes.any,
    /**
   * Platform where excursion is hosted
   */
    ediphy_platform: PropTypes.any,

};
