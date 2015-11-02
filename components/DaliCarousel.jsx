import React, {Component} from 'react';
import {selectSlide} from '../actions'

export default class DaliCarousel extends Component{
    render(){
        return(
            <div style={{display: 'table-cell', width: '100px', height: '700px'}}>
                {this.props.ids.map((id, index) =>{
                    let slide = this.props.slides[id];
                    let border = (this.props.slide === id) ? 'solid red 2px' : 'solid black 2px';
                    return <div key={index}
                                style={{backgroundColor: 'gray', width: '80px', height: '80px', border: border, margin: '5px'}}
                                onClick={(e) => this.handleSlideSelection(id)}
                                onTouchStart={(e) => this.handleSlideSelection(id)}>
                        <p>{index}</p>
                    </div>;
                })}
            </div>
        );
    }

    handleSlideSelection(e){
        this.props.onSelectSlide(e);
    }
}