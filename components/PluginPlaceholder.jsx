import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import interact from 'interact.js';
import DaliBox from '../components/DaliBox';
import {ID_PREFIX_PAGE, ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX} from '../constants';

export default class PluginPlaceholder extends Component {
    render() {
        let container = this.props.parentBox.sortableContainers[this.props.pluginContainer];
        let showOverlay;

        if (this.props.boxes && this.props.boxes.length == 0) {
            showOverlay = "hidden";
        } /*else if (this.props.boxLevelSelected > this.props.parentBox.level + 1) {
            showOverlay = "visible";
        } 
        */
        /*else if(this.props.boxLevelSelected === (this.props.parentBox.level + 1) &&
         !this.isAncestorOrSibling(this.props.boxSelected, (container ? container.children[0] : this.props.parentBox.id))){
         showOverlay = "visible";
         }*/ else {
            showOverlay = "hidden";
        }

        return (
            <div style={{
                    border: "solid pink 5px",
                    width: "100%",
                    height: container ? container.height : "100%",
                    position: 'relative'}}
                 className={"drg" + this.props.pluginContainer}>
                <div style={{
                    width: "100%",
                    height: "100%",
                    background: "black",
                    top: 0,
                    position: "absolute",
                    opacity: 0.4,
                    visibility: showOverlay,
                }}></div>
                {container.colDistribution.map((col, i) => {
                    if (container.cols[i]) {
                        return (
                            <div key={i}
                                 style={{width: col + "%", height: '100%', float: 'left'}}>
                                {container.cols[i].map((row, j) => {
                                    return (<div key={j}
                                                 style={{width: "100%", height: row + "%", position: 'relative'}}
                                                 ref={e => {
                                                    if(e !== null){
                                                        let selector = ".rib, .dnd" + this.props.pluginContainer;
                                                        interact(ReactDOM.findDOMNode(e)).dropzone({
                                                            accept: selector,
                                                            overlap: 'pointer',
                                                            ondropactivate: function (e) {
                                                                e.target.classList.add('drop-active');
                                                            },
                                                            ondragenter: function(e){
                                                                e.target.classList.add("drop-target");
                                                            },
                                                            ondragleave: function(e){
                                                                e.target.classList.remove("drop-target");
                                                            },
                                                            ondrop: function(e){
                                                                if(e.relatedTarget.className.indexOf("rib") !== -1){
                                                                    let initialParams = {
                                                                        parent: this.props.parentBox.id,
                                                                        container: this.props.pluginContainer,
                                                                        col: i,
                                                                        row: j
                                                                    };
                                                                    Dali.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().callback(initialParams);
                                                                } else {
                                                                    let boxDragged = this.props.boxes[this.props.boxSelected];
                                                                    if(boxDragged && (boxDragged.col !== i || boxDragged.row !== j)){
                                                                        this.props.onBoxDropped(this.props.boxSelected, j, i);
                                                                    }
                                                                }
                                                            }.bind(this),
                                                            ondropdeactivate: function (e) {
                                                                e.target.classList.remove('drop-target');
                                                                e.target.classList.remove('drop-active');
                                                            }
                                                        });
                                                    }
                                                }}>
                                        {container.children.map((idBox, index) => {
                                            if (this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                                return (<DaliBox id={idBox}
                                                                 key={index}
                                                                 boxes={this.props.boxes}
                                                                 boxSelected={this.props.boxSelected}
                                                                 boxLevelSelected={this.props.boxLevelSelected}
                                                                 toolbars={this.props.toolbars}
                                                                 onBoxSelected={this.props.onBoxSelected}
                                                                 onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                                                 onBoxMoved={this.props.onBoxMoved}
                                                                 onBoxResized={this.props.onBoxResized}
                                                                 onSortableContainerResized={this.props.onSortableContainerResized}
                                                                 onBoxDeleted={this.props.onBoxDeleted}
                                                                 onBoxDropped={this.props.onBoxDropped}
                                                                 onBoxModalToggled={this.props.onBoxModalToggled}
                                                                 onTextEditorToggled={this.props.onTextEditorToggled}/>);
                                            }
                                        })}
                                    </div>)
                                })}
                            </div>
                        )
                    }
                })}
            </div>
        );
    }

    isAncestorOrSibling(searchingId, actualId) {
        if (searchingId === actualId) {
            return true;
        }
        let parentId = this.props.boxes[actualId].parent;
        if (parentId === searchingId) {
            return true;
        }
        if (parentId.indexOf(ID_PREFIX_PAGE) !== -1 || parentId.indexOf(ID_PREFIX_SECTION) !== -1) {
            return false;
        }
        if (parentId.indexOf(ID_PREFIX_SORTABLE_BOX) === -1) {
            let parentContainers = this.props.boxes[parentId].children;
            if (parentContainers.length !== 0) {
                for (let i = 0; i < parentContainers.length; i++) {
                    let containerChildren = this.props.boxes[parentId].sortableContainers[parentContainers[i]].children;
                    for (let j = 0; j < containerChildren.length; j++) {
                        if (containerChildren[j] === searchingId) {
                            return true;
                        }
                    }
                }
            }
        }

        return this.isAncestorOrSibling(searchingId, parentId);
    }

    componentDidMount() {
        interact(ReactDOM.findDOMNode(this))
            .dropzone({
                accept: '.rib',
                overlap: 'pointer',
                ondropactivate: function (event) {
                    event.target.classList.add('drop-active');
                },
                ondragenter: function (event) {
                    event.target.classList.add("drop-target");
                },
                ondragleave: function (event) {
                    event.target.classList.remove("drop-target");
                },
                ondrop: function (event) {
                    //addBox
                    let initialParams = {
                        parent: this.props.parentBox.id,
                        container: this.props.pluginContainer
                    };
                    Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams);

                    //interact(ReactDOM.findDOMNode(this)).unset();
                }.bind(this),
                ondropdeactivate: function (event) {
                    event.target.classList.remove('drop-active');
                    event.target.classList.remove("drop-target");
                }
            })
            .resizable({
                enabled: this.props.resizable,
                edges: {left: false, right: false, bottom: true, top: false},
                onmove: (event) => {
                    event.target.style.height = event.rect.height + 'px';
                },
                onend: (event) => {
                    this.props.onSortableContainerResized(this.props.pluginContainer, this.props.parentBox.id, parseInt(event.target.style.height));
                    let toolbar = this.props.toolbars[this.props.parentBox.id];
                    Dali.Plugins.get(toolbar.config.name).forceUpdate(toolbar.state, this.props.parentBox.id);
                }
            });
    }
}
