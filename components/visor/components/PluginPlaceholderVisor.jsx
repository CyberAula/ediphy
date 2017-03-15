import React, {Component} from 'react';
import BoxVisor from './BoxVisor';
import {isBox, isSortableBox, isView, isSortableContainer, isAncestorOrSibling} from './../../../utils';


export default class PluginPlaceholderVisor extends Component {
    render() {
        let container = this.props.parentBox.sortableContainers[this.props.pluginContainer];
        let className = "drg" + this.props.pluginContainer;
        if(this.props.boxLevelSelected - this.props.parentBox.level === 1 &&
           isAncestorOrSibling(this.props.parentBox.id, this.props.boxSelected, this.props.boxes)){
            className += " childBoxSelected";
        }
        return (
            /* jshint ignore:start */
            <div style={
                    Object.assign({},{
                        width: "100%",
                        height: container.height == 'auto' ? container.height : container.height + 'px',
                        minHeight: '35px',
                        textAlign: 'center',
                        lineHeight: '100%',
                        boxSizing: 'border-box',
                        position: 'relative',
                        display: 'table'
                    }, container.style)
                }
                 id={this.props.pluginContainer}
                 className={className}>
                {container.colDistribution.map((col, i) => {
                    if (container.cols[i]) {
                        return (<div key={i}
                                     style={{width: col + "%", height: '100%', display: "table-cell", verticalAlign: "top"}}>
                            {container.cols[i].map((row, j) => {
                                return (<div key={j}
                                             style={{width: "100%", height: row + "%", position: 'relative'}}
                                             >
                                    {container.children.map((idBox, index) => {
                                        if (this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                            return (<BoxVisor id={idBox}
                                                             key={index}
                                                             boxes={this.props.boxes}
                                                             boxSelected={this.props.boxSelected}
                                                             boxLevelSelected={this.props.boxLevelSelected}
                                                             containedViewSelected={this.props.containedViewSelected}
                                                             toolbars={this.props.toolbars}
                                                             lastActionDispatched={this.props.lastActionDispatched}
                                                             onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                                             onBoxMoved={this.props.onBoxMoved}
                                                             onBoxResized={this.props.onBoxResized}
                                                             onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                                             onSortableContainerResized={this.props.onSortableContainerResized}
                                                             onBoxDeleted={this.props.onBoxDeleted}
                                                             onBoxDropped={this.props.onBoxDropped}
                                                             onBoxModalToggled={this.props.onBoxModalToggled}
                                                             onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                                             onTextEditorToggled={this.props.onTextEditorToggled}/>);
                                        } else if (index == container.children.length - 1) {
                                            return (<span><br/><br/></span>);
                                        }
                                    })}
                                    {container.children.length === 0 ? (<span><br/><br/></span>) : ""}
                                </div>);
                            })}
                        </div>);
                    }
                })}
            </div>
            /* jshint ignore:end */
        );
    }

}
