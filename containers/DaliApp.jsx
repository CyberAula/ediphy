import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Grid, Col, Row, Button} from 'react-bootstrap';
import {addPage, selectPage, addBox, selectBox, moveBox, addSection, selectSection, expandSection, removeSection, duplicateSection, togglePluginModal} from '../actions';
import DaliCanvas from '../components/DaliCanvas';
import DaliCarousel from '../components/DaliCarousel';
import BoxModal from '../components/BoxModal';

class DaliApp extends Component{
    render(){
        const{ dispatch, sections, sectionsIds, sectionSelected, pages, pagesIds, pageSelected, boxes, boxIds, boxSelected, boxModalVisibility } = this.props;
        return(
            <Grid fluid={true} style={{height: '100%'}}>
                <Row style={{backgroundColor: 'blue'}}>
                    <Col mdOffset={2}>
                        <Button onClick={() => dispatch(togglePluginModal(true))}>Add</Button>
                    </Col>
                </Row>
                <Row style={{height: '100%'}}>
                    <Col md={2} style={{padding: 0, height: '100%'}}>
                        <DaliCarousel sections={sections}
                                      sectionsIds={sectionsIds}
                                      sectionSelected={sectionSelected}
                                      pages={pages}
                                      pagesIds={pagesIds}
                                      pageSelected={pageSelected}
                                      onPageAdded={(id, name, parent, level) => dispatch(addPage(id, name, parent, level))}
                                      onPageSelected={id => dispatch(selectPage(id))}
                                      onSectionAdded={(id, parent, name, children, level) => dispatch(addSection(id, parent, name, children, level))}
                                      onSectionSelected={id => dispatch(selectSection(id))}
                                      onSectionExpanded={(id, newValue) => dispatch(expandSection(id, newValue))}
                                      onSectionRemoved={ids => dispatch(removeSection(ids))}
                                      onSectionDuplicated={id => dispatch(duplicateSection(id))}
                            />
                    </Col>
                    <Col md={10} style={{padding: 0, height: '100%'}}>
                        <DaliCanvas boxes={boxes}
                                    ids={boxIds}
                                    pageSelected={pageSelected}
                                    boxSelected={boxSelected}
                                    onSelectBox={id => dispatch(selectBox(id))}
                                    onMoveBox={(id, x, y) => dispatch(moveBox(id, x, y))}
                            />
                    </Col>
                </Row>
                <BoxModal visibility={boxModalVisibility}
                          onToggleVisibility={(newValue) => dispatch(togglePluginModal(newValue))}
                          onBoxAdded={(type, draggable, resizable) => dispatch(addBox(pageSelected, Date.now(), type, draggable, resizable))}/>
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
        boxModalVisibility: state.boxModalVisibility
    }
}

export default connect(mapStateToProps)(DaliApp);