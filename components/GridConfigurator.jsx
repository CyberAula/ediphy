import React, {Component} from 'react';
import {Input, Button} from 'react-bootstrap';

export default class GridConfigurator extends Component {
    render() {
        return (
            <div style={{width: '100%'}}>
                {this.props.id}
                <Input type="text"
                       value={this.props.container.colDistribution.join(" ")}
                       label="Column distribution"
                       style={{width: '100%'}}
                       onChange={e => {
                            let dist = e.target.value.split(" ").map(function (i){
                                if(i && !isNaN(parseInt(i))){
                                    return parseInt(i);
                                }
                            });
                            this.props.onColsChanged(this.props.id, this.props.parentId, dist);
                       }} />
                {
                    this.props.container.cols.map((item, index) => {
                        return <Input key={index}
                                      type="text"
                                      value={item.join(" ")}
                                      label={"Row distribution in col " + (index + 1)}
                                      min={1}
                                      step={1}
                                      style={{width: '100%'}}
                                      onChange={e => {
                                            let dist = e.target.value.split(" ").map(function (i){
                                                if(i && !isNaN(parseInt(i))){
                                                    return parseInt(i);
                                                }
                                            });
                                            this.props.onRowsChanged(this.props.id, this.props.parentId, index, dist);
                                      }} />;
                    })
                }
            </div>
        )
    }
}