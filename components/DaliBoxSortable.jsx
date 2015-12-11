import React, {Component} from 'react';
import Sortable from 'sortablejs';

export default class DaliBoxSortable extends Component{
    render(){
        return(
        <div>
            <div ref="sortableContainer">
                <div style={{width: '100%', height: 80, backgroundColor: 'red'}}>a</div>
                <div style={{width: '100%', height: 80, backgroundColor: 'green'}}>b</div>
                <div style={{width: '100%', height: 80, backgroundColor: 'blue'}}>c</div>
                <div style={{width: '100%', height: 80, backgroundColor: 'yellow'}}>d</div>
            </div>
            <button style={{display: 'block', width: 75, height: 75, margin: 'auto'}} onClick={e => console.log("click")} ><i className="fa fa-plus-circle fa-5x"></i></button>
        </div>
        );
    }

    componentDidMount(){
        Sortable.create(this.refs.sortableContainer.getDOMNode(),{
            onStart: evt => {
                evt.oldIndex;  // element index within parent
            },
            onEnd: evt => {
                evt.oldIndex;  // element's old index within parent
                evt.newIndex;  // element's new index within parent
            },
        });
    }
}