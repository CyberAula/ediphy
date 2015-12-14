import React, {Component} from 'react';
import Sortable from 'sortablejs';
import DaliBox from '../components/DaliBox';

export default class DaliBoxSortable extends Component{
    render(){
        return(
        <div>
            <div ref="sortableContainer">
                {
                    this.props.boxesIds.map((id, index)=>{
                        let box = this.props.boxes[id];
                        if(box.parent === this.props.id) {
                            let isSelected = (id === this.props.boxSelected);
                            return <DaliBox key={id} box={box} id={id}
                                            isSelected={isSelected}
                                            onBoxSelected={this.props.onBoxSelected}
                                            onBoxMoved={this.props.onBoxMoved}/>
                        }
                    })
                }
            </div>
            <button style={{display: 'block', width: 75, height: 75, margin: 'auto'}} onClick={e => this.props.onVisibilityToggled(this.props.id, true)} ><i className="fa fa-plus-circle fa-5x"></i></button>
        </div>
        );
    }

    componentDidMount(){
        Sortable.create(this.refs.sortableContainer,{
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