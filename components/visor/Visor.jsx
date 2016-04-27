import React, {Component} from 'react';
import {Modal, Row, Col, Grid, Button, ButtonGroup} from 'react-bootstrap';
import VisorPluginPlaceholder from '../visor/VisorPluginPlaceholder';
import DaliTitle from '../DaliTitle';
import VisorDaliBox from '../visor/VisorDaliBox'
import VisorDaliBoxSortable from '../visor/VisorDaliBoxSortable'
import {BOX_TYPES, ID_PREFIX_SORTABLE_BOX} from '../../constants';
export default class Visor extends Component{
 constructor(props) {
    super(props);

}
render() {
        let navItemsIds = this.props.state.navItemsIds
        let boxesById = this.props.state.boxesById
        let boxes = this.props.state.boxes
        let navItemSelected = this.props.state.navItemSelected || 0
        let navItemsById = this.props.state.navItemsById
        let toolbarsById = this.props.state.toolbarsById
        let navItem = navItemsById[navItemSelected]
        let elements = 0;

        let display = navItem.type == "slide"? "sli slide":"sli doc";
        let firstparent = navItem.parent||0
        let padre = navItemsById[firstparent].name || 'Section 0';
        let patt = /([0-9]+((\.[0-9]+)+)?)/;  //Detecta número de sección. Ej. Section (2.3.4.2)
        let sectiontitle = patt.exec(padre)? patt.exec(padre)[0]:'0';
        let today = new Date();
        let strDate = 'd-m-Y'
        .replace('d', today.getDate())
        .replace('m', today.getMonth()+1)
        .replace('Y', today.getFullYear());
        let cajas = navItemSelected!=-1? navItem.boxes :[];
        let titles = [];
        if (navItemSelected !== 0) {
            titles.push(navItem.name);
            let parent = navItem.parent;
            while (parent !== 0) {
                titles.push(navItem.name);
                parent = navItemsById[parent].parent;
            }
            titles.reverse();
        }

        return (
            <Modal className="visor modalVisorContainer"   show={this.props.visor} backdrop={true} bsSize="large" aria-labelledby="contained-modal-title-lg" onHide={e => {
               this.props.onVisibilityToggled() }}
               >

                <Modal.Header closeButton >
                    <Modal.Title>Preview</Modal.Title>
                </Modal.Header>

               <Modal.Body style={{padding:'0px', height:'90%'}}>
                   <Grid fluid={true} style={{height: '100%'}} >
                       <Row style={{height: '100%', margin:'0'}}>
                            <Col md={12} xs={12} style={{padding: 0, height: '100%'}}>
                               <div className="outter" style={{paddingTop:'0px'}}>
                                   <div id="maincontents" className={display} style={{visibility: 'visible'}} >
                                        <DaliTitle  titles={titles}
                                                    isReduced={navItem.titlesReduced}
                                                    navItemId={navItem}
                                                    titleModeToggled={this.props.state.titleModeToggled}
                                                    showButton={false} /> <br/> 
                                            {
                                                navItem.boxes.map((id)=>{
                                                    let box = this.props.state.boxesById[id];
                                                    if (box.type === BOX_TYPES.NORMAL){
                                                        return( <VisorDaliBox key={id}
                                                                              id={id}
                                                                              boxes={this.props.state.boxesById}
                                                                              toolbars={this.props.state.toolbarsById} />)
                                                     
                                                    }  else if (box.type === BOX_TYPES.SORTABLE) {
                                                        return (<VisorDaliBoxSortable   key={id}
                                                                                        id={id}
                                                                                        boxes={this.props.state.boxesById}
                                                                                        toolbars={this.props.state.toolbarsById} />)
                                                    }
                                            })}

                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Modal.Body>
            </Modal>
                )
    }



        }