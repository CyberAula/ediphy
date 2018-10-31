import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Button, OverlayTrigger, Popover, Tooltip, Overlay } from 'react-bootstrap';
import interact from 'interactjs';
import Alert from './../../common/alert/Alert';
import EditorBox from '../editor_box/EditorBox';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from '../../../../common/constants';
import { ADD_BOX } from '../../../../common/actions';
import { isSortableBox, isBox } from '../../../../common/utils';
import Ediphy from '../../../../core/editor/main';
import i18n from 'i18next';

import './_editorBoxSortable.scss';
import { instanceExists, releaseClick, findBox, createBox } from '../../../../common/common_tools';

/**
 * EditorBoxSortable Component
 * @desc It is a special kind of EditorBox that is automatically added when a document is created. It cannot be moved or resized and it takes up the whole width of the page. It has different 'rows', named SortableContainers, where plugins are displayed, that can be sorted.
 */
export default class EditorBoxSortable extends Component {
    /**
     * Constructor
     * @param props React component props
     */
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         * @type {{alert: null}}
         */
        this.state = {
            alert: null,
        };
        this.getNewIndex = this.getNewIndex.bind(this);
    }
    /**
     * Renders React Component
     * @returns {code} React rendered component
     */
    render() {
        let box = this.props.boxes[this.props.id];
        return (
            <div className="editorBoxSortable"
                onMouseDown={e => {
                    if (e.target === e.currentTarget || e.target.classList.contains('colDist-j')) {
                        if(box.children.length !== 0) {
                            this.props.onBoxSelected(this.props.id);
                        }
                    }
                    e.stopPropagation();
                }}>
                <div ref="sortableContainer"
                    className={(this.props.id === this.props.boxSelected && box.children.length > 0) ? ' selectedBox sortableContainerBox' : ' sortableContainerBox'}
                    style={{ position: 'relative', boxSizing: 'border-box' }}>
                    {this.state.alert}
                    {box.children.map((idContainer, index)=> {
                        let container = box.sortableContainers[idContainer];
                        return (<div key={'sortableContainer-' + index}
                            className={"editorBoxSortableContainer pos_relative " + container.style.className}
                            data-id={idContainer}
                            id={idContainer}
                            ref={idContainer}
                            style={
                                Object.assign({}, {
                                    height: container.height === 'auto' ? container.height : container.height + 'px',
                                }, container.style)
                            }>
                            <div className="disp_table width100 height100" style={{ minHeight: '100px' }}>
                                {container.colDistribution.map((col, i) => {
                                    if (container.cols[i]) {
                                        return (<div key={i}
                                            className={"colDist-i height100 disp_table_cell vert_al_top colNum" + i}
                                            style={{ width: col + "%" }}>
                                            {container.cols[i].map((row, j) => {
                                                return (<div key={j}
                                                    className={"colDist-j width100 pos_relative rowNum" + j}
                                                    style={{ height: row + "%", minHeight: parseInt(100 / (container.cols[i].length), 10) + 'px' }}
                                                    ref={e => {
                                                        if(e !== null) {
                                                            this.configureDropZone(
                                                                ReactDOM.findDOMNode(e),
                                                                "cell",
                                                                ".rib, .dnd", // + idContainer,
                                                                {
                                                                    idContainer: idContainer,
                                                                    i: i,
                                                                    j: j,
                                                                }
                                                            );
                                                        }
                                                    }}>
                                                    {container.children.map((idBox, ind) => {
                                                        if (this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                                            return (<EditorBox id={idBox}
                                                                key={'box-' + idBox}
                                                                boxes={this.props.boxes}
                                                                boxSelected={this.props.boxSelected}
                                                                boxLevelSelected={this.props.boxLevelSelected}
                                                                containedViews={this.props.containedViews}
                                                                containedViewSelected={this.props.containedViewSelected}
                                                                pluginToolbars={this.props.pluginToolbars}
                                                                lastActionDispatched={this.props.lastActionDispatched}
                                                                addMarkShortcut={this.props.addMarkShortcut}
                                                                deleteMarkCreator={this.props.deleteMarkCreator}
                                                                exercises={(this.props.page && this.props.exercises[this.props.page]) ? (this.props.exercises[this.props.page].exercises[idBox]) : undefined}
                                                                markCreatorId={this.props.markCreatorId}
                                                                marks={this.props.marks}
                                                                onBoxAdded={this.props.onBoxAdded}
                                                                onBoxSelected={this.props.onBoxSelected}
                                                                onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                                                onRichMarkMoved={this.props.onRichMarkMoved}
                                                                onBoxMoved={this.props.onBoxMoved}
                                                                onToolbarUpdated={this.props.onToolbarUpdated}
                                                                onBoxResized={this.props.onBoxResized}
                                                                onBoxDropped={this.props.onBoxDropped}
                                                                onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                                                onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                                                onSortableContainerResized={this.props.onSortableContainerResized}
                                                                onTextEditorToggled={this.props.onTextEditorToggled}
                                                                onRichMarksModalToggled={this.props.onRichMarksModalToggled}
                                                                page={this.props.page}
                                                                setCorrectAnswer={this.props.setCorrectAnswer}
                                                                pageType={this.props.pageType}/>);

                                                        } else if (ind === container.children.length - 1) {
                                                            return (<span key={ind}><br/><br/></span>);
                                                        }

                                                        return null;
                                                    })}
                                                    {container.children.length === 0 ? (<div key={-1} style={{ height: '46px' }}/>) : null }
                                                </div>);
                                            })}
                                        </div>);
                                    }

                                    return null;
                                })}
                            </div>

                            <div className="sortableMenu width100 over_hidden">
                                <div className="iconsOverBar float_left pos_absolute bottom0">
                                    { box.children.length > 1 ? <OverlayTrigger placement="top" overlay={
                                        <Tooltip id="deleteTooltip">{i18n.t('Reorder')}
                                        </Tooltip>}>
                                        <i className="material-icons drag-handle btnOverBar">swap_vert</i>
                                    </OverlayTrigger> : null }

                                    <Overlay rootClose
                                        show={this.state.show === idContainer}
                                        placement="top"
                                        container={this/* .refs[idContainer]*/}
                                        target={() => ReactDOM.findDOMNode(this.refs['btn-' + idContainer])}
                                        onHide={() => {this.setState({ show: this.state.show === idContainer ? false : this.state.show });}}>
                                        <Popover id="popov" title={i18n.t("delete_container")}>
                                            <i style={{ color: 'yellow', fontSize: '13px', padding: '0 5px' }} className="material-icons">warning</i>
                                            { i18n.t("messages.delete_container") }
                                            <br/>
                                            <br/>
                                            <Button className="popoverButton"
                                                style={{ float: 'right' }}
                                                onClick={e => {
                                                    this.props.onSortableContainerDeleted(idContainer, box.id);
                                                    e.stopPropagation();
                                                    this.setState({ show: false });
                                                }} >
                                                {i18n.t("Accept")}
                                            </Button>
                                            <Button className="popoverButton"
                                                style={{ float: 'right' }}
                                                onClick={() => {this.setState({ show: false });}}>
                                                {i18n.t("Cancel")}
                                            </Button>
                                        </Popover>
                                    </Overlay>
                                    <OverlayTrigger placement="top" container={this} overlay={
                                        <Tooltip id="deleteTooltip">{i18n.t('delete')}
                                        </Tooltip>}>
                                        <Button
                                            onClick={() => {this.setState({ show: idContainer });}}
                                            ref={'btn-' + idContainer}
                                            className="material-icons delete-sortable btnOverBar">delete</Button>
                                    </OverlayTrigger>

                                </div>

                            </div>
                        </div>);
                    })}
                </div>

                <div className="dragContentHere" data-html2canvas-ignore
                    // style={{ backgroundColor: this.props.background }}
                    onClick={e => {
                        this.props.onBoxSelected(-1);
                        e.stopPropagation();}}>{i18n.t("messages.drag_content")}
                </div>

            </div>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        this.props.boxes[this.props.id].children.map(id => {
            // this.configureResizable(this.refs[id]);
        });
    }

    componentDidMount() {
        this.configureDropZone(ReactDOM.findDOMNode(this), "newContainer", ".rib");
        // this.configureDropZone(".editorBoxSortableContainer", "existingContainer", ".rib");

        this.props.boxes[this.props.id].children.map(id => {
            // this.configureResizable(this.refs[id]);
        });

        let list = jQuery(this.refs.sortableContainer);
        list.sortable({
            handle: '.drag-handle',
            start: (event, ui) => {
                // Hide EditorShortcuts
                let bar = this.props.containedViewSelected === 0 ?
                    document.getElementById('editorBoxIcons') :
                    document.getElementById('contained_editorBoxIcons');

                if (bar !== null) {
                    bar.classList.add('hidden');
                }
            },
            stop: (event, ui) => {

                let indexes = [];
                let children = list[0].children;
                for (let i = 0; i < children.length; i++) {
                    indexes.push(children[i].getAttribute("data-id"));
                }
                if (indexes.length !== 0) {
                    this.props.onSortableContainerReordered(indexes, this.props.id);
                }
                list.sortable('cancel');
                // Unhide EditorShortcuts
                let bar = this.props.containedViewSelected === 0 ?
                    document.getElementById('editorBoxIcons') :
                    document.getElementById('contained_editorBoxIcons');
                if (bar !== null) {
                    bar.classList.remove('hidden');
                }
                let ev;
                // window.dispatchEvent(new Event('resize'));
                // if(typeof(Event) === 'function') {
                //   ev = new Event('resize')
                // }else{
                ev = document.createEvent('Event');
                ev.initEvent('resize', true, true);
                // }
                window.dispatchEvent(ev);
            },
        });
    }

    configureResizable(item) {
        interact(item).resizable({
            enabled: this.props.id === this.props.boxSelected && item.style.height !== "auto",
            edges: { left: false, right: false, bottom: true, top: false },
            autoScroll: {
                container: document.getElementById('canvas'),
                margin: 50,
                distance: 0,
                interval: 0,
            },
            onmove: (event) => {
                event.target.style.height = event.rect.height + 'px';
            },
            onend: (event) => {
                this.props.onSortableContainerResized(event.target.getAttribute("data-id"), this.props.id, parseInt(event.target.style.height, 10));
            },
        });
    }

    configureDropZone(node, dropArea, selector, extraParams) {
        interact(node).dropzone({
            accept: selector,
            overlap: 'pointer',
            ondropactivate: function(e) {
                e.target.classList.add('drop-active');
            },
            ondragenter: function(e) {
                e.target.classList.add("drop-target");
            },
            ondragleave: function(e) {
                e.target.classList.remove("drop-target");
            },
            ondrop: function(e) {
                let draggingFromRibbon = e.relatedTarget.className.indexOf("rib") !== -1;
                let clone = document.getElementById('clone');
                if (clone) {
                    clone.parentNode.removeChild(clone);
                }
                let name = e.relatedTarget.getAttribute("name");
                let newInd = extraParams ? this.getNewIndex(e.dragEvent.clientX, e.dragEvent.clientY, this.props.id, extraParams.idContainer, extraParams.i, extraParams.j) : 0;
                if (isSortableBox(this.props.id) && Ediphy.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().limitToOneInstance) {
                    if (draggingFromRibbon && instanceExists(e.relatedTarget.getAttribute("name"))) {
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

                        e.dragEvent.stopPropagation();
                        return;
                    }
                }
                let page = this.props.page;
                if (dropArea === 'cell') {
                    // If element dragged is coming from PluginRibbon, create a new EditorBox
                    if (draggingFromRibbon) {
                        // Check if there is a limit in the number of plugin instances
                        let initialParams = {
                            parent: this.props.id,
                            container: extraParams.idContainer,
                            col: extraParams.i,
                            row: extraParams.j,
                            index: newInd,
                            page: page,
                            id: (ID_PREFIX_BOX + Date.now()),
                        };
                        createBox(initialParams, name, false, this.props.onBoxAdded, this.props.boxes);
                        e.dragEvent.stopPropagation();
                    } else {
                        let boxDragged = this.props.boxes[this.props.boxSelected];
                        if (boxDragged) {
                            this.props.onBoxDropped(this.props.boxSelected,
                                extraParams.j,
                                extraParams.i,
                                this.props.id,
                                extraParams.idContainer,
                                boxDragged.parent, boxDragged.container, undefined, newInd);
                        }

                        for (let b in this.props.boxes) {
                            let dombox = findBox(b);
                            if (dombox) {
                                dombox.style.opacity = 1;
                            }
                        }

                    }
                } else {

                    let initialParams = {};
                    if (dropArea === 'existingContainer') {
                        initialParams = {
                            parent: this.props.id,
                            container: e.target.getAttribute("data-id"),
                            index: newInd,
                            page,

                        };
                    } else if (dropArea === 'newContainer') {
                        initialParams = {
                            parent: this.props.id,
                            container: ID_PREFIX_SORTABLE_CONTAINER + Date.now(),
                            index: newInd,
                            page,
                        };
                    }
                    initialParams.id = (ID_PREFIX_BOX + Date.now());
                    initialParams.name = name;
                    createBox(initialParams, name, false, this.props.onBoxAdded, this.props.boxes);
                    e.dragEvent.stopPropagation();

                }

            }.bind(this),
            ondropdeactivate: function(e) {
                e.target.classList.remove('drop-active');
                e.target.classList.remove("drop-target");
            },
        });
    }

    getNewIndex(x, y, parent, container, i, j) {
        let el = document.elementFromPoint(x, y);
        let rc = releaseClick(el, 'box-');
        let children = this.props.boxes[parent].sortableContainers[container].children.filter(box=>{return this.props.boxes[box].row === j && this.props.boxes[box].col === i;});
        if (rc) {
            let newInd = children.indexOf(rc);
            return newInd === 0 ? 0 : ((newInd === -1 || newInd >= children.length) ? (children.length) : newInd);
        }

        let sameHeight = [];
        let maxRowHeight = 0;
        let curRowTop = 0;
        let coordArr = [];
        let newRow = [];
        children.forEach((child, ind) => {
            let coords = (this.offset(child));
            if ((curRowTop !== coords.top && curRowTop !== 0)) {
                coordArr.push({ top: curRowTop, maxRowHeight, cols: newRow });
                curRowTop = coords.top;
                newRow = [];
                maxRowHeight = 0;
            }
            if(curRowTop === 0) {
                curRowTop = coords.top;
            }
            if (maxRowHeight < coords.height) {
                maxRowHeight = coords.height;
            }
            newRow.push(coords);
            if (ind === children.length - 1) {
                coordArr.push({ top: curRowTop, maxRowHeight, cols: newRow });
            }
        });
        coordArr.map((r, inx)=>{
            if (inx === 0 && y < r.top) {
                sameHeight = r.cols;
            }
            if (r.top < y && y < (r.top + r.maxRowHeight)) {
                sameHeight = r.cols;
            }
            if ((inx === (coordArr.length - 1)) && y > (r.top + r.maxRowHeight)) {
                sameHeight = r.cols;
            }
        });

        sameHeight.sort((a, b)=> a.left > b.left);
        let closestBox = sameHeight[0] || rc;
        sameHeight.map((box, inx) => {
            if (inx === 0 && x < box.left) {
                closestBox = children.indexOf(box.id);
            }
            if (box.left < x && x < (box.left + box.width)) {
                closestBox = children.indexOf(box.id);
            }
            if ((inx === sameHeight.length - 1) && (x > box.left + box.width)) {
                closestBox = children.indexOf(box.id);
            }
        });
        return closestBox || 0;

    }

    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this)).unset();
        interact(".editorBoxSortableContainer").unset();
    }

    offset(id) {
        let el = document.getElementById('box-' + id);
        let rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {
            id,
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft,
            width: el.clientWidth,
            height: el.clientHeight };
    }

}

EditorBoxSortable.propTypes = {
    /**
     * Box unique identifier
     */
    id: PropTypes.string.isRequired,
    /**
     * Object that holds all the boxes, (identified by its ID)
     */
    boxes: PropTypes.object.isRequired,
    /**
     *  Box selected. If there is none selected the value is, -1
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Depth level of the selected box. Used when there are plugins inside plugins
     */
    boxLevelSelected: PropTypes.number.isRequired,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Selected contained view
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Object containing all the toolbars (identified by its ID)
     */
    pluginToolbars: PropTypes.object.isRequired,
    /**
     * Last action dispatched in Redux
     */
    lastActionDispatched: PropTypes.any.isRequired,
    /**
     * Callback for when adding a mark
     */
    addMarkShortcut: PropTypes.func.isRequired,
    /**
     * Callback for deleting mark creator overlay
     */
    deleteMarkCreator: PropTypes.func.isRequired,
    /**
     * Identifier of the box that is currently in process of creating a mark
     */
    markCreatorId: PropTypes.any.isRequired,
    /**
     * Callback for adding a box
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * Selects a box
     */
    onBoxSelected: PropTypes.func.isRequired,
    /**
     * Increases box level selected
     */
    onBoxLevelIncreased: PropTypes.func.isRequired,
    /**
     * Callback for when moving a box
     */
    onBoxMoved: PropTypes.func.isRequired,
    /**
     * Callback for when resizing a box
     */
    onBoxResized: PropTypes.func.isRequired,
    /**
     * Callback for when dropping a box
     */
    onBoxDropped: PropTypes.func.isRequired,
    /**
     * Callback for when vertically aligning boxes inside a container
     */
    onVerticallyAlignBox: PropTypes.func.isRequired,
    /**
     * Callback for when reordering boxes inside a container
     */
    onBoxesInsideSortableReorder: PropTypes.func.isRequired,
    /**
     * Callback for when deleting a sortable container
     */
    onSortableContainerDeleted: PropTypes.func.isRequired,
    /**
     * Callback for when reordering sortable containers
     */
    onSortableContainerReordered: PropTypes.func.isRequired,
    /**
     * Callback for when resizing a sortable container
     */
    onSortableContainerResized: PropTypes.func.isRequired,
    /**
     * Callback for toggling the CKEditor
     */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
     * Page type the box is at
     */
    pageType: PropTypes.string.isRequired,
    /**
     * Callback for toggling the Rich Marks Modal
     */
    onRichMarksModalToggled: PropTypes.func.isRequired,
    /**
     * Callback for moving marks
     */
    onRichMarkMoved: PropTypes.func.isRequired,
    /**
     * Object containing all exercises
     */
    exercises: PropTypes.object,
    /**
     * Function for setting the right answer of an exercise
     */
    setCorrectAnswer: PropTypes.func.isRequired,
    /**
     * Current page
     */
    page: PropTypes.any,
    /**
     * Object containing box marks
     */
    marks: PropTypes.object,
    /**
     * Function that updates the toolbar of a view
     */
    onToolbarUpdated: PropTypes.func,
};
