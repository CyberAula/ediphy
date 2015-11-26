import React, {Component} from 'react';
import SlideThumbnail from '../components/SlideThumbnail'
import {selectSlide} from '../actions'

export default class DaliCarousel extends Component{
    render(){
        return(
            <div style={{display: 'table-cell', width: '15%', height: '100%', padding: '1%'}}>
                {this.props.ids.map((id, index) =>{
                    let isSelected = (this.props.slide === id);
                    return <SlideThumbnail key={index} id={id} slide={this.props.slides[id]} isSelected={isSelected} onSelectSlide={this.props.onSelectSlide} />;
                })}
            </div>
        );
    }
}