import React, {Component} from 'react';

export default class DaliCanvas extends Component{
    render(){
        return(
            <div style={{display: 'table-cell', backgroundColor: 'green', position: 'relative', height: '700px'}}>
                {this.props.ids.map((id, index) =>{
                    let box = this.props.boxes[id];
                    box.style['position'] = 'absolute';
                    box.style['left'] = box.position.x + '%';
                    box.style['top'] = box.position.y + '%';
                    return <div key={index} style={box.style}
                        dangerouslySetInnerHTML={{__html: box.content}}>
                    </div>;
                })}
            </div>
        );
    }
}