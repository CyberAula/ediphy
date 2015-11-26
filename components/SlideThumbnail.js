import React, {Component} from 'react';
import {selectSlide} from '../actions'

export default class SlideThumbnail extends Component{
    render(){
        let border = (this.props.isSelected) ? "5px solid red" : "";
        let id = this.props.id;
        return(
            <div style={{backgroundColor: 'gray', width: '100%', height: '12.5%', minHeight: '120px', marginTop: '3%'}}
                 onClick={(e) => this.handleSlideSelection(id)}
                 onTouchStart={(e) => this.handleSlideSelection(id)}>
                <div style={{position: 'absolute'}}>
                    <p>{id}</p>
                </div>
                <div style={{position: 'absolute', visibility: (this.props.isSelected ? 'visible' : 'hidden')}}>
                    <button style={{display: 'block', minHeight: '40px', minWidth: '40px'}}>X</button>
                    <button style={{display: 'block', minHeight: '40px', minWidth: '40px'}}>C</button>
                    <button style={{display: 'block', minHeight: '40px', minWidth: '40px'}}>D</button>
                </div>
            </div>
        );
    }

    handleSlideSelection(e){
        this.props.onSelectSlide(e);
    }
}
