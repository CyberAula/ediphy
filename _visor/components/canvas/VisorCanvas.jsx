import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisorCanvasDoc from './VisorCanvasDoc';
import VisorCanvasSli from './VisorCanvasSli';
import Watermark from './Watermark';
import { isSlide } from '../../../common/utils';

export default class VisorCanvas extends Component {

    render() {
        return [(isSlide(this.props.navItems[this.props.currentView].type)) ?
            (<VisorCanvasSli key="0" {...this.props} />) :
            (<VisorCanvasDoc key="0" {...this.props} />),
        <Watermark ediphy_document_id={this.props.ediphy_document_id} ediphy_platform={this.props.ediphy_platform} key={"1"}/>];
    }

    componentDidUpdate() {
        if (window.MathJax) {
            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
        }
    }

}

VisorCanvas.propTypes = {
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
     * Deletes last view
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
     * Dictionary that contains all the toolbars
     */
    toolbars: PropTypes.object,
    /**
     * Containes marks on course or that have been already triggered
     */
    triggeredMarks: PropTypes.array,
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
