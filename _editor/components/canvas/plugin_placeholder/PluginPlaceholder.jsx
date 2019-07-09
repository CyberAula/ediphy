import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import interact from 'interactjs';
import Alert from './../../common/alert/Alert';
import EditorBox from '../editor_box/EditorBox';
import { RESIZE_SORTABLE_CONTAINER, ADD_BOX } from '../../../../common/actions';
import { isAncestorOrSibling, isBox, isSortableContainer } from '../../../../common/utils';
import Ediphy from '../../../../core/editor/main';
import i18n from 'i18next';
import './_pluginPlaceHolder.scss';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from '../../../../common/constants';
import { instanceExists, releaseClick, findBox, createBox } from '../../../../common/common_tools';

export default class PluginPlaceholder extends Component {

    state = {
        alert: null,
    };

    render() {
        let container = this.props.parentBox.sortableContainers[this.idConvert(this.props.pluginContainer)] || {};
        let className = "drg" + this.idConvert(this.props.pluginContainer);
        /* if(this.props.boxLevelSelected - this.props.parentBox.level === 1 &&
           isAncestorOrSibling(this.props.parentBox.id, this.props.boxSelected, this.props.boxes)) {
            className += " childBoxSelected";
        }*/
        container.style = container.style || {};
        return (
            <div style={
                Object.assign({}, {
                    width: "100%",
                    height: container.height ? (container.height === 'auto' ? container.height : container.height + 'px') : "",
                    minHeight: '2.3em',
                    textAlign: 'center',
                    lineHeight: '100%',
                    boxSizing: 'border-box',
                    position: 'relative',
                    display: 'table',
                }, container.style)
            }
            id={this.idConvert(this.props.pluginContainer)}
            className={className}>
                {container.colDistribution ? container.colDistribution.map((col, i) => {
                    if (container.cols[i]) {
                        return (<div key={i}
                            style={{ width: col + "%", height: '100%', display: "table-cell", verticalAlign: "top" }}>
                            {container.cols[i].map((row, j) => {
                                return (<div key={j}
                                    style={{ width: "100%", height: row + "%", position: 'relative' }}
                                    ref={e => {
                                        if(e !== null) {
                                            this.configureDropZone(
                                                ReactDOM.findDOMNode(e),
                                                ".rib, .dnd" /* + this.idConvert(this.props.pluginContainer)*/,
                                                {
                                                    i: i,
                                                    j: j,
                                                }
                                            );
                                        }
                                    }}>
                                    {this.state.alert}
                                    {container.children.map((idBox, index) => {
                                        if (this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                            return (<EditorBox id={idBox}
                                                key={index}
                                                boxes={this.props.boxes}
                                                handleBoxes={this.props.handleBoxes}
                                                handleMarks={this.props.handleMarks}
                                                boxSelected={this.props.boxSelected}
                                                boxLevelSelected={this.props.boxLevelSelected}
                                                containedViewSelected={this.props.containedViewSelected}
                                                pluginToolbars={this.props.pluginToolbars}
                                                lastActionDispatched={this.props.lastActionDispatched}
                                                markCreatorId={this.props.markCreatorId}
                                                onSortableContainerResized={this.props.onSortableContainerResized}
                                                onToolbarUpdated={this.props.onToolbarUpdated}
                                                page={this.props.page}
                                                pageType={this.props.pageType}
                                                marks={this.props.allMarks}
                                                containedViews={this.props.containedViews}
                                                setCorrectAnswer={this.props.setCorrectAnswer}
                                                onTextEditorToggled={this.props.onTextEditorToggled}/>);
                                        } else if (index === container.children.length - 1) {
                                            return (<span><br/><br/></span>);
                                        }
                                        return null;
                                    })}
                                    {container.children.length === 0 ? (<span><br/><br/></span>) : ""}
                                </div>);
                            })}
                        </div>);
                    }
                    return null;
                }) : <div/>}
            </div>
        );
    }
    isComplex(pluginName) {
        let plug = Ediphy.Plugins.get(pluginName);
        return plug && (plug.getConfig().isComplex || plug.getConfig().category === 'evaluation');
    }
    configureDropZone(node, selector, extraParams) {
        let alert = (msg)=>{return (<Alert className="pageModal"
            show
            hasHeader
            backdrop={false}
            title={ <span><i className="material-icons" style={{ fontSize: '1em', marginRight: '0.35em', color: 'yellow' }}>warning</i>{ i18n.t("messages.alert") }</span> }
            closeButton onClose={()=>{this.setState({ alert: null });}}>
            <span> {msg} </span>
        </Alert>);};
        interact(node).dropzone({
            accept: selector,
            overlap: 'pointer',
            ondropactivate: (e) => {

                let pluginDraggingFromRibbonIsNotComplex = e.relatedTarget.className.indexOf("rib") === -1 || !e.relatedTarget.getAttribute("name") ||
                  !this.isComplex(e.relatedTarget.getAttribute("name"));
                let pluginDraggingFromCanvasIsNotComplex = e.relatedTarget.className.indexOf("rib") !== -1 || (this.props.pluginToolbars[this.props.boxSelected ] &&
                  this.props.pluginToolbars[this.props.boxSelected ].pluginId &&
                  !this.isComplex(this.props.pluginToolbars[this.props.boxSelected ].pluginId));
                let notYourself = e.relatedTarget.className.indexOf("rib") !== -1 || this.props.parentBox.id !== this.props.boxSelected;

                if (notYourself && pluginDraggingFromRibbonIsNotComplex && pluginDraggingFromCanvasIsNotComplex) {
                    e.target.classList.add('drop-active');
                }
            },
            ondragenter: function(e) {
                e.target.classList.add("drop-target");
            },
            ondragleave: function(e) {
                e.target.classList.remove("drop-target");
            },
            ondrop: e => {

                e.dragEvent.stopPropagation();

                let clone = document.getElementById('clone');
                if (clone) {
                    clone.parentNode.removeChild(clone);
                }
                // If element dragged is coming from PluginRibbon, create a new EditorBox
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
                let newInd = initialParams.container === 0 ? undefined : this.getIndex(this.props.boxes, initialParams.parent, initialParams.container, e.dragEvent.clientX, e.dragEvent.clientY, forbidden, this.props.parentBox.id);
                initialParams.index = newInd;
                if (draggingFromRibbon) {
                    if (config.limitToOneInstance && instanceExists(config.name)) {
                        this.setState({ alert: alert(i18n.t('messages.instance_limit')) });
                        return;
                    }
                    let isSlide = this.props.parentBox.resizable;
                    createBox(initialParams, name, isSlide, this.props.handleBoxes.onBoxAdded, this.props.boxes);

                } else if (!(config.isComplex && (initialParams.container === 0))) {
                    let boxDragged = this.props.boxes[this.props.boxSelected];
                    // If box being dragged is dropped in a different column or row, change its value
                    if (this.props.parentBox.id !== this.props.boxSelected) {
                        // initialParams.position = { type: 'relative', x: 0, y: 0 };
                        this.props.handleBoxes.onBoxDropped(boxDragged.id, initialParams.row, initialParams.col, initialParams.parent,
                            initialParams.container, boxDragged.parent, boxDragged.container, initialParams.position, newInd);
                        return;
                    }
                }
            },
            ondropdeactivate: function(e) {
                e.target.classList.remove('drop-active');
                e.target.classList.remove("drop-target");
            },
        });
    }
    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this)).unset();
        interact(".editorBoxSortableContainer").unset();

    }
    componentDidMount() {
        interact(ReactDOM.findDOMNode(this))
            .resizable({
                enabled: false, // this.props.resizable,
                edges: { left: false, right: false, bottom: true, top: false },
                onmove: (event) => {
                    event.target.style.height = event.rect.height + 'px';
                },
                onend: (event) => {
                    // TODO Revew how to resize sortable containers
                    let toolbar = this.props.pluginToolbars[this.props.parentBox.id];
                    this.props.onSortableContainerResized(this.idConvert(this.props.pluginContainer), this.props.parentBox.id, parseInt(event.target.style.height, 10));
                    Ediphy.Plugins.get(toolbar.pluginId).forceUpdate(toolbar.state, this.props.parentBox.id, RESIZE_SORTABLE_CONTAINER);
                },
            });
    }

    getIndex(boxes, parent, container, x, y, forbidden, currentBox) {

        let rc = document.elementFromPoint(x, y);
        let children = boxes[parent].sortableContainers[container].children;
        let bid = releaseClick(rc, 'box-');
        let newInd = children.indexOf(bid);
        if (forbidden) {
            newInd = children.indexOf(currentBox);
        }
        return newInd === 0 ? 0 : ((newInd === -1 || newInd >= children.length) ? (children.length) : newInd);

    }
    idConvert(id) {
        if (isSortableContainer(id)) {
            return id;
        }
        return ID_PREFIX_SORTABLE_CONTAINER + id;

    }

    interactDrop = (e, extraParams) => {

        e.dragEvent.stopPropagation();

        let clone = document.getElementById('clone');
        if (clone) {
            clone.parentNode.removeChild(clone);
        }
        // If element dragged is coming from PluginRibbon, create a new EditorBox
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
        let newInd = initialParams.container === 0 ? undefined : this.getIndex(this.props.boxes, initialParams.parent, initialParams.container, e.dragEvent.clientX, e.dragEvent.clientY, forbidden, this.props.parentBox.id);
        initialParams.index = newInd;
        if (draggingFromRibbon) {
            if (config.limitToOneInstance && instanceExists(config.name)) {
                this.setState({ alert: alert(i18n.t('messages.instance_limit')) });
                return;
            }
            let isSlide = this.props.parentBox.resizable;
            createBox(initialParams, name, isSlide, this.props.handleBoxes.onBoxAdded, this.props.boxes);

        } else if (!(config.isComplex && (initialParams.container === 0))) {
            let boxDragged = this.props.boxes[this.props.boxSelected];
            // If box being dragged is dropped in a different column or row, change its value
            if (this.props.parentBox.id !== this.props.boxSelected) {
                // initialParams.position = { type: 'relative', x: 0, y: 0 };
                this.props.handleBoxes.onBoxDropped(boxDragged.id, initialParams.row, initialParams.col, initialParams.parent,
                    initialParams.container, boxDragged.parent, boxDragged.container, initialParams.position, newInd);
                return;
            }
        }
    }
}

PluginPlaceholder.propTypes = {
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
     * Selected box level (only plugins inside plugins)
     */
    boxLevelSelected: PropTypes.any,
    /**
     * Object containing every plugin toolbar (by id)
     */
    pluginToolbars: PropTypes.object,
    /**
     * Last action dispatched in Redux
     */
    lastActionDispatched: PropTypes.any,
    /**
     * Selected contained view (by ID)
     */
    containedViewSelected: PropTypes.any,
    /**
     * Callback for resizing a sortable container
     */
    onSortableContainerResized: PropTypes.func,
    /**
     * Callback for toggling CKEditor
     */
    onTextEditorToggled: PropTypes.func,
    /**
      * Identifier of the box that is creating a mark
      */
    markCreatorId: PropTypes.any,
    /**
     *  View type
     */
    pageType: PropTypes.string,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object,
    /**
     * Sets the correct answer of an exercise
     */
    setCorrectAnswer: PropTypes.func,
    /**
     * Current page
     */
    page: PropTypes.any,
    /**
     * Object containing all the marks in the course
     */
    allMarks: PropTypes.object,
    /**
   * Function that updates the toolbar of a view
   */
    onToolbarUpdated: PropTypes.func,
    /**
     * Collection of callbacks for boxes handling
     */
    handleBoxes: PropTypes.object.isRequired,
    /**
     * Collection of callbacks for marks handling
     */
    handleMarks: PropTypes.object.isRequired,
};
