import React, {Component} from 'react';
import DaliBox from '../components/DaliBox';
import DaliBoxSortable from '../components/DaliBoxSortable';
import {BOX_TYPES} from '../constants';

export default class DaliCanvas extends Component{
    render(){
        return(
            <div style={{backgroundColor: 'gray', height: '100%', paddingTop: '5%'}}>
                <div style={{height: '100%', backgroundColor: 'white', margin: '0px 100px 0px 100px', visibility: (this.props.showCanvas ? 'visible' : 'hidden')}}>
                    {this.props.navItemSelected.boxes.map(id =>{
                        let box = this.props.boxes[id];
                        let isSelected = (id === this.props.boxSelected);
                        if(box.type === BOX_TYPES.NORMAL)
                            return <DaliBox key={id}
                                            id={id}
                                            box={box}
                                            isSelected={isSelected}
                                            onBoxSelected={this.props.onBoxSelected}
                                            onBoxMoved={this.props.onBoxMoved}
                                            onBoxResized={this.props.onBoxResized} />
                        else if(box.type === BOX_TYPES.SORTABLE)
                            return <DaliBoxSortable key={id}
                                                    id={id}
                                                    box={box}
                                                    onVisibilityToggled={this.props.onVisibilityToggled}
                                                    boxes={this.props.boxes}
                                                    boxSelected={this.props.boxSelected}
                                                    onBoxSelected={this.props.onBoxSelected}
                                                    onBoxMoved={this.props.onBoxMoved}
                                                    onBoxResized={this.props.onBoxResized} />
                    })}
                </div>
            </div>
        );
    }
}