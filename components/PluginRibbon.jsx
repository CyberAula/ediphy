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
                    height: (this.props.hideTab=='hide' || this.props.category=='none' )? '0px':'60px',
                    overflowX: 'auto',
                    overflowY: 'hidden'   }} >
                <div id="insideribbon" style={{margin:'0', right:0 }} className="row">
                    <div style={{ whiteSpace: 'nowrap', marginLeft: '30px'}}>
                        {this.state.buttons.map((item, index) => {
                            if(this.state.buttons[index].category === this.props.category || this.props.category == 'all'){
                                var clase = "fa "+ this.state.buttons[index].icon + " fa-1";
                                return (
                                    <Button className="rib"
                                            disabled={this.props.disabled}
                                            key={index}
                                            name={item.name}
                                            bsSize="large">
                                        <i className={clase}></i><br/> {this.state.buttons[index].name}
                                    </Button>);
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
                onmove: (event) => {
                    let target = event.target,
                    // keep the dragged position in the data-x/data-y attributes
                        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    // translate the element
                    target.style.webkitTransform =
                        target.style.transform =
                            'translate(' + x + 'px, ' + (y-$(window).height()/2) + 'px)'; // BOX-HEIGHT(200) - NAVBAR-HEIGHT (29)
                    target.style.zIndex = "999 !important";
                    target.style.position = 'fixed';
                    target.classList.add('ribdrag');

                    
             
                    // update the position attributes
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },
                onend: (event) => {
                    var target = event.target,
                        x = 0,
                        y = 0;
                    target.style.webkitTransform =
                        target.style.transform =
                            'translate(' + x + 'px, ' + y + 'px)';
                          
                    target.style.zIndex = 'initial';
                    target.style.position = 'relative';
                    target.classList.remove('ribdrag');   


                    // update the position attributes
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);  
                    event.stopPropagation();
                }
            });
    }
}