import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import interact from 'interact.js';
import DaliBox from '../dali_box/DaliBox';
import {ID_PREFIX_SORTABLE_CONTAINER} from '../../../constants';
import {ADD_BOX} from '../../../actions';
import Dali from './../../../core/main';
import i18n from 'i18next';

export default class DaliBoxSortable extends Component {
    render() {
        let box = this.props.boxes[this.props.id];
        return (
            /* jshint ignore:start */
            <div className="daliBoxSortable" onClick={e => {
                if(box.children.length != 0) {
                    this.props.onBoxSelected(this.props.id);
                }
                e.stopPropagation();
            }}>
                <div ref="sortableContainer"
                     className={(this.props.id === this.props.boxSelected && box.children.length > 0) ? ' selectedBox':' '}
                     style={{
                     position: 'relative',
                     boxSizing: 'border-box'
                }}>
                    {box.children.map((idContainer, index)=> {
                        let container = box.sortableContainers[idContainer];
                        return (<div key={index}
                                     className="daliBoxSortableContainer"
                                     data-id={idContainer}
                                     id={idContainer}
                                     ref={idContainer}
                                     style={
                                        Object.assign({},{
                                            width: '100%',
                                            height: container.height == 'auto' ? container.height : container.height + 'px',
                                            minHeight: '70px',
                                            textAlign: 'center',
                                            lineHeight: '100%',
                                            boxSizing: 'border-box',
                                            position: 'relative'
                                        },container.style)
                                     }>
                            <div style={{display: "table", width: "100%", height: "100%"}}>
                                {container.colDistribution.map((col, i) => {
                                    if (container.cols[i]) {
                                        return (<div key={i}
                                                     style={{width: col + "%", height: '100%', display: "table-cell", verticalAlign: "top"}}>
                                            {container.cols[i].map((row, j) => {
                                                return (<div key={j}
                                                             style={{width: "100%", height: row + "%", position: 'relative'}}
                                                             ref={e => {
                                                                    if(e !== null){
                                                                        this.configureDropZone(
                                                                            ReactDOM.findDOMNode(e),
                                                                            "cell",
                                                                            ".rib, .dnd" + idContainer,
                                                                            {
                                                                                idContainer: idContainer,
                                                                                i: i,
                                                                                j: j
                                                                            }
                                                                        );
                                                                    }
                                                              }}>
                                                    {container.children.map((idBox, index) => {
                                                        if (this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                                            return (<DaliBox id={idBox}
                                                                             key={index}
                                                                             boxes={this.props.boxes}
                                                                             boxSelected={this.props.boxSelected}
                                                                             boxLevelSelected={this.props.boxLevelSelected}
                                                                             containedViewSelected={this.props.containedViewSelected}
                                                                             toolbars={this.props.toolbars}
                                                                             lastActionDispatched={this.props.lastActionDispatched}
                                                                             onBoxSelected={this.props.onBoxSelected}
                                                                             onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                                                             onBoxMoved={this.props.onBoxMoved}
                                                                             onBoxResized={this.props.onBoxResized}
                                                                             onBoxDropped={this.props.onBoxDropped}
                                                                             onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                                                             onBoxModalToggled={this.props.onBoxModalToggled}
                                                                             onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                                                             onSortableContainerResized={this.props.onSortableContainerResized}
                                                                             onTextEditorToggled={this.props.onTextEditorToggled}/>);

                                                        } else if (index == container.children.length - 1) {
                                                            return (<span key={index}><br /><br /></span>);
                                                        }
                                                    })}
                                                    {
                                                        container.children.length === 0 ? (
                                                            <Button style={{position: 'absolute', top: 0, left: 0}}
                                                                    onClick={e => {
                                                                        this.props.onSortableContainerDeleted(idContainer, box.id);
                                                                        e.stopPropagation();
                                                                    }}>X</Button>
                                                        ) :
                                                            ""
                                                    }
                                                </div>);
                                            })}
                                        </div>);
                                    }
                                })}
                            </div>
                            <div style={{
                                    position: 'absolute',
                                    bottom: '0px',
                                    width: '100%',
                                    height: 5,
                                    backgroundColor: 'lightgray',
                                    cursor: this.props.boxSelected === this.props.id ? 's-resize' : 'initial'
                               }}></div>
                            <i style={{
                                    verticalAlign: 'middle',
                                    position: 'absolute',
                                    bottom: '0px',
                                    left: '0px'
                               }}
                               className="material-icons drag-handle">swap_vert</i>
                        </div>);
                    })}
                </div>
                <div className="dragContentHere" onClick={e => {
                    this.props.onBoxSelected(-1);
                    e.stopPropagation();
                }}>
                    {i18n.t("messages.drag_content")}
                </div>
            </div>
            /* jshint ignore:end */
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
            }
        });
    }

    configureResizable(item) {
        interact(item).resizable({
            enabled: this.props.id === this.props.boxSelected,
            edges: {left: false, right: false, bottom: true, top: false},
            onmove: (event) => {
                event.target.style.height = event.rect.height + 'px';
            },
            onend: (event) => {
                this.props.onSortableContainerResized(event.target.getAttribute("data-id"), this.props.id, parseInt(event.target.style.height));
            }
        });
    }

    configureDropZone(node, dropArea, selector, extraParams) {
        interact(node).dropzone({
            accept: selector,
            overlap: 'pointer',
            ondropactivate: function (e) {
                e.target.classList.add('drop-active');
            },
            ondragenter: function (e) {
                e.target.classList.add("drop-target");
            },
            ondragleave: function (e) {
                e.target.classList.remove("drop-target");
            },
            ondrop: function (e) {
                if (dropArea === 'cell') {
                    // If element dragged is coming from PluginRibbon, create a new DaliBox
                    if (e.relatedTarget.className.indexOf("rib") !== -1) {
                        let initialParams = {
                            parent: this.props.id,
                            container: extraParams.idContainer,
                            col: extraParams.i,
                            row: extraParams.j
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
                            container: e.target.getAttribute("data-id")
                        };
                    } else if (dropArea === 'newContainer') {
                        initialParams = {
                            parent: this.props.id,
                            container: ID_PREFIX_SORTABLE_CONTAINER + Date.now()
                        };
                    }
                    Dali.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().callback(initialParams, ADD_BOX);
                    e.dragEvent.stopPropagation();
                }
            }.bind(this),
            ondropdeactivate: function (e) {
                e.target.classList.remove('drop-active');
                e.target.classList.remove("drop-target");
            }
        });
    }
}
