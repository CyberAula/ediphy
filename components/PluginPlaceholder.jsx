import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import interact from 'interact.js';
import DaliBox from '../components/DaliBox';

export default class PluginPlaceholder extends Component {
    render() {
        let container = this.props.parentBox.sortableContainers[this.props.pluginContainer];
        //let contentFull = (
        return (
            <div style={{
                    width: "100%",
                    height: "100%",
                    position: 'relative'}}
                  className={"drg" + this.props.pluginContainer}>
                {container ?
                    container.colDistribution.map((col, i) => {
                        if(container.cols[i]){
                            return (
                                <div key={i}
                                     style={{width: col + "%", height: '100%', float: 'left'}}>
                                    {container.cols[i].map((row, j) => {
                                        return(<div key={j}
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
                                                if(this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
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
                                                                     onBoxDeleted={this.props.onBoxDeleted}
                                                                     onBoxModalToggled={this.props.onBoxModalToggled}
                                                                     onTextEditorToggled={this.props.onTextEditorToggled}/>);
                                                }
                                            })}
                                        </div>)
                                    })}
                                </div>
                            )
                        }
                    })
                    : (<div style={{
                                width: '100%',
                                height: '100%'}}>
                        Drag content here
                    </div>
                )}
            </div>
        );
    }

    componentDidMount(){
        interact(ReactDOM.findDOMNode(this)).dropzone({
            accept: '.rib',
            overlap: 'center',
            ondropactivate: function (event) {
                event.target.classList.add('drop-active');
            },
            ondragenter: function(event){
                event.target.classList.add("drop-target");
            },
            ondragleave: function(event){
                event.target.classList.remove("drop-target");
            },
            ondrop: function (event) {
                //addBox
                let initialParams = {
                    parent: this.props.parentBox.id,
                    container: this.props.pluginContainer
                };
                Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams);

                interact(ReactDOM.findDOMNode(this)).unset();
            }.bind(this),
            ondropdeactivate: function (event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            }
        });
    }
}
