import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Grid, Col, Row, Button} from 'react-bootstrap';
import {addNavItem, selectNavItem, expandNavItem, removeNavItem, addBox, selectBox, moveBox, resizeBox, togglePluginModal, togglePageModal} from '../actions';
import DaliCanvas from '../components/DaliCanvas';
import DaliCarousel from '../components/DaliCarousel';
import BoxModal from '../components/BoxModal';
import PageModal from '../components/PageModal';

class DaliApp extends Component{
    render(){
        const{ dispatch, boxes, boxIds, boxSelected, navItemsIds, navItems, navItemSelected, boxModalToggled, pageModalToggled } = this.props;
        return(
            <Grid fluid={true} style={{height: '100%'}}>
                <Row style={{height: '100%'}}>
                    <Col md={2} xs={2} style={{padding: 0, height: '100%', overflowY: 'auto'}}>
                        <DaliCarousel navItemsIds={navItemsIds}
                                      navItems={navItems}
                                      navItemSelected={navItemSelected}
                                      onPageAdded={(caller, value) => dispatch(togglePageModal(caller, value))}
                                      onSectionAdded={(id, name, parent, children, level, type, position) => dispatch(addNavItem(id, name, parent, children, level, type, position))}
                                      onNavItemSelected={id => dispatch(selectNavItem(id))}
                                      onNavItemExpanded={(id, value) => dispatch(expandNavItem(id, value))}
                                      onNavItemRemoved={(ids, parent) => dispatch(removeNavItem(ids, parent))} />
                    </Col>
                    <Col md={10} xs={10} style={{padding: 0, height: '100%', overflowY: 'auto'}}>
                        <DaliCanvas boxes={boxes}
                                    ids={boxIds}
                                    boxSelected={boxSelected}
                                    navItemSelected={navItemSelected}
                                    showCanvas={(navItemsIds.length !== 0)}
                                    onBoxSelected={id => dispatch(selectBox(id))}
                                    onBoxMoved={(id, x, y) => dispatch(moveBox(id, x, y))}
                                    onBoxResized={(id, width, height) => dispatch(resizeBox(id, width, height))}
                                    onVisibilityToggled={(caller, fromSortable, value) => dispatch(togglePluginModal(caller, fromSortable, value))} />
                    </Col>
                </Row>
                <BoxModal visibility={boxModalToggled.value}
                          caller={boxModalToggled.caller}
                          fromSortable={boxModalToggled.fromSortable}
                          onVisibilityToggled={(caller, fromSortable, value) => dispatch(togglePluginModal(caller, fromSortable, value))}
                          onBoxAdded={(parent, type, draggable, resizable) => dispatch(addBox(parent, Date.now(), type, draggable, resizable))} />
                <PageModal visibility={pageModalToggled.value}
                           caller={pageModalToggled.caller}
                           navItems={navItems}
                           navItemsIds={navItemsIds}
                           onVisibilityToggled={(caller, value) => dispatch(togglePageModal(caller, value))}
                           onPageAdded={(id, name, parent, children, level, type, position) => dispatch(addNavItem(id, name, parent, children, level, type, position))} />
                <div style={{backgroundColor: 'blue', position: 'absolute', top: 0, left: 0, width: '100%', height: '5%'}}>
                    <Col mdOffset={2}>
                        <Button disabled={(navItemsIds.length === 0 ? true : false)} onClick={() => dispatch(togglePluginModal(navItemSelected, false, true))}>Add</Button>
                    </Col>
                </div>
            </Grid>
        );
    }
}

function mapStateToProps(state){
    return{
        boxes: state.boxesById,
        boxIds: state.boxes,
        boxSelected: state.boxSelected,
        navItemsIds: state.navItemsIds,
        navItems: state.navItemsById,
        navItemSelected: state.navItemSelected,
        boxModalToggled: state.boxModalToggled,
        pageModalToggled: state.pageModalToggled
    }
}

export default connect(mapStateToProps)(DaliApp);