import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import Sortable from 'sortablejs';
import DaliBox from '../components/DaliBox';

export default class DaliBoxSortable extends Component{
    render(){
        return(
        <div>
            <div ref="sortableContainer">
                {this.props.boxesIds.map((id, index)=>{
                    let box = this.props.boxes[id];
                    if(box.parent === this.props.id) {
                        let isSelected = (id === this.props.boxSelected);
                        return (<div key={index} style={{width: '100%', border: '1px solid black', boxSizing: 'border-box'}}>
                            <DaliBox box={box} id={id}
                                     isSelected={isSelected}
                                     onBoxSelected={this.props.onBoxSelected}
                                     onBoxMoved={this.props.onBoxMoved}/>
                            <i className="fa fa-bars drag-handle"></i>
                        </div>);
                    }
                })}
            </div>
            <Button style={{display: 'block', margin: 'auto'}} onClick={e => this.props.onVisibilityToggled(this.props.id, true, true)}><i className="fa fa-plus-circle fa-5x"></i></Button>
        </div>
        );
    }

    componentDidMount(){
        Sortable.create(this.refs.sortableContainer,{
            handle: ".drag-handle",
            onStart: evt => {
                evt.oldIndex;  // element index within parent
            },
            onEnd: evt => {
                evt.oldIndex;  // element's old index within parent
                evt.newIndex;  // element's new index within parent
            }
        });
    }
}