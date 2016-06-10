import React, {Component} from 'react';
import {Modal, Row, Col, Grid, Button, ButtonGroup} from 'react-bootstrap';
import VisorPluginPlaceholder from '../visor/VisorPluginPlaceholder';
import DaliTitle from '../DaliTitle';
import VisorDaliBox from '../visor/VisorDaliBox'
import VisorDaliBoxSortable from '../visor/VisorDaliBoxSortable'
import {BOX_TYPES, ID_PREFIX_SORTABLE_BOX} from '../../constants';

export default class Visor extends Component{
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.visorVisible || nextProps.visorVisible;
    }

    render() {
        if(this.props.state.navItemSelected === 0){
            return <div></div>;
        }

        let navItemSelected = this.props.state.navItemSelected || 0;
        let navItemsById = this.props.state.navItemsById;
        let navItem = navItemsById[navItemSelected];

        let display = navItem.type == "slide"? "sli slide":"sli doc";
        let firstParent = navItem.parent || 0;
        let parentName = navItemsById[firstParent].name || 'Section 0';
        let patt = /([0-9]+((\.[0-9]+)+)?)/;  //Detecta número de sección. Ej. Section (2.3.4.2)
        let sectionTitle = patt.exec(parentName)? patt.exec(parentName)[0] : '0';
        let today = new Date();
        let strDate = 'd-m-Y'
        .replace('d', today.getDate())
        .replace('m', today.getMonth()+1)
        .replace('Y', today.getFullYear());
        let boxes = navItemSelected!=-1? navItem.boxes : [];
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
            <Modal className="visor modalVisorContainer"
                   show={this.props.visorVisible}
                   backdrop={true} bsSize="large"
                   aria-labelledby="contained-modal-title-lg"
                   onHide={e => {
                        this.props.onVisibilityToggled()
                        }}>
                <Modal.Header closeButton >
                    <Modal.Title><span id="previewTitle">Preview</span></Modal.Title>
                </Modal.Header>

                <Modal.Body style={{position: 'absolute', top: '56px', padding: 0, bottom: 0, width: '100%', overflowY: 'auto'}}>
                    {/*
                        <Grid fluid={true} style={{height: '100%'}}>
                            <Row style={{height: '100%', margin:'0'}}>
                                <Col md={12} xs={12} style={{padding: 0, height: '100%'}}>
                                    <div className="outter" style={{paddingTop:'0px'}}>
                                        <div id="maincontents" className={display} style={{visibility: 'visible'}}>
                                            <DaliTitle titles={titles}
                                                       isReduced={navItem.titlesReduced}
                                                       navItemId={navItem}
                                                       titleModeToggled={this.props.state.titleModeToggled}
                                                       showButton={false}/><br/>
                                            <div style={{width: "100%", height: "100%"}}
                                                 dangerouslySetInnerHTML={{__html: DaliVisor.exportPage(this.props.state)}}></div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                    */}
                    <div ref={el => {
                        if(el !== null && this.props.visorVisible){
                            $(el).html(DaliVisor.exportPage(this.props.state));
                        }
                    }} style={{width: "100%", height: "100%"}}></div>
                </Modal.Body>
            </Modal>
        )
    }
}