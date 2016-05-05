import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import VisorDaliBox from '../visor/VisorDaliBox';
import {ID_PREFIX_SORTABLE_CONTAINER} from '../../constants';

export default class VisorDaliBoxSortable extends Component{
    render(){
        let box = this.props.boxes[this.props.id];
        return(
        <div>
            <div style={{position: 'relative'}}>
                {box.children.map((idContainer, index)=>{
                    let container = box.sortableContainers[idContainer];
                    return (<div key={index}
                                 className="daliBoxSortableContainer"
                                 data-id={idContainer}
                                 style={{
                                    width: '100%',
                                    minHeight: 150,
                                    height: container.height,
                                    boxSizing: 'border-box',
                                    position: 'relative'}}>
                        {container.colDistribution.map((col, i) => {
                            if(container.cols[i]) {
                                return(
                                <div key={i}
                                     style={{width: col + "%", height: '100%', float: 'left'}}>
                                    {container.cols[i].map((row, j) => {
                                        return (<div key={j} style={{width: "100%", height: row + "%", position: 'relative'}}>
                                            {container.children.map((idBox, index) => {
                                                if(this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                                    return (<VisorDaliBox id={idBox}
                                                                          key={index}
                                                                          boxes={this.props.boxes}
                                                                          toolbars={this.props.toolbars} />);
                                                }
                                            })}
                                        </div>);
                                    })}
                                </div>);
                            }
                        })}
                    </div>);
                })}
            </div>
        </div>
        );
    }
}