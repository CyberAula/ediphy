import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import DaliBox from '../components/DaliBox';
import DaliBoxSortable from '../components/DaliBoxSortable';
import {Col} from 'react-bootstrap';
import DaliTitle from '../components/DaliTitle';
import interact from 'interact.js';
import {BOX_TYPES, ID_PREFIX_SORTABLE_BOX} from '../constants';

export default class DaliCanvas extends Component{
    render() {
        let titles = [];
        if (this.props.navItemSelected.id !== 0) {
            titles.push(this.props.navItemSelected.name);
            let parent = this.props.navItemSelected.parent;
            while (parent !== 0) {
                titles.push(this.props.navItems[parent].name);
                parent = this.props.navItems[parent].parent;
            }
            titles.reverse();
        }
        let paddings= (this.props.navItemSelected.type!= "slide") ? ('5px 5px 5px 5px') : ('30px 0px 30px 0px')
        let maincontent = document.getElementById('maincontent');
        let actualHeight; 
        if (maincontent){
            actualHeight = parseInt(maincontent.scrollHeight);
            actualHeight = (parseInt(maincontent.clientHeight) < actualHeight) ? (actualHeight) +'px' : '100%';
        }
        let overlayHeight = actualHeight ? actualHeight:'100%';

        return (<Col id="canvas" md={12} xs={12} style={{height:"100%", padding:0}}>
            <div className="outter" style={{position: 'absolute', width: '100%', height:'100%', padding: (paddings)}} >
                <div  id="maincontent"
                      onClick={e => {this.props.onBoxSelected(-1)}}
                      className={this.props.navItems[this.props.navItemSelected.id].type == 'slide' ? 'slide sli':'slide doc'}
                      style={{visibility: (this.props.showCanvas ? 'visible' : 'hidden'), position: 'relative'}}>

                    {/*<div className="canvasHelper" style={{visibility: (this.props.showCanvas ? 'hidden' : 'visible'), position: 'relative'}}>
                        <div className="canvasMessage" >CREA UNA SECCIÓN PARA EMPEZAR</div>
                    </div>*/}

                    <DaliTitle titles={titles}
                               isReduced={this.props.navItemSelected.titlesReduced}
                               navItemId={this.props.navItemSelected.id}
                               titleModeToggled={this.props.titleModeToggled}
                               showButton={true} />
                               <br/>
                    <div style={{
                        width: "100%",  
                        background: "black",
                        height: overlayHeight,
                        position: "absolute",
                        top: 0,
                        opacity: 0.4,
                        visibility: (this.props.boxLevelSelected > 0) ? "visible" : "collapse"
                        }}>
                    </div>
                    
                    {this.props.navItemSelected.boxes.map(id => {
                        let box = this.props.boxes[id];
                        if (box.type === BOX_TYPES.NORMAL)
                            return <DaliBox key={id}
                                            id={id}
                                            boxes={this.props.boxes}
                                            boxSelected={this.props.boxSelected}
                                            boxLevelSelected={this.props.boxLevelSelected}
                                            toolbars={this.props.toolbars}
                                            onBoxSelected={this.props.onBoxSelected}
                                            onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                            onBoxMoved={this.props.onBoxMoved}
                                            onBoxResized={this.props.onBoxResized}
                                            onSortableContainerResized={this.props.onSortableContainerResized}
                                            onBoxDropped={this.props.onBoxDropped}
                                            onBoxModalToggled={this.props.onBoxModalToggled}
                                            onTextEditorToggled={this.props.onTextEditorToggled} 
                                            />
                        else if (box.type === BOX_TYPES.SORTABLE)
                            return <DaliBoxSortable key={id}
                                            id={id}
                                            boxes={this.props.boxes}
                                            boxSelected={this.props.boxSelected}
                                            boxLevelSelected={this.props.boxLevelSelected}
                                            toolbars={this.props.toolbars}
                                            onBoxSelected={this.props.onBoxSelected}
                                            onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                            onBoxMoved={this.props.onBoxMoved}
                                            onBoxResized={this.props.onBoxResized}
                                            onSortableContainerResized={this.props.onSortableContainerResized}
                                            onBoxReorder={this.props.onBoxReorder}
                                            onBoxDropped={this.props.onBoxDropped}
                                            onBoxModalToggled={this.props.onBoxModalToggled}
                                            onTextEditorToggled={this.props.onTextEditorToggled} />
                    })}
                </div></div> 
           </Col>);
    }

    componentDidMount(){
        interact(ReactDOM.findDOMNode(this)).dropzone({
            accept: '.rib',
            overlap: 'pointer',
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
                let position = {
                    x: event.dragEvent.clientX - event.target.getBoundingClientRect().left,
                    y: event.dragEvent.clientY - event.target.getBoundingClientRect().top,
                };
                let initialParams = {
                    parent: this.props.navItemSelected.id,
                    container: 0,
                    position: position
                };
                Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams);
                event.dragEvent.stopPropagation();
            }.bind(this),
            ondropdeactivate: function (event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            }
        });
    }
}