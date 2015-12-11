import React, {Component} from 'react';
import DaliBox from '../components/DaliBox';
import DaliBoxSortable from '../components/DaliBoxSortable';

export default class DaliCanvas extends Component{
    render(){
        return(
            <div style={{backgroundColor: 'gray', height: '100%', paddingTop: 20}}>
                <div style={{position: 'relative', height: '100%', backgroundColor: 'white', margin: '0px 100px 0px 20%'}}>
                    {this.props.ids.map(id =>{
                        let box = this.props.boxes[id];
                        if(box.parent === this.props.pageSelected) {
                            let isSelected = (id === this.props.boxSelected);
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