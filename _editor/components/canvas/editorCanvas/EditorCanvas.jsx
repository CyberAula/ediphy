import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorCanvasSli from '../editorCanvasSli/EditorCanvasSli';
import EditorCanvasDoc from '../editorCanvasDoc/EditorCanvasDoc';
import { isSlide } from '../../../../common/utils';
import { connect } from "react-redux";

/**
 * Container component to render documents or slides
 *
 */
class EditorCanvas extends Component {
    render() {
        let itemSelected = this.props.navItemsById[this.props.navItemSelected];
        return (!itemSelected || !itemSelected.type || isSlide(itemSelected.type)) ?
            (<EditorCanvasSli fromCV={false} {...this.props} />) :
            (<EditorCanvasDoc fromCV={false} {...this.props} />);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let itemSelected = this.props.navItemsById[this.props.navItemSelected];
        let nextItemSelected = nextProps.navItemsById[nextProps.navItemSelected];
        if ((itemSelected) && (itemSelected.id)
            && (nextItemSelected) && (nextItemSelected.id)
            && (itemSelected.id !== nextItemSelected.id)) {
            document.getElementById('maincontent').scrollTop = 0;
        }
    }
}

function mapStateToProps(state) {
    const { boxesById, boxLevelSelected, boxSelected, containedViewsById, containedViewSelected, exercises, globalConfig, lastActionDispatched,
        marksById, navItemsById, navItemSelected, pluginToolbarsById, viewToolbarsById } = state.undoGroup.present;
    const { grid, markCreatorVisible, fileModalResult } = state.reactUI;
    return{
        aspectRatio: globalConfig.canvasRatio,
        boxesById,
        boxLevelSelected,
        boxSelected,
        containedViewsById,
        containedViewSelected,
        exercises,
        fileModalResult,
        globalConfig,
        grid,
        lastActionDispatched,
        markCreatorVisible,
        marksById,
        navItemsById,
        navItemSelected,
        pluginToolbarsById,
        viewToolbarsById,
    };
}

export default connect(mapStateToProps)(EditorCanvas);

EditorCanvas.propTypes = {
    /**
     * Canvas show flag in current selected view
     */
    showCanvas: PropTypes.bool,
    /**
     * Object containing every existing box (by id)
     */
    boxesById: PropTypes.object.isRequired,
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
    navItemsById: PropTypes.object.isRequired,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViewsById: PropTypes.object.isRequired,
    /**
     * Selected contained view (by ID)
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Object containing every view toolbar (by id)
     */
    viewToolbarsById: PropTypes.object.isRequired,
    /**
     * Object containing every plugin toolbar (by id)
     */
    pluginToolbarsById: PropTypes.object.isRequired,
    /**
     * Last action dispatched in Redux
     */
    lastActionDispatched: PropTypes.any.isRequired,
    /**
     * Identifier of the box that is creating a mark
     */
    markCreatorVisible: PropTypes.any.isRequired,
    /**
     * Whether or not the grid is activated for slides
     */
    grid: PropTypes.bool,
};
