import React, {Component} from 'react';
import {Modal, Button, Tabs, Tab, Col} from 'react-bootstrap';
import interact from 'interact.js';
import {ID_PREFIX_BOX, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_SORTABLE_CONTAINER, BOX_TYPES} from '../constants';

export default class PluginRibbon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttons: []
        };
    }

    render() {
        return (
            <Col id="ribbon"
                 md={12}
                 xs={12}
                 style={{ 
                    height: this.props.ribbonHeight,
                    overflowY:'hidden'  
                }}>
                <div id="insideribbon" className="row">
                    <div id="ribbonList">
                        {this.state.buttons.map((item, index) => {
                            if (this.state.buttons[index].category === this.props.category || this.props.category == 'all') {
                                var clase = "" + this.state.buttons[index].icon ;
                                return (<div key={index} className="buttonPlace">
                                    <Button className="rib"
                                            disabled={this.props.disabled}
                                            key={index}
                                            name={item.name}
                                            bsSize="large"
                                            draggable="false">
                                        <i className="material-icons">{clase}</i> {this.state.buttons[index].name}
                                    </Button>
                                </div>);
                            }
                        })}
                    </div>
                </div>
                <div className="mainButtons">
                    <button className="ribShortcut" 
                            title="Undo" 
                            disabled={this.props.undoDisabled} 
                            onClick={() => this.props.undo()}>
                        <i className="material-icons">undo</i>
                    </button>
                    <button className="ribShortcut" 
                            title="Redo" 
                            disabled={this.props.redoDisabled} 
                            onClick={() => this.props.redo()}>
                        <i className="material-icons">redo</i>
                    </button>
                    <button className="ribShortcut" 
                            title="Copy" 
                            disabled={this.props.boxSelected == -1 || this.props.boxSelected.id == -1 || this.props.boxSelected.id.indexOf(ID_PREFIX_SORTABLE_BOX) != -1} 
                            onClick={() => {
                                this.props.onBoxDuplicated(this.props.boxSelected.id, this.props.boxSelected.parent, this.props.boxSelected.container);
                                e.stopPropagation();
                            }}>
                        <i className="material-icons">content_copy</i>
                    </button>
                    <button className="ribShortcut" 
                            title="Paste" 
                            disabled={this.props.boxSelected.id == -1} 
                            onClick={() => alert('Aún no hace nada')}>
                        <i className="material-icons">content_paste</i>
                    </button>
                    <button className="ribShortcut" 
                            title="Save" 
                            disabled={this.props.undoDisabled } 
                            onClick={() => {
                                this.props.save();
                                this.props.serverModalOpen();
                            }}>
                        <i className="material-icons">save</i>
                    </button>
                </div>
            </Col>);
    }

    componentDidMount() {
        Dali.API.Private.listenEmission(Dali.API.Private.events.addMenuButton, e => {
            this.setState({buttons: this.state.buttons.concat([e.detail])});
        });

        interact(".rib")
            .draggable({
                autoScroll: false,
                onstart: function (event) {
                    changeOverflow(true);
                    let original = event.target;
                    let parent = original.parentNode;
                    let dw = original.offsetWidth;
                    let clone = original.cloneNode(true),
                        x = (parseFloat(original.getAttribute('data-x')-dw) || 0),
                        y = (parseFloat(original.getAttribute('data-y')) || 0);
                    clone.setAttribute("id", "clone");
                    clone.setAttribute('data-x', x);
                    clone.setAttribute('data-y', y);
                    parent.appendChild(clone);
                      // translate the element
                    clone.style.webkitTransform =
                        clone.style.transform =
                            'translate(' + (x) + 'px, ' + (y) + 'px)';
                },
                onmove: (event) => {
                    let target = document.getElementById('clone'),
                    // keep the dragged position in the data-x/data-y attributes
                        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    
                    // translate the element
                    target.style.webkitTransform =
                        target.style.transform =
                            'translate(' + (x) + 'px, ' + (y) + 'px)';
                    target.style.zIndex = '9999';
                    target.classList.add('ribdrag');

                    // update the position attributes
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },
                onend: (event) => {
                    changeOverflow(false);
                    let original = event.target;
                    let parent = original.parentNode;
                    let dw = original.offsetWidth;
                    let clone = document.getElementById('clone');
                    
                    
                    var target = clone,
                        x = 0,
                        y = 0;
                    target.style.webkitTransform =
                        target.style.transform =
                            'translate(' + (x) + 'px, ' + y + 'px)';

                    target.style.zIndex = '9999';
                    target.style.position = 'relative';
                    target.classList.remove('ribdrag');

                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);

                    parent.removeChild(clone);
                    event.stopPropagation();
                }
            });
    }
}




function changeOverflow(bool) {
    document.getElementById('ribbonRow').style.overflowX = bool ? 'visible' : 'auto';
    document.getElementById('ribbon').style.overflowX = bool ? 'visible' : 'hidden';
    document.getElementById('ribbon').style.overflowY = bool ? 'visible' : 'hidden';
    document.getElementById('insideribbon').style.overflowY = bool ? 'visible' : 'hidden';
    document.getElementById('ribbonList').style.overflowY = bool ? 'visible' : 'hidden';
    document.getElementById('ribbonRow').style.overflowY = bool ? 'visible' : 'hidden';
    document.getElementById('canvas').style.zIndex = bool ? '-1' : '0';
}