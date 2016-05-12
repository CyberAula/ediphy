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
         var paddings= (this.props.navItemSelected.type!= "slide") ? ('0px 0px 0px 0px') : ('30px 0px 30px 0px')
         return (<Col id="canvas" md={12} xs={12} style={{height:"100%", padding:0}}>
            <div className="outter" style={{position: 'absolute', width: '100%', height:'100%', padding: (paddings)}} >
                <div  id="maincontent"
                      onClick={e => {this.props.onBoxSelected(-1)}}
                      className={this.props.navItems[this.props.navItemSelected.id].type == 'slide' ? 'slide sli':'slide doc'}
                      style={{visibility: (this.props.showCanvas ? 'visible' : 'hidden'), position: 'relative'}}>
                    <DaliTitle titles={titles}
                               isReduced={this.props.navItemSelected.titlesReduced}
                               navItemId={this.props.navItemSelected.id}
                               titleModeToggled={this.props.titleModeToggled}
                               showButton={true} />
                               <br/>
                    <div style={{
                        width: "100%",
                        height: "100%",
                        background: "black",
                        top: 0,
                        position: "absolute",
                        opacity: 0.4,
                        visibility: (this.props.boxLevelSelected > 0) ? "visible" : "collapse",
                    }}></div>
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
                }
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

        Dali.API.Private.listenEmission(Dali.API.Private.events.getPluginsInCurrentView, e => {
            let plugins = {};
            this.props.navItemSelected.boxes.map(id => {
                let toolbar = this.props.toolbars[id];
                if(toolbar.buttons) {
                    let lastButton = toolbar.buttons[toolbar.buttons.length - 1];
                    if (lastButton.humanName === "Alias" && lastButton.value !== "" && toolbar.config.name) {
                        if(!plugins[toolbar.config.name]){
                            plugins[toolbar.config.name] = [];
                        }
                        plugins[toolbar.config.name].push(lastButton.value);
                    }
                }else if(id.indexOf(ID_PREFIX_SORTABLE_BOX) !== -1){
                    this.props.boxes[id].children.map(idContainer => {
                        this.props.boxes[id].sortableContainers[idContainer].children.map(idBox => {
                            toolbar = this.props.toolbars[idBox];
                            if(toolbar.buttons) {
                                let lastButton = toolbar.buttons[toolbar.buttons.length - 1];
                                if (lastButton.humanName === "Alias" && lastButton.value !== "" && toolbar.config.name) {
                                    if(!plugins[toolbar.config.name]){
                                        plugins[toolbar.config.name] = [];
                                    }
                                    plugins[toolbar.config.name].push(lastButton.value);
                                }
                            }
                        });
                    });
                }
            });

            Dali.API.Private.answer(Dali.API.Private.events.getPluginsInCurrentView, plugins);
        });
    }
}