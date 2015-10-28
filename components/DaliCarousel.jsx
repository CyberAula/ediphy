import React, {Component} from 'react';

export default class DaliCarousel extends Component{
    render(){
        return(
            <div style={{display: 'table-cell', width: '100px', height: '700px'}}>
                <div style={{display: 'block', backgroundColor: 'red', overflow: 'auto'}}>
                {this.props.ids.map((id, index) =>{
                    let slide = this.props.slides[id];
                    return <div key={index} style={{backgroundColor: 'gray', width: '80px', height: '80px'}}>
                        <p>{index}</p>
                    </div>;
                })}
                </div>
            </div>
        );
    }
}