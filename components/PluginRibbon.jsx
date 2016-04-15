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
                    marginLeft:'-15px',
                    height: (this.props.hideTab=='hide' || this.props.category=='none' )? '0px':'60px',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    display: (this.props.hideTab=='hide' || this.props.category=='none' )? 'none':'block'}}>
                <div id="insideribbon" style={{margin:'0', position:'absolute', right:0, width:'83.33333%'}} className="row">
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
                            'translate(' + x + 'px, ' + (y-300) + 'px)';
                    target.style.zIndex = "999 !important";
                    target.style.position = 'fixed';
                    target.style.color = 'black';    
                
             
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
                    target.style.position = 'relative'


                    // update the position attributes
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                    target.style.color = 'white';    
                    event.stopPropagation();
                }
            });
    }
}