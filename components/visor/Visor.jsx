import React, {Component} from 'react';
import {Modal, Row, Col, Grid, Button, ButtonGroup} from 'react-bootstrap';

export default class Visor extends Component{
     constructor(props) {
        super(props);
        this.state = {
            page:this.props.state.navItemSelected
        };
        
    }
    render() {

        // console.log(this.props.state)
        var navItemsIds = this.props.state.navItemsIds
        var boxesById = this.props.state.boxesById
        var boxes = this.props.state.boxes
        var navItemsIds = this.props.state.navItemsIds
        var navItemSelected = this.props.state.navItemSelected //
        var navItemsById = this.props.state.navItemsById
        var toolbarsById = this.props.state.toolbarsById
        var elements = 0;

        return (
        <Modal className="visor"  show={this.props.visor} backdrop={true} bsSize="large" aria-labelledby="contained-modal-title-lg" onHide={e => {

           this.props.onVisibilityToggled()
           console.log('building')

        }}>
                <Modal.Header closeButton >
                    <Modal.Title>Preview</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{padding:'0px', height:'90%'}}>
                  <Grid fluid={true} style={{height: '100%'}} >
                      <Row style={{height: '100%', margin:'0'}}>
                          <Col md={2} xs={2} style={{padding: 0, height: '100%'}}>
                            <nav  style={{width:'100%'}}>
                                <h2 style={{paddingLeft:'10px'}}>Índice</h2>
                                <hr style={{borderColor:'#777'}}></hr>
                                <ul id="nav" style={{paddingLeft:'0',listStyle:"none"}}>
                                { navItemsIds.map((i,id)=>{
                                        
                                      
                                        var element = navItemsById[navItemsIds[id]]
                                        var name = navItemsById[navItemsIds[id]].name
                                        var level = navItemsById[navItemsIds[id]].level
                                        var type = navItemsById[navItemsIds[id]].type 
                                        var bold = (type=='section')?'bold':'normal'
                                        var active = (element.id == this.state.page)? "navItem active":"navItem"
                                        var isExpanded = element.isExpanded
                                        var margin = (level*5)+'px'
                                         var icon = (type=='section')? (isExpanded ? ('fa fa-chevron-down') : ('fa fa-chevron-right')):' '
                                    
                                        elements++
                                        return(<li key={'seccion'+id} style={{marginLeft:margin, fontWeight:bold}} >
                                            <i  id={id} className={icon} onClick={() => alert(2) } ></i><a  className={active}  id={element.id} onClick={() => {this.setState({page: element.id}); this.changePage(); } }> {name}</a></li>)
                                       

                                    })}

                                  {   }
                                
                                </ul>
                            </nav>
                        </Col>
                        <Col md={10} xs={10} style={{padding: 0, height: '100%'}}>
                            <div className="outter outter2" style={{height:'100%', padding:'50px 0px 30px 0px'}}> 
                                <div className="sli doc" id="main" style={{height:'100%',  paddingTop:'50px' }}>
                                </div>

                            </div>
                                
                        </Col>
        
                        </Row>
                     </Grid>

                   
                </Modal.Body>
            </Modal>
        );
    }

    componentDidMount(){
        console.log('mount')
        this.changePage(this.props.state.navItemSelected)
    }

    changePage(){
        var num = this.state.page
        var esta =this.props.state.navItemsById[num]
        $('.outter2').css( {"padding":(esta.type!= "slide") ? "0px 0px 0px 0px" : "50px 0px 30px 0px" })
        $('#main').removeClass("slide doc").addClass((esta.type!= "slide")?"doc":"slide")
        $('.navItem').removeClass("active")
        $('#'+num).addClass("active")
    }
    

}