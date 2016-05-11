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
                    height:  this.props.ribbonHeight,
                    overflowY:'hidden'  
                }} >
                <div id="insideribbon" style={{}} className="row" >
                    <div id="ribbonList" style={{ }}>
                        {this.state.buttons.map((item, index) => {
                            if(this.state.buttons[index].category === this.props.category || this.props.category == 'all'){
                                var clase = "fa "+ this.state.buttons[index].icon + " fa-1";
                                return (<div className="buttonPlace">
                                        <Button className="rib"
                                                disabled={this.props.disabled}
                                                key={index}
                                                name={item.name}
                                                bsSize="large"
                                                draggable="true" >
                                            <i className={clase}></i><br/> {this.state.buttons[index].name}
                                        </Button>
                                    </div>);
                            }
                        })}
                    </div>
                </div>
            </Col>);
    }
  
    componentDidMount(){
        Dali.API.Private.listenEmission(Dali.API.Private.events.addMenuButton, e =>{
            this.setState({buttons: this.state.buttons.concat([e.detail])});
        });

 
        interact(".rib")
            .draggable({ 
            
                autoScroll: false,
                onstart: function (event) {
 
                    document.getElementById('ribbonRow').style.overflowX='visible'
                    document.getElementById('ribbon').style.overflowX='visible'
                    document.getElementById('ribbon').style.overflowY='visible'
                    document.getElementById('insideribbon').style.overflowY='visible'
                    document.getElementById('ribbonList').style.overflowY='visible'
                    document.getElementById('ribbonRow').style.overflowY='visible'
                },
                onmove: (event) => {
             
 
                    let target = event.target,
                    // keep the dragged position in the data-x/data-y attributes
                        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                        
                    // translate the element
                    target.style.webkitTransform =
                        target.style.transform =
                            'translate(' + (x ) + 'px, ' +  (y)   + 'px)'; 
                    target.style.zIndex = '9999';
                    // target.style.position = 'fixed';
                    target.classList.add('ribdrag');

                    // update the position attributes
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);


                },
                onend: (event) => {
                    document.getElementById('ribbonRow').style.overflowX='auto'
                    document.getElementById('ribbon').style.overflowX='hidden'
                    document.getElementById('ribbon').style.overflowY='hidden'
                    document.getElementById('insideribbon').style.overflowY='hidden'
                    document.getElementById('ribbonList').style.overflowY='hidden'
                    document.getElementById('ribbonRow').style.overflowY='hidden'

                    var target = event.target,
                        x = 0,
                        y = 0;
                    target.style.webkitTransform =
                        target.style.transform =
                            'translate(' + x + 'px, ' + y + 'px)';
                          
                    target.style.zIndex = '9999';
                    target.style.position = 'relative';
                    target.classList.remove('ribdrag');   


                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y); 
                    event.stopPropagation();
                }
            });
    }
}