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
                    <button style={{marginLeft: '15%', minWidth: '5%', height: '100%'}} onClick={() => dispatch(addBox(pageSelected, Date.now(), 'normal', true, true))}>Add box</button>
                    <button style={{marginLeft: '1%', minWidth: '5%', height: '100%'}} onClick={() => dispatch(addBox(pageSelected, Date.now(), 'sortable', true, false))}>Add sortable</button>
                </div>
                <DaliCanvas boxes={boxes}
                            ids={boxIds}
                            pageSelected={pageSelected}
                            boxSelected={boxSelected}
                            onSelectBox={id => dispatch(selectBox(id))}
                            onMoveBox={(id, x, y) => dispatch(moveBox(id, x, y))}
                    />
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