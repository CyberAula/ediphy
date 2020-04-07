import React, { Component } from 'react';
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import interact from "interactjs";
import { connect } from "react-redux";

import Ediphy from "../../../../core/editor/main";
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from "../../../../common/constants";
import {
    getNewIndex,
    isSortableBox,
    isSortableContainer,
} from "../../../../common/utils";
import { createBox, findBox, instanceExists, releaseClick } from "../../../../common/commonTools";
import handleBoxes from "../../../handlers/handleBoxes";
import Alert from "../../common/alert/Alert";

class SortableCell extends Component {
    h = handleBoxes(this);
    render = () => (
        <div className={"colDist-j width100 pos_relative rowNum" + this.props.row} style={this.props.cellStyle}>
            {this.props.children}
        </div>);

    componentDidMount() {
        interact(ReactDOM.findDOMNode(this)).dropzone({
            accept: '.rib, .dnd',
            overlap: 'pointer',
            ondropactivate: e => {
                e.target.classList.add('drop-active');
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
        let clone = document.getElementById('clone');
        if (clone) {
            clone.parentNode.removeChild(clone);
        }
        let name = e.relatedTarget.getAttribute("name");
        let newInd = extraParams ? getNewIndex(e.dragEvent.clientX, e.dragEvent.clientY, this.props.parent, extraParams.idContainer, extraParams.i, extraParams.j, this.props.boxesById) : 0;

        if (isSortableBox(this.props.parent) && Ediphy.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().limitToOneInstance) {
            if (draggingFromRibbon && instanceExists(e.relatedTarget.getAttribute("name"))) {
                let alert = (<Alert className="pageModal"
                    show
                    hasHeader
                    backdrop={false}
                    title={<span><i className="material-icons alert-warning" >
                                warning</i>{i18n.t("messages.alert")}</span>}
                    closeButton onClose={this.props.onAlertClose}>
                    <span> {i18n.t('messages.instance_limit')} </span>
                </Alert>);
                this.props.setAlert(alert);
                e.dragEvent.stopPropagation();
                return;
            }
        }
        let page = this.props.page;

        // If element dragged is coming from PluginRibbon, create a new EditorBox
        if (draggingFromRibbon) {
            // Check if there is a limit in the number of plugin instances
            let initialParams = {
                parent: this.props.parent,
                container: extraParams.idContainer,
                col: extraParams.i,
                row: extraParams.j,
                index: newInd,
                page: page,
                id: (ID_PREFIX_BOX + Date.now()),
            };
            createBox(initialParams, name, false, this.h.onBoxAdded, this.props.boxesById);
        } else {
            let boxDragged = this.props.boxesById[this.props.boxSelected];
            if (boxDragged) {
                this.h.onBoxDropped(
                    this.props.boxSelected,
                    extraParams.j,
                    extraParams.i,
                    this.props.parent,
                    extraParams.idContainer,
                    boxDragged.parent, boxDragged.container, { type: 'relative', x: 0, y: 0 }, newInd);
            }

            for (let b in this.props.boxesById) {
                let dombox = findBox(b);
                if (dombox) {
                    dombox.style.opacity = '1';
                }
            }

        }
        e.dragEvent.stopPropagation();
        e.stopPropagation();
        e.preventDefault();
    };

    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this)).unset();
        interact(".editorBoxSortableContainer").unset();
    }

    idConvert = (id) => isSortableContainer(id) ? id : ID_PREFIX_SORTABLE_CONTAINER + id;
}

function mapStateToProps(state) {
    const { boxesById, boxSelected } = state.undoGroup.present;
    return {
        boxesById,
        boxSelected,
    };
}

export default connect(mapStateToProps)(SortableCell);

SortableCell.propTypes = {
    /**
     * Object containing all created boxesById (by id)
     */
    boxesById: PropTypes.object,
    /**
     * Current Box selected. If there isn't, -1
     */
    boxSelected: PropTypes.any,
    /**
     * Current page
     */
    page: PropTypes.any,
    /**
     * Parent of cell
     */
    parent: PropTypes.any,
    /**
     * Coordinates of the SortableCell
     */
    extraParams: PropTypes.object,
    /**
     * Display alert modal
     */
    setAlert: PropTypes.func,
    /**
     * Close alert modal
     */
    onAlertClose: PropTypes.func,
    /**
     * Children
     */
    children: PropTypes.any,
};
