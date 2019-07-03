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
        return (!this.props.navItemSelected || !this.props.navItemSelected.type || isSlide(this.props.navItemSelected.type)) ?
            (<EditorCanvasSli fromCV={false} {...this.props} />) :
            (<EditorCanvasDoc fromCV={false} {...this.props} />);
    }

    componentWillReceiveProps(nextProps) {
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
        markCreatorId: state.reactUI.markCreatorVisible,
        marks: state.undoGroup.present.marks,
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
     * Callback for adding a mark shortcut
     */
    addMarkShortcut: PropTypes.func.isRequired,
    /**
     * Callback for deleting mark creator overlay
     */
    deleteMarkCreator: PropTypes.func.isRequired,
    /**
     * Identifier of the box that is creating a mark
     */
    markCreatorId: PropTypes.any.isRequired,
    /**
     * Callback for toggling creation mark overlay
     */
    onMarkCreatorToggled: PropTypes.func.isRequired,
    /**
     * Callback for adding a box
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
    * Callback for deleting a box
    */
    onBoxDeleted: PropTypes.func.isRequired,
    /**
     * Callback for selecting a box
     */
    onBoxSelected: PropTypes.func.isRequired,
    /**
     * Callback for increasing box level selected
     */
    onBoxLevelIncreased: PropTypes.func.isRequired,
    /**
     * Callback for moving a box
     */
    onBoxMoved: PropTypes.func.isRequired,
    /**
     * Callback for resizing a box
     */
    onBoxResized: PropTypes.func.isRequired,
    /**
     * Callback for dropping a box
     */
    onBoxDropped: PropTypes.func.isRequired,
    /**
     * Callback for vertically aligning boxes inside a container
     */
    onVerticallyAlignBox: PropTypes.func.isRequired,
    /**
     * Callback for reordering boxes inside a container
     */
    onBoxesInsideSortableReorder: PropTypes.func.isRequired,
    /**
     * Callback for deleting a sortable container
     */
    onSortableContainerDeleted: PropTypes.func.isRequired,
    /**
     * Callback for reordering sortable containers
     */
    onSortableContainerReordered: PropTypes.func.isRequired,
    /**
     * Callback for resizing a sortable container
     */
    onSortableContainerResized: PropTypes.func.isRequired,
    /**
     * Callback for selecting contained view
     */
    onContainedViewSelected: PropTypes.func.isRequired,
    /**
     * Callback for toggling the CKEditor
     */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
     * Whether or not the grid is activated for slides
     */
    grid: PropTypes.bool,
    /**
   * Function that updates the toolbar of a view
   */
    onToolbarUpdated: PropTypes.func,
};
