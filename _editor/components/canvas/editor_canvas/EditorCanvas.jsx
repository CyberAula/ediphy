import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorCanvasSli from '../editor_canvas_sli/EditorCanvasSli';
import EditorCanvasDoc from '../editor_canvas_doc/EditorCanvasDoc';
import { isSlide } from '../../../../common/utils';
import { connect } from "react-redux";
import './_canvas.scss';
import { has } from "../../../../common/utils";

/**
 * Container component to render documents or slides
 *
 */
class EditorCanvas extends Component {
    render() {
        return (!this.props.navItemSelected
                || !this.props.navItemSelected.type
                || isSlide(this.props.navItemSelected.type)) ?
            (<EditorCanvasSli fromCV={false} {...this.props} />) :
            (<EditorCanvasDoc fromCV={false} {...this.props} />);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if ((this.props.navItemSelected) && (this.props.navItemSelected.id)
            && (nextProps.navItemSelected) && (nextProps.navItemSelected.id)
            && (this.props.navItemSelected.id !== nextProps.navItemSelected.id)) {
            document.getElementById('maincontent').scrollTop = 0;
        }
    }
}

function mapStateToProps(state) {
    return{
        aspectRatio: state.undoGroup.present.globalConfig.canvasRatio,
        boxes: state.undoGroup.present.boxesById,
        boxLevelSelected: state.undoGroup.present.boxLevelSelected,
        boxSelected: state.undoGroup.present.boxSelected,
        containedViews: state.undoGroup.present.containedViewsById,
        containedViewSelected: state.undoGroup.present.containedViewsById[state.undoGroup.present.containedViewSelected] || 0,
        exercises: state.undoGroup.present.exercises,
        fileModalResult: state.reactUI.fileModalResult,
        grid: state.reactUI.grid,
        lastActionDispatched: state.undoGroup.present.lastActionDispatched,
        markCreatorId: state.reactUI.markCreatorVisible,
        marks: state.undoGroup.present.marksById,
        navItems: state.undoGroup.present.navItemsById,
        navItemSelected: state.undoGroup.present.navItemsById[state.undoGroup.present.navItemSelected],
        pluginToolbars: state.undoGroup.present.pluginToolbarsById,
        showCanvas: state.undoGroup.present.navItemSelected !== 0,
        title: state.undoGroup.present.globalConfig.title || '---',
        viewToolbars: state.undoGroup.present.viewToolbarsById,
    };
}

export default connect(mapStateToProps)(EditorCanvas);

EditorCanvas.propTypes = {
    /**
     * Slides aspect ratio
     */
    canvasRatio: PropTypes.number,
    /**
     * Canvas show flag in current selected view
     */
    showCanvas: PropTypes.bool,
    /**
     * Object containing every existing box (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Current Box selected. If there isn't, -1
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Selected box level (only plugins inside plugins)
     */
    boxLevelSelected: PropTypes.number.isRequired,
    /**
     * Object containing all views (by id)
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Selected contained view (by ID)
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Course title
     */
    title: PropTypes.string.isRequired,
    /**
     * Object containing every view toolbar (by id)
     */
    viewToolbars: PropTypes.object.isRequired,
    /**
     * Object containing every plugin toolbar (by id)
     */
    pluginToolbars: PropTypes.object.isRequired,
    /**
     * Last action dispatched in Redux
     */
    lastActionDispatched: PropTypes.any.isRequired,
    /**
     * Identifier of the box that is creating a mark
     */
    markCreatorId: PropTypes.any.isRequired,
    /**
     * Callback for selecting contained view
     */
    onContainedViewSelected: PropTypes.func.isRequired,
    /**
     * Whether or not the grid is activated for slides
     */
    grid: PropTypes.bool,
    /**
   * Function that updates the toolbar of a view
   */
    onToolbarUpdated: PropTypes.func,
};
