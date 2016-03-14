import React, {Component} from 'react';
import {Modal, Button, Tabs, Tab, Col} from 'react-bootstrap';
import {ID_PREFIX_BOX, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_SORTABLE_CONTAINER, BOX_TYPES} from '../constants';

export default class PluginRibbon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttons: [],
            show: false
        };
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.caller !== 0){
            this.setState({show: true});

        }
    }



    render() {
        let none;
        if(this.props.category == 'temp') {

            none= (<div>
                  <Button className="rib" bsSize="large" onClick={e => {
                    this.props.onVisibilityToggled(this.props.navItemSelected, false, 0);
                 if(this.props.fromSortable){
               
                     this.props.onBoxAdded({parent: this.props.caller, container: ID_PREFIX_SORTABLE_CONTAINER + Date.now(), id: ID_PREFIX_BOX + Date.now()}, BOX_TYPES.NORMAL, true, true);
                 }else if(this.props.container !== 0) {
          
                     this.props.onBoxAdded({parent: this.props.caller, container: this.props.container, id: ID_PREFIX_BOX + Date.now()}, BOX_TYPES.NORMAL,  true, true);
                 }else {
         
                     var par = this.props.caller==0 ? this.props.navItemSelected:this.props.caller
                     this.props.onBoxAdded({parent: par, container: 0, id: ID_PREFIX_BOX + Date.now()}, BOX_TYPES.NORMAL, true, true);
                 }
                 this.setState({show: false});
                  this.props.onVisibilityToggled(0, false, 0);
             }}><i className="fa fa-cubes fa-1"></i><br/> Add simple box</Button>
             <Button className="rib" bsSize="large" disabled={(this.props.fromSortable) ? true : false} onClick={e => {
                    this.props.onVisibilityToggled(0, false, 0);
                 this.props.onBoxAdded({parent: this.props.navItemSelected, container: 0, id: ID_PREFIX_SORTABLE_BOX + Date.now()}, BOX_TYPES.SORTABLE, false, false);
                 this.setState({show: true})
                  // this.props.onVisibilityToggled(this.props.navItemSelected, false, 0);
             }}><i className="fa fa-align-justify fa-1"></i><br/> Add sortable</Button>

            </div>);

        }

        return (
            <Col id="ribbon" md={10} xs={12} mdOffset={2} xsOffset={2}   style={{height: (this.props.hideTab=='hide' || this.props.category=='none' )? '0px':'60px', display: (this.props.hideTab=='hide' || this.props.category=='none' )? 'none':'block'}} onHide={e => {
                    this.setState({show: false});
            ;}} >
                {none}

                {this.state.buttons.map((id, index) => {
                
                    if(this.state.buttons[index].category === this.props.category){
                        var clase = "fa "+ this.state.buttons[index].icon + " fa-1"
                        return (<Button className="rib"  key={index} bsSize="large" onClick={this.buttonCallback.bind(this, index)}> <i className={clase}></i><br/> {this.state.buttons[index].name}</Button>);
                    } 
                })}

          </Col>);
    }
  
    componentDidMount(){
        Dali.API.Private.listenEmission(Dali.API.Private.events.addMenuButton, e =>{
            this.setState({buttons: this.state.buttons.concat([e.detail])});
        })
    }

    buttonCallback(index){
            // if(this.state.buttons[index].needsConfigModal){
         
        // }
          this.props.onVisibilityToggled(this.props.navItemSelected, false, 0);
         this.setState({show: false});
         console.log(this.props.navItemSelected)
        
         this.state.buttons[index].callback();
         this.props.onVisibilityToggled(this.props.navItemSelected, false, 0);
    
    }
}