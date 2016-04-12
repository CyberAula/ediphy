import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button, Grid, Row, Col} from 'react-bootstrap';
import interact from 'interact.js';
import DaliBox from '../components/DaliBox';

export default class PluginPlaceholder extends Component {
    render() {
        let container = this.props.parentBox.sortableContainers[this.props.pluginContainer];
        //let contentFull = (
        return (
            <Grid fluid={true} style={{
                    width: "100%",
                    height: "100%",
                    position: 'relative',
                    padding: 0}}
                  className={"drg" + this.props.pluginContainer}>
                {container ?
                    container.rows.map((row, i) => {
                        return (
                            <Row key={i}
                                 style={{height: (100 / 12 * row) + "%", margin: 0}}>
                                {container.cols.map((col, j) => {
                                    return(<Col lg={col} md={col} sm={col} xs={col} key={j}
                                                style={{height: "100%", padding: 0}}
                                                ref={e => {
                                                    if(e !== null){
                                                        let selector = ".rib, .dnd" + this.props.pluginContainer;
                                                        interact(ReactDOM.findDOMNode(e)).dropzone({
                                                            accept: selector,
                                                            overlap: 'center',
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
                                                                        row: i,
                                                                        col: j
                                                                    };
                                                                    Dali.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().callback(initialParams);
                                                                } else {
                                                                    let boxDragged = this.props.boxes[this.props.boxSelected];
                                                                    if(boxDragged && (boxDragged.row !== i || boxDragged.col !== j)){
                                                                        this.props.onBoxDropped(this.props.boxSelected, i, j);
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
                                            if(this.props.boxes[idBox].row === i && this.props.boxes[idBox].col === j) {
                                                return (<DaliBox id={idBox}
                                                                 key={index}
                                                                 boxes={this.props.boxes}
                                                                 boxSelected={this.props.boxSelected}
                                                                 toolbars={this.props.toolbars}
                                                                 onBoxSelected={this.props.onBoxSelected}
                                                                 onBoxMoved={this.props.onBoxMoved}
                                                                 onBoxResized={this.props.onBoxResized}
                                                                 onBoxDeleted={this.props.onBoxDeleted}
                                                                 onBoxModalToggled={this.props.onBoxModalToggled}
                                                                 onTextEditorToggled={this.props.onTextEditorToggled}/>);
                                            }
                                        })}
                                    </Col>)
                                })}
                            </Row>
                        )
                    })
                    : (<div style={{
                                width: '100%',
                                height: '100%'}}>
                        Drag content here
                    </div>
                )}
            </Grid>
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
