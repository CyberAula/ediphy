import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import interact from 'interact.js';
import DaliBox from '../components/DaliBox';
import {ID_PREFIX_SORTABLE_CONTAINER} from '../constants';

export default class DaliBoxSortable extends Component {
    render() {
        let box = this.props.boxes[this.props.id];
        return (
            <div onClick={e => {
                this.props.onBoxSelected(this.props.id, 0);
                e.stopPropagation();
            }}>
                <div ref="sortableContainer"
                     style={{
                    position: 'relative',
                    border: (this.props.id === this.props.boxSelected ? '1px dashed black' : '1px solid #999'),
                    boxSizing: 'border-box',
                }}>
                {box.children.map((idContainer, index)=>{
                    let container = box.sortableContainers[idContainer];

                    return (<div key={index}
                                 className="daliBoxSortableContainer"
                                 data-id={idContainer}
                                 style={{
                                    width: '100%',
                                    minHeight: 150,
                                    height: container.height,
                                    border: '1px solid #999',
                                    boxSizing: 'border-box',
                                    position: 'relative'}}>
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
                                                            let selector = ".rib, .dnd" + idContainer;
                                                            this.dropZone(ReactDOM.findDOMNode(e), "render",selector, {idContainer:idContainer, i:i, j:j});
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
                                                                             onBoxDropped={this.props.onBoxDropped}
                                                                             onBoxModalToggled={this.props.onBoxModalToggled}
                                                                             onSortableContainerResized={this.props.onSortableContainerResized}
                                                                             onTextEditorToggled={this.props.onTextEditorToggled}/>);
                                                        }
                                                    })}</div>);
                                            })}
                                        </div>);
                                }
                            })}
                            <div style={{position: 'absolute', bottom: 0}}>
                                <i style={{verticalAlign: 'middle'}} className="fa fa-bars fa-2x drag-handle"></i>
                            </div>
                        </div>);
                    })}
                </div>
                <div style={{textAlign:'center', minHeight: '100px'}}>
                    Drag content here
                </div>
            </div>
        );
    }

    componentDidMount(){
        this.dropZone(".daliBoxSortableContainer", "first", ".rib", 0);
        interact(".daliBoxSortableContainer").resizable({
            edges: {left: false, right: false, bottom: true, top: false},
            onmove: (event) => {
                event.target.style.height = event.rect.height + 'px';
            },
            onend: (event) => {
                this.props.onSortableContainerResized(event.target.getAttribute("data-id"), this.props.id, parseInt(event.target.style.height));
            }
        })

        this.dropZone(ReactDOM.findDOMNode(this), "second", ".rib", 0);
        let list = jQuery(this.refs.sortableContainer);
        list.sortable({ handle: '.drag-handle' ,
            stop: (event, ui) => {
                let indexes = [];
                let children = list[0].children;
                for (let i = 0; i < children.length; i++){
                    indexes.push(children[i].getAttribute("data-id"));
                }
                if(indexes.length !== 0) {
                    this.props.onBoxReorder(indexes, this.props.id);
                }
                list.sortable('cancel');
        }});
    }


    dropZone(argument, container, accept, render){
        interact(argument).dropzone({
            accept: accept,
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
                if (container == 'render'){
                    if(event.relatedTarget.className.indexOf("rib") !== -1){

                        let initialParams = {
                            parent: this.props.id,
                            container: render.idContainer,
                            col: render.i,
                            row: render.j
                        };

                        Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams);

                    } else {

                        let boxDragged = this.props.boxes[this.props.boxSelected];
                       
                        if(boxDragged && (boxDragged.col !== render.i || boxDragged.row !== render.j)){
                            this.props.onBoxDropped(this.props.boxSelected, render.j, render.i);
                        }
                    }

                }else{ 
                    let initialParams = {}
                    if(container == 'first'){
                        initialParams = {
                            parent: this.props.id,
                            container: event.target.getAttribute("data-id")
                        };

                    } else if (container == 'second'){
                        initialParams = {
                            parent: this.props.id,
                            container: ID_PREFIX_SORTABLE_CONTAINER + Date.now()
                        };

                    }  

                    Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams);
                    event.dragEvent.stopPropagation();

                }
               
            }.bind(this),
            ondropdeactivate: function (event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            }
        });
    }
}
