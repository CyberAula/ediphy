import React, {Component} from 'react';
import DaliBox from '../components/DaliBox';
import DaliBoxSortable from '../components/DaliBoxSortable';

export default class DaliCanvas extends Component{
    render(){
        return(
            <div style={{backgroundColor: 'gray', height: '100%'}}>
                <div style={{height: '100%', backgroundColor: 'white', margin: '0px 100px 0px 100px'}}>
                    {this.props.ids.map(id =>{
                        let box = this.props.boxes[id];
                        if(box.parent === this.props.pageSelected) {
                            let isSelected = (id === this.props.boxSelected);
                            return <DaliBox key={id} box={box} id={id}
                                            isSelected={isSelected}
                                            onVisibilityToggled={this.props.onVisibilityToggled}
                                            onBoxAdded={this.props.onBoxAdded}
                                            onBoxSelected={this.props.onBoxSelected}
                                            onBoxMoved={this.props.onBoxMoved} />
                        }
                    })}
                </div>
            </div>
        );
    }
}