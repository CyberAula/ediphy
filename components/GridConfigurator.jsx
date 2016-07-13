import React, {Component} from 'react';
import { Button, FormControl, InputGroup, FormGroup, ControlLabel, OverlayTrigger, Popover} from 'react-bootstrap';

export default class GridConfigurator extends Component {
    render() {
        let advancedColumns= (
                <FormGroup>
                <ControlLabel>Column distribution</ControlLabel>
                <FormControl type="text"
                       key="grid"
                       value={this.props.container.colDistribution.join(" ")}
                       label="Column distribution"
                       style={{width: '100%'}}
                       onChange={e => {
                            let dist = e.target.value.split(" ").map(function (i){
                                if(i && !isNaN(parseFloat(i))){
                                    return parseFloat(i);
                                } else{ 
                                  return 0;
                                }
                            });
                            this.props.onColsChanged(this.props.id, this.props.parentId, dist);
                       }} />
                </FormGroup>);
              
        return (
            <div style={{width: '100%'}}>
            <FormGroup>
                <ControlLabel>Column number</ControlLabel>
                <InputGroup style={{width: '50%'}}>
                    <FormControl type="number"
                             key="grid"
                             value={this.props.container.colDistribution.length}
                             label="Column number"
                             style={{width: '100%'}}
                             min={1}
                             step={1}
                             onChange={e => {
                                  let dist = [];
                                  let arr = e.target.value;
                                  for ( let i = 0; i < arr  ; i++ ){
                                    dist.push(Math.round(100/arr * 100) / 100);
                                  }
                                  this.props.onColsChanged(this.props.id, this.props.parentId, dist);
                             }} />
                      <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={<Popover id="advancedcols"  title="Advanced">{advancedColumns}</Popover>}>
                        <InputGroup.Addon className="gc_addon"><i className="material-icons gridconficons ">settings</i></InputGroup.Addon>
                      </OverlayTrigger>
                  </InputGroup>
            </FormGroup>
            <div className="configurator">
              { this.props.container.cols.map((item, index) => {
                  return (<div className="gc_columns" key={index} style={{width: this.props.container.colDistribution[index]+'%'}}>
                    { item.map((it, index) => {
                        return <div className="gc_rows" key={index} style={{ height: it+'%'}}></div>
                    })}
                  </div>);
              })}
            </div>
                { this.props.container.cols.map((item, index) => {
                    let advancedRows = (
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
                                                  if(i && !isNaN(parseFloat(i))){
                                                    return parseFloat(i);
                                                  } else { 
                                                    return 0;
                                                  }
                                              });
                                              console.log(dist)
                                              this.props.onRowsChanged(this.props.id, this.props.parentId, index, dist);
                                        }} />
                        </FormGroup>

                      )
                      return ( 
                       <FormGroup key={index+'_0'}>
                        <ControlLabel>{"Row number in col " + (index + 1)}</ControlLabel>
                        <InputGroup style={{width: '50%'}}>
                            <FormControl  type="number"
                                          value={item.length}
                                          label={"Row number in col " + (index + 1)}
                                          min={1}
                                          step={1}
                                          style={{width: '100%'}}
                                          onChange={e => {
                                                let dist = [];
                                                let arr = e.target.value;
                                                for ( let i = 0; i < arr  ; i++ ){
                                                  dist.push(Math.round(100/arr * 100) / 100);
                                                }
                                                this.props.onRowsChanged(this.props.id, this.props.parentId, index, dist);
                                          }} />
                            <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={<Popover id="advancedrows" title="Advanced">{advancedRows}</Popover>}>
                              <InputGroup.Addon className="gc_addon"><i className="material-icons gridconficons ">settings</i></InputGroup.Addon>
                            </OverlayTrigger>
                          </InputGroup>
                      </FormGroup> )
                  })
                }


            </div>
        )
    }
}