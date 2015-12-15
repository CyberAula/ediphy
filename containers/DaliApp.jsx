import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Grid, Col, Row, Button} from 'react-bootstrap';
import {addPage, selectPage, addBox, selectBox, moveBox, addSection, selectSection, expandSection, removeSection, duplicateSection, togglePluginModal, togglePageModal} from '../actions';
import DaliCanvas from '../components/DaliCanvas';
import DaliCarousel from '../components/DaliCarousel';
import BoxModal from '../components/BoxModal';
import PageModal from '../components/PageModal';

class DaliApp extends Component{
    render(){
        const{ dispatch, sections, sectionsIds, sectionSelected, pages, pagesIds, pageSelected, boxes, boxIds, boxSelected, navIds, navItemSelected, boxModalToggled, pageModalToggled } = this.props;
        return(
            <Grid fluid={true} style={{height: '100%'}}>
                <Row style={{height: '100%'}}>
                    <Col md={2} style={{padding: 0, height: '100%', overflowY: 'auto'}}>
                        <DaliCarousel sections={sections}
                                      sectionsIds={sectionsIds}
                                      sectionSelected={sectionSelected}
                                      pages={pages}
                                      pagesIds={pagesIds}
                                      pageSelected={pageSelected}
                                      navIds={navIds}
                                      navItemSelected={navItemSelected}
                                      onPageAdded={(caller, value) => dispatch(togglePageModal(caller, value))}
                                      onPageSelected={id => dispatch(selectPage(id))}
                                      onSectionAdded={(id, parent, name, children, level) => dispatch(addSection(id, parent, name, children, level))}
                                      onSectionSelected={id => dispatch(selectSection(id))}
                                      onSectionExpanded={(id, newValue) => dispatch(expandSection(id, newValue))}
                                      onSectionRemoved={ids => dispatch(removeSection(ids))}
                                      onSectionDuplicated={id => dispatch(duplicateSection(id))}
                            />
                    </Col>
                    <Col md={10} style={{padding: 0, height: '100%', overflowY: 'auto'}}>
                        <DaliCanvas boxes={boxes}
                                    ids={boxIds}
                                    pageSelected={pageSelected}
                                    boxSelected={boxSelected}
                                    showCanvas={(pagesIds.length !== 0)}
                                    onBoxSelected={id => dispatch(selectBox(id))}
                                    onBoxMoved={(id, x, y) => dispatch(moveBox(id, x, y))}
                                    onVisibilityToggled={(caller, fromSortable, value) => dispatch(togglePluginModal(caller, fromSortable, value))}
                            />
                    </Col>
                </Row>
                <BoxModal visibility={boxModalToggled.value}
                          caller={boxModalToggled.caller}
                          fromSortable={boxModalToggled.fromSortable}
                          onVisibilityToggled={(caller, fromSortable, value) => dispatch(togglePluginModal(caller, fromSortable, value))}
                          onBoxAdded={(parent, type, draggable, resizable) => dispatch(addBox(parent, Date.now(), type, draggable, resizable))} />
                <PageModal visibility={pageModalToggled.value}
                           caller={pageModalToggled.caller}
                           proposedName={pagesIds.length + 1}
                           sections={sections}
                           onVisibilityToggled={value => dispatch(togglePageModal(value))}
                           onPageAdded={(id, name, parent, level) => dispatch(addPage(id, name, parent, level))} />
                <div style={{backgroundColor: 'blue', position: 'absolute', top: 0, left: 0, width: '100%', height: '5%'}}>
                    <Col mdOffset={2}>
                        <Button disabled={(pagesIds.length === 0 ? true : false)} onClick={() => dispatch(togglePluginModal(pageSelected, false, true))}>Add</Button>
                    </Col>
                </div>
            </Grid>
        );
    }
}

function mapStateToProps(state){
    return{
        sections: state.sectionsById,
        sectionsIds: state.sections,
        sectionSelected: state.sectionSelected,
        pages: state.pagesById,
        pagesIds: state.pages,
        pageSelected: state.pageSelected,
        boxes: state.boxesById,
        boxIds: state.boxes,
        boxSelected: state.boxSelected,
        navIds: state.navigationIds,
        navItemSelected: state.navItemSelected,
        boxModalToggled: state.boxModalToggled,
        pageModalToggled: state.pageModalToggled
    }
}

export default connect(mapStateToProps)(DaliApp);