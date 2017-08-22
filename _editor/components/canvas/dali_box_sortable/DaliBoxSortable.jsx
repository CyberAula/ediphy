import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import interact from 'interact.js';
import Alert from './../../common/alert/Alert';
import DaliBox from '../dali_box/DaliBox';
import { ID_PREFIX_SORTABLE_CONTAINER } from '../../../../constants';
import { ADD_BOX } from '../../../../actions';
import { isSortableBox } from '../../../../utils';
import Dali from './../../../../core/main';
import i18n from 'i18next';

require('./_daliBoxSortable.scss');

export default class DaliBoxSortable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: null,
        };
    }
    render() {
        let box = this.props.boxes[this.props.id];
        return (
            <div className="daliBoxSortable"
                onClick={e => {
                    if(box.children.length !== 0) {
                        this.props.onBoxSelected(this.props.id);
                    }
                    e.stopPropagation();
                }}>
                <div ref="sortableContainer"
                    className={(this.props.id === this.props.boxSelected && box.children.length > 0) ? ' selectedBox' : ' '}
                    style={{
                        position: 'relative',
                        boxSizing: 'border-box',
                    }}>
                    {this.state.alert}
                    {box.children.map((idContainer, index)=> {
                        let container = box.sortableContainers[idContainer];
                        return (<div key={index}
                            className={"daliBoxSortableContainer pos_relative " + container.style.className}
                            data-id={idContainer}
                            id={idContainer}
                            ref={idContainer}
                            style={
                                Object.assign({}, {
                                    height: container.height === 'auto' ? container.height : container.height + 'px',
                                }, container.style)
                            }>
                            <div className="disp_table width100 height100">
                                {container.colDistribution.map((col, i) => {
                                    if (container.cols[i]) {
                                        return (<div key={i}
                                            className="colDist-i height100 disp_table_cell vert_al_top"
                                            style={{ width: col + "%" }}>
                                            {container.cols[i].map((row, j) => {
                                                return (<div key={j}
                                                    className="colDist-j width100 pos_relative"
                                                    style={{ height: row + "%" }}
                                                    ref={e => {
                                                        if(e !== null) {
                                                            this.configureDropZone(
                                                                ReactDOM.findDOMNode(e),
                                                                "cell",
                                                                ".rib, .dnd" + idContainer,
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
                                                            return (<DaliBox id={idBox}
                                                                key={ind}
                                                                boxes={this.props.boxes}
                                                                boxSelected={this.props.boxSelected}
                                                                boxLevelSelected={this.props.boxLevelSelected}
                                                                containedViews={this.props.containedViews}
                                                                containedViewSelected={this.props.containedViewSelected}
                                                                toolbars={this.props.toolbars}
                                                                lastActionDispatched={this.props.lastActionDispatched}
                                                                addMarkShortcut={this.props.addMarkShortcut}
                                                                deleteMarkCreator={this.props.deleteMarkCreator}
                                                                markCreatorId={this.props.markCreatorId}
                                                                onBoxAdded={this.props.onBoxAdded}
                                                                onBoxSelected={this.props.onBoxSelected}
                                                                onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                                                onBoxMoved={this.props.onBoxMoved}
                                                                onBoxResized={this.props.onBoxResized}
                                                                onBoxDropped={this.props.onBoxDropped}
                                                                onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                                                onBoxModalToggled={this.props.onBoxModalToggled}
                                                                onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                                                onSortableContainerResized={this.props.onSortableContainerResized}
                                                                onTextEditorToggled={this.props.onTextEditorToggled}
                                                                pageType={this.props.pageType}/>);

                                                        } else if (ind === container.children.length - 1) {
                                                            return (<span key={ind}><br/><br/></span>);
                                                        }
                                                        return null;
                                                    })}
                                                </div>);
                                            })}
                                        </div>);
                                    }

                                    return null;
                                })}
                            </div>

                            <div className="sortableMenu width100 over_hidden">
                                <div className="iconsOverBar float_left pos_absolute bottom0">
                                    <OverlayTrigger placement="top" overlay={
                                        <Tooltip id="deleteTooltip">{i18n.t('Reorder')}
                                        </Tooltip>}>
                                        <i className="material-icons drag-handle btnOverBar">swap_vert</i>
                                    </OverlayTrigger>

                                    <OverlayTrigger trigger={["focus"]} placement="top" overlay={
                                        <Popover id="popov" title={i18n.t("delete_container")}>
                                            <i style={{ color: 'yellow', fontSize: '13px', padding: '0 5px' }} className="material-icons">warning</i>
                                            {
                                                i18n.t("messages.delete_container")
                                            }
                                            <br/>
                                            <br/>
                                            <Button className="popoverButton"
                                                style={{ float: 'right' }}
                                                onClick={e => {
                                                    this.props.onSortableContainerDeleted(idContainer, box.id);
                                                    e.stopPropagation();
                                                }}>
                                                {i18n.t("Accept")}
                                            </Button>
                                            <Button className="popoverButton"
                                                style={{ float: 'right' }} >
                                                {i18n.t("Cancel")}
                                            </Button>
                                        </Popover>}>
                                        <OverlayTrigger placement="top" overlay={
                                            <Tooltip id="deleteTooltip">{i18n.t('delete')}
                                            </Tooltip>}>
                                            <Button className="material-icons delete-sortable btnOverBar">delete</Button>
                                        </OverlayTrigger>
                                    </OverlayTrigger>

                                </div>

                            </div>
                        </div>);
                    })}
                </div>

                <div className="dragContentHere"
                    onClick={e => {
                        this.props.onBoxSelected(-1);
                        e.stopPropagation();}}>{i18n.t("messages.drag_content")}
                </div>

            </div>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        this.props.boxes[this.props.id].children.map(id => {
            this.configureResizable(this.refs[id]);
        });
    }

    componentDidMount() {
        this.configureDropZone(ReactDOM.findDOMNode(this), "newContainer", ".rib");
        this.configureDropZone(".daliBoxSortableContainer", "existingContainer", ".rib");

        this.props.boxes[this.props.id].children.map(id => {
            this.configureResizable(this.refs[id]);
        });

        let list = jQuery(this.refs.sortableContainer);
        list.sortable({
            handle: '.drag-handle',
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

                if (dropArea === 'cell') {
                    // If element dragged is coming from PluginRibbon, create a new DaliBox
                    if (e.relatedTarget.className.indexOf("rib") !== -1) {
                        // Check if there is a limit in the number of plugin instances
                        if (isSortableBox(this.props.id) && Dali.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().limitToOneInstance) {
                            for (let child in this.props.boxes) {
                                if (!isSortableBox(child) && this.props.boxes[child].parent === this.props.id && this.props.toolbars[child].config.name === e.relatedTarget.getAttribute("name")) {
                                    let alert = (<Alert className="pageModal"
                                        show
                                        hasHeader
                                        backdrop={false}
                                        title={ <span><i className="material-icons" style={{ fontSize: '14px', marginRight: '5px' }}>warning</i>{ i18n.t("messages.alert") }</span> }
                                        closeButton onClose={()=>{this.setState({ alert: null });}}>
                                        <span> {i18n.t('messages.instance_limit')} </span>
                                    </Alert>);
                                    this.setState({ alert: alert });
                                    e.dragEvent.stopPropagation();
                                    return;
                                }
                            }
                        }
                        let initialParams = {
                            parent: this.props.id,
                            container: extraParams.idContainer,
                            col: extraParams.i,
                            row: extraParams.j,
                        };
                        Dali.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().callback(initialParams, ADD_BOX);
                    } else {
                        let boxDragged = this.props.boxes[this.props.boxSelected];
                        // If box being dragged is dropped in a different column or row, change it's value
                        if (boxDragged && (boxDragged.col !== extraParams.i || boxDragged.row !== extraParams.j)) {
                            this.props.onBoxDropped(this.props.boxSelected, extraParams.j, extraParams.i);
                        }

                        let clone = document.getElementById('clone');
                        clone.parentElement.removeChild(clone);
                    }
                } else {
                    let initialParams = {};
                    if (dropArea === 'existingContainer') {
                        initialParams = {
                            parent: this.props.id,
                            container: e.target.getAttribute("data-id"),
                        };
                    } else if (dropArea === 'newContainer') {
                        initialParams = {
                            parent: this.props.id,
                            container: ID_PREFIX_SORTABLE_CONTAINER + Date.now(),
                        };
                    }

                    Dali.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().callback(initialParams, ADD_BOX);
                    e.dragEvent.stopPropagation();
                }
            }.bind(this),
            ondropdeactivate: function(e) {
                e.target.classList.remove('drop-active');
                e.target.classList.remove("drop-target");
            },
        });
    }
    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this)).unset();
    }
}
