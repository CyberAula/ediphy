import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {addBox, addSlide, selectBox} from '../actions';
import DaliCanvas from '../components/DaliCanvas';
import DaliCarousel from '../components/DaliCarousel';

class DaliApp extends Component{
    render(){
        const{ dispatch, slides, slideIds, boxes, boxIds } = this.props;
        return(
            <div style={{display: 'block', width: '100%', height: '100%'}}>
                <div style={{display: 'table', height: '10%', width: '100%', backgroundColor: 'blue'}}>
                    <button onClick={() => dispatch(addSlide(slideIds.length))}>Add slide</button>
                    <button onClick={() => dispatch(addBox(slideIds.length - 1, boxIds.length, 'text'))}>Add box</button>
                </div>
                <div style={{display: 'table', backgroundColor: '#CCCCCC', width: '100%'}}>
                    <DaliCarousel slides={slides} ids={slideIds} style={{height: '100%'}} />
                    <DaliCanvas boxes={boxes} ids={boxIds} style={{height: '100%'}} />
                </div>
            </div>
        );
    }
}

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

function mapStateToProps(state){
    return{
        slides: state.slidesById,
        slideIds: state.slides,
        //slideSelected: state.slidesById[state.slideSelected],
        boxes: state.boxesById,
        boxIds: state.boxes
        //boxSelected: state.boxesById[state.boxSelected]
    }
}

export default connect(mapStateToProps)(DaliApp);