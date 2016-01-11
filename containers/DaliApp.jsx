import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {ActionCreators} from 'redux-undo';
import {Grid, Col, Row, Button} from 'react-bootstrap';
import {addNavItem, selectNavItem, expandNavItem, removeNavItem, addBox, selectBox, moveBox, resizeBox, togglePluginModal, togglePageModal, changeDisplayMode} from '../actions';
import DaliCanvas from '../components/DaliCanvas';
import DaliCarousel from '../components/DaliCarousel';
import BoxModal from '../components/BoxModal';
import PageModal from '../components/PageModal';

class DaliApp extends Component{
    render(){
        const{ dispatch, boxes, boxesIds, boxSelected, navItemsIds, navItems, navItemSelected, boxModalToggled,
            pageModalToggled, undoDisabled, redoDisabled, displayMode } = this.props;
        return(
            <Grid fluid={true} style={{height: '100%'}}>
                <Row style={{height: '100%'}}>
                    <Col md={2} xs={2} style={{padding: 0, height: '100%'}}>
                        <DaliCarousel navItemsIds={navItemsIds}
                                      navItems={navItems}
                                      navItemSelected={navItemSelected}
                                      displayMode={displayMode}
                                      onPageAdded={(caller, value) => dispatch(togglePageModal(caller, value))}
                                      onSectionAdded={(id, name, parent, children, level, type, position) => dispatch(addNavItem(id, name, parent, children, level, type, position))}
                                      onNavItemSelected={id => dispatch(selectNavItem(id))}
                                      onNavItemExpanded={(id, value) => dispatch(expandNavItem(id, value))}
                                      onNavItemRemoved={(ids, parent) => dispatch(removeNavItem(ids, parent))}
                                      onDisplayModeChanged={mode => dispatch(changeDisplayMode(mode))} />
                    </Col>
                    <Col md={10} xs={10} style={{padding: 0, height: '100%', overflowY: 'auto'}}>
                        <DaliCanvas boxes={boxes}
                                    boxesIds={boxesIds}
                                    boxSelected={boxSelected}
                                    navItemSelected={navItems[navItemSelected]}
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
                          onBoxAdded={(parent, id, type, draggable, resizable) => dispatch(addBox(parent, id, type, draggable, resizable))} />
                <PageModal visibility={pageModalToggled.value}
                           caller={pageModalToggled.caller}
                           navItems={navItems}
                           navItemsIds={navItemsIds}
                           onVisibilityToggled={(caller, value) => dispatch(togglePageModal(caller, value))}
                           onPageAdded={(id, name, parent, children, level, type, position) => dispatch(addNavItem(id, name, parent, children, level, type, position))} />
                <div style={{backgroundColor: 'blue', position: 'absolute', top: 0, left: 0, width: '100%', height: '5%'}}>
                    <Col mdOffset={2} xsOffset={2}>
                        <Button disabled={(navItemsIds.length === 0 ? true : false)} onClick={() => dispatch(togglePluginModal(navItemSelected, false, true))}>Add</Button>
                        <Button disabled={undoDisabled} onClick={() => dispatch(ActionCreators.undo())}>Undo</Button>
                        <Button disabled={redoDisabled} onClick={() => dispatch(ActionCreators.redo())}>Redo</Button>
                    </Col>
                </div>
            </Grid>
        );
    }
}

function mapStateToProps(state){
    return{
        boxes: state.present.boxesById,
        boxesIds: state.present.boxes,
        boxSelected: state.present.boxSelected,
        navItemsIds: state.present.navItemsIds,
        navItems: state.present.navItemsById,
        navItemSelected: state.present.navItemSelected,
        boxModalToggled: state.present.boxModalToggled,
        pageModalToggled: state.present.pageModalToggled,
        undoDisabled: state.past.length === 0,
        redoDisabled: state.future.length === 0,
        displayMode: state.present.displayMode
    }
}

export default connect(mapStateToProps)(DaliApp);