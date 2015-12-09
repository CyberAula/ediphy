import React, {Component} from 'react';
import DaliBox from '../components/DaliBox';

export default class DaliCanvas extends Component{
    render(){
        return(
            <div style={{display: 'table-cell', backgroundColor: 'gray', height: '100%'}}>
                <div style={{position: 'relative', height: '98%', backgroundColor: 'white', margin: '2% 100px 0px 100px'}}>
                    {this.props.ids.map(id =>{
                        let box = this.props.boxes[id];
                        if(box.slideId === this.props.page) {
                            let isSelected = (id === this.props.box);
                            return <DaliBox key={id} box={box} id={id}
                                            isSelected={isSelected}
                                            onSelectBox={this.props.onSelectBox}
                                            onMoveBox={this.props.onMoveBox} />
                        }
                    })}
                </div>
            </div>
        );
    }
}