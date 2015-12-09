import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {addBox, addPage, selectPage, selectBox, moveBox, addSection, selectSection, expandSection, removeSection, duplicateSection} from '../actions';
import DaliCanvas from '../components/DaliCanvas';
import DaliCarousel from '../components/DaliCarousel';

class DaliApp extends Component{
    render(){
        const{ dispatch, sections, sectionsIds, sectionSelected, pages, pagesIds, pageSelected, boxes, boxIds, boxSelected } = this.props;
        return(
            <div style={{width: '100%', height: '100%'}}>
                <div style={{height: '10%', width: '100%', backgroundColor: 'blue'}}>
                    <button style={{marginLeft: '15%', minWidth: '5%', height: '100%'}} onClick={() => dispatch(addBox(pageSelected, Date.now(), 'text'))}>Add box</button>
                    <button style={{marginLeft: '1%', minWidth: '5%', height: '100%'}} disabled onClick={() => dispatch(addBox(pageSelected, Date.now(), 'text'))}>Add box</button>
                </div>
                <div style={{display: 'table', backgroundColor: '#CCCCCC', width: '100%', height: '90%'}}>
                    <DaliCarousel sections={sections}
                                  sectionsIds={sectionsIds}
                                  sectionSelected={sectionSelected}
                                  pages={pages}
                                  pagesIds={pagesIds}
                                  pageSelected={pageSelected}
                                  onPageAdded={(id, name, parent) => dispatch(addPage(id, name, parent))}
                                  onPageSelected={id => dispatch(selectPage(id))}
                                  onSectionAdded={(id, parent, name, children) => dispatch(addSection(id, parent, name, children))}
                                  onSectionSelected={id => dispatch(selectSection(id))}
                                  onSectionExpanded={(id, newValue) => dispatch(expandSection(id, newValue))}
                                  onSectionRemoved={ids => dispatch(removeSection(ids))}
                                  onSectionDuplicated={id => dispatch(duplicateSection(id))}
                        />
                    <DaliCanvas boxes={boxes}
                                ids={boxIds}
                                page={pageSelected}
                                box={boxSelected}
                                onSelectBox={id => dispatch(selectBox(id))}
                                onMoveBox={(id, x, y) => dispatch(moveBox(id, x, y))}
                        />
                </div>
            </div>
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
        boxSelected: state.boxSelected
    }
}

export default connect(mapStateToProps)(DaliApp);