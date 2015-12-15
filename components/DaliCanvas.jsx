import React, {Component} from 'react';
import DaliBox from '../components/DaliBox';
import DaliBoxSortable from '../components/DaliBoxSortable';

export default class DaliCanvas extends Component{
    render(){
        return(
            <div style={{backgroundColor: 'gray', height: '100%', paddingTop: '5%'}}>
                <div style={{height: '100%', backgroundColor: 'white', margin: '0px 100px 0px 100px', visibility: (this.props.showCanvas ? 'visible' : 'hidden')}}>
                    {this.props.ids.map(id =>{
                        let box = this.props.boxes[id];
                        if(box.parent === this.props.pageSelected) {
                            let isSelected = (id === this.props.boxSelected);
                            if(box.type === 'normal')
                                return <DaliBox key={id}
                                                id={id}
                                                box={box}
                                                isSelected={isSelected}
                                                onBoxSelected={this.props.onBoxSelected}
                                                onBoxMoved={this.props.onBoxMoved} />
                            else if(box.type === 'sortable')
                                return <DaliBoxSortable key={id}
                                                        id={id}
                                                        box={box}
                                                        onVisibilityToggled={this.props.onVisibilityToggled}
                                                        boxesIds={this.props.ids}
                                                        boxes={this.props.boxes}
                                                        boxSelected={this.props.boxSelected}
                                                        onBoxSelected={this.props.onBoxSelected}
                                                        onBoxMoved={this.props.onBoxMoved} />
                        }
                    })}
                </div>
            </div>
        );
    }
}