import React, {Component} from 'react';
import { Button, FormControl, InputGroup, FormGroup, ControlLabel, OverlayTrigger, Popover, Tooltip} from 'react-bootstrap';

export default class GridConfigurator extends Component {
    constructor(props) {
        super(props);
        this.height = 200;
    }

    render() {
        let advancedColumns = (
            /* jshint ignore:start */
            <FormGroup>
                <ControlLabel>Column distribution</ControlLabel>
                <FormControl type="text"
                             key="grid"
                             value={this.props.container.colDistribution.join(" ")}
                             label="Column distribution"
                             style={{width: '100%'}}
                             onChange={e => {
                            let dist = e.target.value.split(" ").map(function (i){
                                if (i && !isNaN(parseFloat(i))) {
                                    return parseFloat(i);
                                } else {
                                  return 0;
                                }
                            });
                            this.props.onColsChanged(this.props.id, this.props.parentId, dist);
                       }}/>
            </FormGroup>
            /* jshint ignore:end */
        );
        let tooltip = (
            /* jshint ignore:start */
            <Tooltip id="tooltipHeight">
                Sólo si fijas una altura podrán tener alturas relativas las cajas en su interior
            </Tooltip>
            /* jshint ignore:end */
        );
        let height = this.props.sortableProps.height;
        return (
            /* jshint ignore:start */
            <div style={{width: '100%'}}>
                <h4 className="sortableToolbarTitle">Estructura</h4>
                <FormGroup>
                    <OverlayTrigger rootClose trigger="click" placement="left"
                                    overlay={height != 'auto' ? tooltip: <Tooltip id="none" style={{display: 'none'}}/>}>
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
                               }}/>
                        </InputGroup>
                    </OverlayTrigger>
                    <ControlLabel>Height</ControlLabel>
                    <InputGroup style={{width: '50%'}}>
                        <FormControl type={height == 'auto' ? 'text' : 'number'}
                                     key="height"
                                     disabled={height == 'auto'}
                                     value={height == 'auto' ? 'auto' : parseFloat(height) /*parseFloat(document.getElementById(this.props.id).style.height)*/}
                                     label="Block Height"
                                     style={{width: '100%'}}
                                     min={1}
                                     step={1}
                                     onChange={e => {
                               this.props.onSortableContainerResized(this.props.id, this.props.parentId, e.target.value);
                             }}/>
                    </InputGroup>
                </FormGroup>
                <div className="configurator">
                    { this.props.container.cols.map((item, index) => {
                        return (<div className="gc_columns" key={index}
                                     style={{width: this.props.container.colDistribution[index]+'%'}}>
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
                             }}/>
                        <OverlayTrigger trigger="click" rootClose placement="bottom"
                                        overlay={<Popover id="advancedcols"  title="Advanced">{advancedColumns}</Popover>}>
                            <InputGroup.Addon className="gc_addon"><i
                                className="material-icons gridconficons ">settings</i></InputGroup.Addon>
                        </OverlayTrigger>
                    </InputGroup>
                </FormGroup>

                { this.props.container.cols.map((item, index) => {
                    let advancedRows = (
                        <FormGroup key={index}>
                            <ControlLabel>{"Row distribution in col " + (index + 1)}</ControlLabel>
                            <FormControl type="text"
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
                                        }}/>
                        </FormGroup>

                    );
                    return (
                        <FormGroup key={index+'_0'}>
                            <ControlLabel>{"Row number in col " + (index + 1)}</ControlLabel>
                            <InputGroup style={{width: '50%'}}>
                                <FormControl type="number"
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
                                          }}/>
                                <OverlayTrigger trigger="click" rootClose placement="bottom"
                                                overlay={<Popover id="advancedrows" title="Advanced">{advancedRows}</Popover>}>
                                    <InputGroup.Addon className="gc_addon"><i className="material-icons gridconficons ">settings</i></InputGroup.Addon>
                                </OverlayTrigger>
                            </InputGroup>
                        </FormGroup> )
                })
                }
                <h4 className="sortableToolbarTitle">Estilo</h4>
                <FormGroup>
                    <ControlLabel>Padding (px)</ControlLabel>
                    <FormControl type="number"
                                 value={this.props.container.style ? parseFloat(this.props.container.style.padding) : 0}
                                 label={"Padding"}
                                 min={0}
                                 max={100}
                                 style={{width: '100%'}}
                                 onChange={e => {
                                    this.props.onChangeSortableProps(this.props.id, this.props.parentId, 'padding', e.target.value + 'px');
                                }}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Color del borde</ControlLabel>
                    <FormControl type="color"
                                 value={this.props.container.style ? this.props.container.style.borderColor : '#ffffff'}
                                 label={"Color del borde"}
                                 style={{width: '100%'}}
                                 onChange={e => {
                                    this.props.onChangeSortableProps(this.props.id, this.props.parentId, 'borderColor', e.target.value);
                                }}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Grosor del borde</ControlLabel>
                    <FormControl type="number"
                                 value={this.props.container.style ? parseFloat(this.props.container.style.borderWidth) : 0}
                                 label={"Grosor del borde"}
                                 min={0}
                                 style={{width: '100%'}}
                                 onChange={e => {
                                    this.props.onChangeSortableProps(this.props.id, this.props.parentId, 'borderWidth', e.target.value + 'px');
                                }}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Opacidad</ControlLabel>
                    <span className='rangeOutput'>
                        {this.props.container.style ? this.props.container.style.opacity : 1 + '%'}
                    </span>
                    <FormControl type="range"
                                 value={this.props.container.style ? this.props.container.style.opacity : 1+'%'}
                                 label={"Opacidad"}
                                 style={{width: '100%'}}
                                 min={0}
                                 step={0.05}
                                 max={1}
                                 onChange={e => {
                                    this.props.onChangeSortableProps(this.props.id, this.props.parentId, 'opacity', e.target.value );
                                }}/>
                </FormGroup>
                {React.createElement(FormGroup, {key: 'borderstyle'},
                    [React.createElement(ControlLabel, {key: 'estiloborde'}, 'Estilo borde'),
                        React.createElement(FormControl, {
                                componentClass: 'select',
                                value: this.props.container.style ? this.props.container.style.borderStyle : 'none',
                                key: 'sel',
                                onChange: e => {
                                    this.props.onChangeSortableProps(this.props.id, this.props.parentId, 'borderStyle', e.target.value)
                                }
                            },
                            ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']
                                .map((option, index) => {
                                    return (React.createElement('option',
                                        {key: 'child_' + index, value: option}, option))
                                }))])
                }
            </div>
            /* jshint ignore:end */
        );
    }
}
