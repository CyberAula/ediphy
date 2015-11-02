import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {addBox, addSlide, selectSlide, selectBox} from '../actions';
import DaliCanvas from '../components/DaliCanvas';
import DaliCarousel from '../components/DaliCarousel';

class DaliApp extends Component{
    render(){
        const{ dispatch, slides, slideIds, slideSelected, boxes, boxIds, boxSelected } = this.props;
        return(
            <div style={{width: '100%', height: '100%'}}>
                <div style={{display: 'table', height: '10%', width: '100%', backgroundColor: 'blue'}}>
                    <button onClick={() => dispatch(addSlide(slideIds.length))}>Add slide</button>
                    <button onClick={() => dispatch(addBox(slideSelected, boxIds.length, 'text'))}>Add box</button>
                </div>
                <div style={{display: 'table', backgroundColor: '#CCCCCC', width: '100%', height: '700px'}}>
                    <DaliCarousel slides={slides} ids={slideIds} slide={slideSelected} onSelectSlide={id => dispatch(selectSlide(id))} />
                    <DaliCanvas boxes={boxes} ids={boxIds} slide={slideSelected} box={boxSelected} onSelectBox={id => dispatch(selectBox(id))} />
                </div>
            </div>
        );
    }
}

/*
DaliApp.propTypes = {
    slides: PropTypes.array.isRequired,
    slideSelected: PropTypes.shape({
        components: PropTypes.arrayOf(PropTypes.shape({
            type: PropTypes.string.isRequired,
            position: PropTypes.shape({
                x: PropTypes.number.isRequired,
                y: PropTypes.number.isRequired
            }),
            style: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired
        }))
    })
};
*/

function mapStateToProps(state){
    return{
        slides: state.slidesById,
        slideIds: state.slides,
        slideSelected: state.slideSelected,
        boxes: state.boxesById,
        boxIds: state.boxes,
        boxSelected: state.boxSelected
    }
}

export default connect(mapStateToProps)(DaliApp);