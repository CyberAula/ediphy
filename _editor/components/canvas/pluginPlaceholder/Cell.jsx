import React, { Component } from 'react';
import ReactDOM from "react-dom";
import interact from "interactjs";
import Ediphy from "../../../../core/editor/main";
import { getIndexFromPoint, isBox, isComplex, isSortableContainer } from "../../../../common/utils";
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from "../../../../common/constants";
import { createBox, instanceExists } from "../../../../common/commonTools";
import Alert from "../../common/alert/Alert";
import i18n from "i18next";
import PropTypes from "prop-types";

export default class Cell extends Component {
    render = () => (
        <div key={this.props.keyCell} style={{ width: "100%", height: this.props.row + "%", position: 'relative' }}>
            {this.props.children}
        </div>);

    componentDidMount() {
        interact(ReactDOM.findDOMNode(this)).dropzone({
            accept: '.rib, .dnd',
            overlap: 'pointer',
            ondropactivate: e => {
                let pluginDraggingFromRibbonIsNotComplex = e.relatedTarget.className.indexOf("rib") === -1 || !e.relatedTarget.getAttribute("name") ||
                    !isComplex(e.relatedTarget.getAttribute("name"));
                let pluginDraggingFromCanvasIsNotComplex = e.relatedTarget.className.indexOf("rib") !== -1 || (this.props.pluginToolbars[this.props.boxSelected ] &&
                    this.props.pluginToolbars[this.props.boxSelected ].pluginId &&
                    !isComplex(this.props.pluginToolbars[this.props.boxSelected ].pluginId));
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
        let name = (draggingFromRibbon) ? e.relatedTarget.getAttribute("name") : this.props.pluginToolbars[this.props.boxSelected].pluginId;
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

        let newInd = initialParams.container === 0 ? undefined : getIndexFromPoint(this.props.boxes, initialParams.parent, initialParams.container, e.dragEvent.clientX, e.dragEvent.clientY, forbidden, this.props.parentBox.id);
        initialParams.index = newInd;

        if (draggingFromRibbon) {
            let apiPlugin = Ediphy.Plugins.get(name);
            if (!apiPlugin) {
                return;
            }
            if (config.limitToOneInstance) {
                if (instanceExists(event.relatedTarget.getAttribute("name"))) {
                    let alert = (<Alert className="pageModal"
                        show
                        hasHeader
                        backdrop={false}
                        title={<span><i className="material-icons alert-warning" >
                                        warning</i>{i18n.t("messages.alert")}</span>}
                        closeButton onClose={() => {this.setState({ alert: null });}}>
                        <span> {i18n.t('messages.instance_limit')} </span>
                    </Alert>);
                    this.setState({ alert: alert });
                    return;
                }
            }

            let slide = this.props.parentBox.resizable;
            createBox(initialParams, name, slide, this.props.handleBoxes.onBoxAdded, this.props.boxes);

        } else if (!(config.isComplex && (initialParams.container === 0))) {
            let boxDragged = this.props.boxes[this.props.boxSelected];
            // If box being dragged is dropped in a different column or row, change its value
            if (this.props.parentBox.id !== this.props.boxSelected) {
                // initialParams.position = { type: 'relative', x: 0, y: 0 };
                this.props.handleBoxes.onBoxDropped(boxDragged.id, initialParams.row, initialParams.col, initialParams.parent,
                    initialParams.container, boxDragged.parent, boxDragged.container, initialParams.position, newInd);
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

    idConvert(id) {
        if (isSortableContainer(id)) {
            return id;
        }
        return ID_PREFIX_SORTABLE_CONTAINER + id;
    }
}

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
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object,
    /**
     * Current Box selected. If there isn't, -1
     */
    boxSelected: PropTypes.any,
    /**
     * Object containing every plugin toolbar (by id)
     */
    pluginToolbars: PropTypes.object,
    /**
     * Current page
     */
    page: PropTypes.any,
    /**
     * Collection of callbacks for boxes handling
     */
    handleBoxes: PropTypes.object,
    /**
     * Coordinates of the cell
     */
    extraParams: PropTypes.object,
    /**
     * Key of the rendered cell
     */
    keyCell: PropTypes.string,
    /**
     * Row
     */
    row: PropTypes.any,
    /**
     * Children
     */
    children: PropTypes.any,
};
