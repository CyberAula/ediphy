import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import VisorDaliBox from '../visor/VisorDaliBox';

export default class VisorPluginPlaceholder extends Component {
    render() {
        let container = this.props.parentBox.sortableContainers[this.props.pluginContainer];
        return (
            <div style={{
                    border: "0",
                    width: "100%",
                    height: container ? container.height : "100%",
                    position: 'relative'}}>
                {container.colDistribution.map((col, i) => {
                    if (container.cols[i]) {
                        return (
                            <div key={i}
                                 style={{width: col + "%", height: '100%', float: 'left'}}>
                                {container.cols[i].map((row, j) => {
                                    return (<div key={j}
                                                 style={{width: "100%", height: row + "%", position: 'relative'}}>
                                        {container.children.map((idBox, index) => {
                                            if (this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                                return (<VisorDaliBox id={idBox}
                                                                 key={index}
                                                                 boxes={this.props.boxes}
                                                                 boxSelected={this.props.boxSelected}
                                                                 toolbars={this.props.toolbars} />);
                                            }
                                        })}
                                    </div>)
                                })}
                            </div>
                        )
                    }
                })}
            </div>
        );
    }
}