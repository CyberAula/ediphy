import React, {Component} from 'react';
import { Butto, FormControl, FormGroup, ControlLabel} from 'react-bootstrap';

export default class GridConfigurator extends Component {
    render() {
        return (
            <div style={{width: '100%'}}>
              <FormGroup>
                <ControlLabel>Column distribution</ControlLabel>
                <FormControl type="text"
                       key="grid"
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
                </FormGroup>

                {
                    this.props.container.cols.map((item, index) => {
                        return (
                        <FormGroup key={index}>
                          <ControlLabel>{"Row distribution in col " + (index + 1)}</ControlLabel>
                          <FormControl  type="text"
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
                                        }} />
                        </FormGroup>)

                    })
                }
            </div>
        )
    }
}