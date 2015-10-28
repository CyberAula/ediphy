import React, {Component} from 'react';

export default class DaliCanvas extends Component{
    render(){
        return(
            <div style={{display: 'table-cell', backgroundColor: 'green', position: 'relative', height: '700px'}}>
                {this.props.ids.map((id, index) =>{
                    let box = this.props.boxes[id];
                    if(box.slideId === this.props.slide) {
                        box.style['position'] = 'absolute';
                        box.style['left'] = box.position.x + '%';
                        box.style['top'] = box.position.y + '%';
                        box.style['borderColor'] = (id === this.props.box) ? 'red' : 'black';
                        return <div key={index}
                                    style={box.style}
                                    dangerouslySetInnerHTML={{__html: box.content}}
                                    onClick={e => this.handleBoxSelection(id)}>
                        </div>;
                    }
                })}
            </div>
        );
    }

    handleBoxSelection(id){
        this.props.onSelectBox(id)
    }
}