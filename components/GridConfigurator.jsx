import React, {Component} from 'react';
import { Button, FormControl, InputGroup, FormGroup, ControlLabel, OverlayTrigger, Popover, Tooltip} from 'react-bootstrap';

export default class GridConfigurator extends Component {
    constructor(props) {
        super(props);

        this.height = 200
    }
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
        let tooltip = <Tooltip id="tooltipHeight">Sólo si fijas una altura podrán tener alturas relativas las cajas en su interior</Tooltip>
        let height = this.props.sortableProps.height;
        return (
          <div style={{width: '100%'}}>
            <h4 className="sortableToolbarTitle">Estructura</h4>
            <FormGroup>
                <OverlayTrigger trigger="focus" placement="left" overlay={height != 'auto' ? tooltip: <i/>}>
                  <InputGroup style={{width: '10%', float: 'right'}}>
                  <ControlLabel> auto</ControlLabel>
                      <FormControl type="checkbox"
                               key="height"
                               value={height == 'auto' ? "checked" : "unchecked"}
                               checked={height == 'auto'}
                               label="Height auto"
                               style={{width: '100%'}}
                               onChange={e => {
                                  let current = height == 'auto'
                                  let newHeight = current ? parseFloat(document.getElementById(this.props.id).clientHeight) : 'auto';
                                  this.props.onSortableContainerResized(this.props.id, this.props.parentId, newHeight);
                               }} />
                  </InputGroup>
                </OverlayTrigger>
                <ControlLabel>Height</ControlLabel>
                <InputGroup style={{width: '50%'}}>
                    <FormControl type={height == 'auto' ? 'text' : 'number'}
                             key="height"
                             disabled={height == 'auto'}
                             value={height /*parseFloat(document.getElementById(this.props.id).style.height)*/}
                             label="Block Height"
                             style={{width: '100%'}}
                             min={1}
                             step={1}
                             onChange={e => {
                               this.props.onSortableContainerResized(this.props.id, this.props.parentId, e.target.value);
                             }} />
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
                <h4 className="sortableToolbarTitle">Estilo</h4>
                <span>Borde, fondo, padding, opacidad, etc</span>
                 

            </div>
        )
    }
}
