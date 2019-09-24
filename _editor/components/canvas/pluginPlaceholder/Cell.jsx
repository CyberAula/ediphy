import React, { Component } from 'react';
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import interact from "interactjs";
import { connect } from "react-redux";

import Ediphy from "../../../../core/editor/main";
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from "../../../../common/constants";
import { getIndexFromPoint, isBox, isComplex, isSortableContainer } from "../../../../common/utils";
import { createBox, instanceExists } from "../../../../common/commonTools";
import handleBoxes from "../../../handlers/handleBoxes";

class Cell extends Component {
    h = handleBoxes(this);
    render = () => (
        <div style={{ width: "100%", height: this.props.extraParams.row + "%", position: 'relative' }}>
            {this.props.children}
        </div>);

    componentDidMount() {
        interact(ReactDOM.findDOMNode(this)).dropzone({
            accept: '.rib, .dnd',
            overlap: 'pointer',
            ondropactivate: e => {
                let pluginDraggingFromRibbonIsNotComplex = e.relatedTarget.className.indexOf("rib") === -1 || !e.relatedTarget.getAttribute("name") ||
                    !isComplex(e.relatedTarget.getAttribute("name"));
                let pluginDraggingFromCanvasIsNotComplex = e.relatedTarget.className.indexOf("rib") !== -1 ||
                    (this.props.pluginToolbarsById[this.props.boxSelected]?.pluginId && !isComplex(this.props.pluginToolbarsById[this.props.boxSelected].pluginId));
                let notYourself = e.relatedTarget.className.indexOf("rib") !== -1 || this.props.parentBox.id !== this.props.boxSelected;
                if (notYourself && pluginDraggingFromRibbonIsNotComplex && pluginDraggingFromCanvasIsNotComplex) {
                    e.target.classList.add('drop-active');
                }
            },
            ondragenter: function(event) {
                event.target.classList.add("drop-target");
            },
            ondragleave: function(event) {
                event.target.classList.remove("drop-target");
            },
            ondrop: e => this.interactDrop(e, this.props.extraParams),
            ondropdeactivate: function(event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            },
        });
    }

    interactDrop = (e, extraParams) => {
        let draggingFromRibbon = e.relatedTarget.className.indexOf("rib") !== -1;
        let name = (draggingFromRibbon) ? e.relatedTarget.getAttribute("name") : this.props.pluginToolbarsById[this.props.boxSelected].pluginId;
        let parent = forbidden ? this.props.parentBox.parent : this.props.parentBox.id;
        let container = forbidden ? this.props.parentBox.container : this.idConvert(this.props.pluginContainer);
        let config = Ediphy.Plugins.get(name).getConfig();
        let forbidden = isBox(parent) && (config.isComplex || config.category === "evaluation"); // && (parent !== this.props.boxSelected);

        let initialParams = {
            parent: forbidden ? this.props.parentBox.parent : parent,
            container: forbidden ? this.props.parentBox.container : container,
            col: forbidden ? 0 : extraParams.i,
            row: forbidden ? 0 : extraParams.j,
            page: this.props.page,
            id: ID_PREFIX_BOX + Date.now(),
            position: { type: 'relative', x: 0, y: 0 },
        };

        let newInd = initialParams.container === 0 ? undefined : getIndexFromPoint(this.props.boxesById, initialParams.parent, initialParams.container, e.dragEvent.clientX, e.dragEvent.clientY, forbidden, this.props.parentBox.id);
        initialParams.index = newInd;

        if (draggingFromRibbon) {
            let apiPlugin = Ediphy.Plugins.get(name);
            if (!apiPlugin) {
                return;
            }
            if (config.limitToOneInstance && instanceExists(event.relatedTarget.getAttribute("name"))) {
                this.props.showAlert();
                return;
            }
            let slide = this.props.parentBox.resizable;
            createBox(initialParams, name, slide, this.h.onBoxAdded, this.props.boxesById);

        } else if (!(config.isComplex && (initialParams.container === 0))) {
            let boxDragged = this.props.boxesById[this.props.boxSelected];
            // If box being dragged is dropped in a different column or row, change its value
            if (this.props.parentBox.id !== this.props.boxSelected) {
                this.h.onBoxDropped(
                    boxDragged.id,
                    initialParams.row,
                    initialParams.col,
                    initialParams.parent,
                    initialParams.container,
                    boxDragged.parent,
                    boxDragged.container,
                    initialParams.position,
                    newInd);
                let clone = document.getElementById('clone');
                if (clone) {
                    clone.parentElement.removeChild(clone);
                }
                e.dragEvent.stopPropagation();
            }
        }
        e.dragEvent.stopPropagation();
    };

    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this)).unset();
        interact(".editorBoxSortableContainer").unset();
    }

    idConvert = (id) => isSortableContainer(id) ? id : ID_PREFIX_SORTABLE_CONTAINER + id;
}

function mapStateToProps(state) {
    const { boxesById, boxSelected, pluginToolbarsById } = state.undoGroup.present;
    return {
        boxesById,
        boxSelected,
        pluginToolbarsById,
    };
}

export default connect(mapStateToProps)(Cell);

Cell.propTypes = {
    /**
     * Plugins container name
     */
    pluginContainer: PropTypes.string,
    /**
     * Unique identifier of the parent box
     */
    parentBox: PropTypes.any,
    /**
     * Object containing all created boxesById (by id)
     */
    boxesById: PropTypes.object,
    /**
     * Current Box selected. If there isn't, -1
     */
    boxSelected: PropTypes.any,
    /**
     * Object containing every plugin toolbar (by id)
     */
    pluginToolbarsById: PropTypes.object,
    /**
     * Current page
     */
    page: PropTypes.any,
    /**
     * Coordinates of the cell
     */
    extraParams: PropTypes.object,
    /**
     * Display alert modal
     */
    showAlert: PropTypes.func,
    /**
     * Children
     */
    children: PropTypes.any,
};
