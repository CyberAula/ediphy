import React, {Component} from 'react';
import BoxVisor from './BoxVisor';

export default class BoxSortableVisor extends Component {
    render() {
        let box = this.props.boxes[this.props.id];
        return (
            /* jshint ignore:start */
                <div ref="sortableContainer"
                     style={{ position: 'relative' }}>
                    {box.children.map((idContainer, index)=> {
                        let container = box.sortableContainers[idContainer];
                        return (<div key={index}
                                     className={"daliBoxSortableContainer pos_relative " + container.style.className}
                                     id={idContainer}
                                     style={
                                        Object.assign({},{
                                            height: container.height == 'auto' ? container.height : container.height + 'px',
                                        },container.style)
                                     }>
                            <div className="disp_table width100 height100">
                                {container.colDistribution.map((col, i) => {
                                    if (container.cols[i]) {
                                        return (<div key={i}
                                                     className="colDist-i height100 disp_table_cell vert_al_top"
                                                     style={{width: col + "%"}}>
                                            {container.cols[i].map((row, j) => {
                                                return (<div key={j}
                                                             className="colDist-j width100 pos_relative"
                                                             style={{height: row + "%"}}>
                                                    {container.children.map((idBox, index) => {
                                                        if (this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                                            return (<DaliBox id={idBox}
                                                                             key={index}
                                                                             boxes={this.props.boxes}
                                                                             boxSelected={this.props.boxSelected}
                                                                             boxLevelSelected={this.props.boxLevelSelected}
                                                                             containedViewSelected={this.props.containedViewSelected}
                                                                             toolbars={this.props.toolbars}/>);

                                                        } else if (index == container.children.length - 1) {
                                                            return (<span key={index}><br/><br/></span>);
                                                        }
                                                    })}
                                                </div>);
                                            })}
                                        </div>);
                                    }
                                })}
                            </div>
                        </div>);
                    })}
                </div>
            /* jshint ignore:end */
        );
    }
}