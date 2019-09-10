import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputGroup, FormGroup, ControlLabel, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import ColorPicker from '../../common/colorPicker/ColorPicker';
import i18n from 'i18next';
import RadioButtonFormGroup from '../radioButtonFormGroup/RadioButtonFormGroup';
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import './_gridConfigurator.scss';

/**
 * Toolbar structure component for Sortable Containers
 */
export default class GridConfigurator extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Default height
         * @type {number}
         */
        this.height = 200;
    }

    /**
     * Render React Component
     * @returns {XML}
     */
    render() {
        let alignment = this.props.container.style ? (this.props.container.style.textAlign ? this.props.container.style.textAlign : 'center') : 'center';
        let advancedColumns = (
            <FormGroup>
                <ControlLabel>{i18n.t('messages.columns_distribution')}</ControlLabel>
                <FormControl type="text"
                    key="grid"
                    value={this.props.container.colDistribution.join(" ")}
                    label={i18n.t('messages.columns_distribution')}
                    style={{ width: '100%' }}
                    onChange={e => {
                        let dist = e.target.value.split(" ").map(function(i) {
                            if (i && !isNaN(parseFloat(i, 10))) {
                                return parseFloat(i, 10);
                            }
                            return 0;

                        });
                        this.props.onColsChanged(this.props.id, this.props.parentId, dist, this.props.container.children);
                    }}/>
            </FormGroup>
        );
        let tooltip = (
            <Tooltip id="tooltipHeight">
                {i18n.t('messages.height_auto_warning')}
            </Tooltip>
        );
        let height = this.props.sortableProps.height;

        return (
            <div style={{ width: '100%' }}>
                <h4 className="sortableToolbarTitle">{i18n.t('Structure')}</h4>
                <FormGroup>
                    <OverlayTrigger rootClose trigger="click" placement="left"
                        overlay={height !== 'auto' ? tooltip : <Tooltip id="none" style={{ display: 'none' }}/>}>
                        <InputGroup style={{ width: '10%', float: 'right' }}>
                            <ControlLabel> auto</ControlLabel>
                            <ToggleSwitch
                                key="height"
                                checked={height === 'auto'}
                                onChange={() => {
                                    let current = height === 'auto';
                                    let newHeight = current ? parseFloat(document.getElementById(this.props.id).clientHeight, 10) : 'auto';
                                    this.props.onSortableContainerResized(this.props.id, this.props.parentId, newHeight);
                                }}/>
                        </InputGroup>
                    </OverlayTrigger>
                    <ControlLabel>{i18n.t('Height')}</ControlLabel>
                    <InputGroup style={{ width: '50%' }}>
                        <FormControl type={height === 'auto' ? 'text' : 'number'}
                            key="height"
                            disabled={height === 'auto'}
                            value={height === 'auto' ? 'auto' : parseFloat(height, 10) /* parseFloat(document.getElementById(this.props.id).style.height)*/}
                            style={{ width: '100%' }}
                            min={1}
                            step={1}
                            onChange={e => {
                                this.props.onSortableContainerResized(this.props.id, this.props.parentId, e.target.value);
                            }}/>
                    </InputGroup>

                    <RadioButtonFormGroup key="alignment"
                        title={i18n.t('Alignment')}
                        options={['left', 'center', 'right']}
                        selected={alignment}
                        click={(option) => {this.props.onSortablePropsChanged(this.props.id, this.props.parentId, 'textAlign', option);}}
                        tooltips={[i18n.t('messages.align_left'), i18n.t('messages.align_center'), i18n.t('messages.align_right')]}
                        icons={['format_align_left', 'format_align_center', 'format_align_right']}/>
                </FormGroup>
                <div className="configurator">
                    {this.props.container.cols.map((item, index) => {
                        return (<div className="gc_columns" key={index}
                            style={{ width: this.props.container.colDistribution[index] + '%' }}>
                            { item.map((it, ind) => {
                                return <div className="gc_rows" key={ind} style={{ height: it + '%' }} />;
                            })}
                        </div>);
                    })}
                </div>

                <FormGroup>
                    <ControlLabel>{i18n.t('col_number')}</ControlLabel>
                    <InputGroup style={{ width: '50%' }}>
                        <FormControl type="number"
                            key="grid"
                            value={this.props.container.colDistribution.length}
                            style={{ width: '100%' }}
                            min={1}
                            step={1}
                            onChange={e => {
                                let dist = [];
                                let arr = e.target.value;
                                for (let i = 0; i < arr; i++) {
                                    dist.push(Math.round(100 / arr * 100) / 100);
                                }
                                this.props.onColsChanged(this.props.id, this.props.parentId, dist, this.props.container.children);
                            }}/>
                        <OverlayTrigger trigger="click" rootClose placement="bottom"
                            overlay={<Popover id="advancedcols" className="advancedPopover" title="Avanzado">{advancedColumns}</Popover>}>
                            <InputGroup.Addon className="gc_addon"><i
                                className="material-icons gridconficons ">settings</i></InputGroup.Addon>
                        </OverlayTrigger>
                    </InputGroup>
                </FormGroup>

                { this.props.container.cols.map((item, index) => {
                    let advancedRows = (
                        <FormGroup key={index}>
                            <ControlLabel>{i18n.t('col_dist') + (index + 1)}</ControlLabel>
                            <FormControl type="text"
                                value={item.join(" ")}
                                label={i18n.t('col_dist') + (index + 1)}
                                min={1}
                                step={1}
                                style={{ width: '100%' }}
                                onChange={e => {
                                    let dist = e.target.value.split(" ").map(function(i) {
                                        if(i && !isNaN(parseFloat(i, 10))) {
                                            return parseFloat(i, 10);
                                        }
                                        return 0;

                                    });
                                    this.props.onRowsChanged(this.props.id, this.props.parentId, index, dist, this.props.container.children);
                                }}/>
                        </FormGroup>

                    );
                    return (
                        <FormGroup key={index + '_0'}>
                            <ControlLabel>{i18n.t('row_number') + (index + 1)}</ControlLabel>
                            <InputGroup style={{ width: '50%' }}>
                                <FormControl type="number"
                                    value={item.length}
                                    label={i18n.t('row_number') + (index + 1)}
                                    min={1}
                                    step={1}
                                    style={{ width: '100%' }}
                                    onChange={e => {
                                        let dist = [];
                                        let arr = e.target.value;
                                        for (let i = 0; i < arr; i++) {
                                            dist.push(Math.round(100 / arr * 100) / 100);
                                        }
                                        this.props.onRowsChanged(this.props.id, this.props.parentId, index, dist, this.props.container.children);
                                    }}/>
                                <OverlayTrigger trigger="click" rootClose placement="bottom"
                                    overlay={<Popover id="advancedrows" className="advancedPopover" title={i18n.t('Advanced')}>{advancedRows}</Popover>}>
                                    <InputGroup.Addon className="gc_addon"><i className="material-icons gridconficons ">settings</i></InputGroup.Addon>
                                </OverlayTrigger>
                            </InputGroup>
                        </FormGroup>);
                })
                }
                <h4 className="sortableToolbarTitle">{i18n.t('Style')}</h4>
                <FormGroup>
                    <ControlLabel>{i18n.t('styles.padding') + ' (px)'}</ControlLabel>
                    <FormControl type="number"
                        value={this.props.container.style ? parseFloat(this.props.container.style.padding, 10) : 0}
                        label={"Padding"}
                        min={0}
                        max={100}
                        style={{ width: '100%' }}
                        onChange={e => {
                            this.props.onSortablePropsChanged(this.props.id, this.props.parentId, 'padding', e.target.value + 'px');
                        }}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{i18n.t('styles.border_color')}</ControlLabel>
                    <ColorPicker
                        value={this.props.container.style ? this.props.container.style.borderColor : '#ffffff'}
                        onChange={e => {
                            this.props.onSortablePropsChanged(this.props.id, this.props.parentId, 'borderColor', e.color);
                        }}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{i18n.t('styles.border_size')}</ControlLabel>
                    <FormControl type="number"
                        value={this.props.container.style ? parseFloat(this.props.container.style.borderWidth, 10) : 0}
                        min={0}
                        style={{ width: '100%' }}
                        onChange={e => {
                            this.props.onSortablePropsChanged(this.props.id, this.props.parentId, 'borderWidth', e.target.value + 'px');
                        }}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{i18n.t('styles.opacity')}</ControlLabel>
                    <span className='rangeOutput'>
                        {this.props.container.style ? this.props.container.style.opacity : 1 + '%'}
                    </span>
                    <FormControl type="range" className="rangeInput"
                        value={this.props.container.style ? this.props.container.style.opacity : 1 + '%'}
                        style={{ width: '100%' }}
                        min={0}
                        step={0.05}
                        max={1}
                        onChange={e => {
                            this.props.onSortablePropsChanged(this.props.id, this.props.parentId, 'opacity', e.target.value);
                        }}/>
                </FormGroup>
                {React.createElement(FormGroup, { key: 'borderstyle' },
                    [React.createElement(ControlLabel, { key: 'estiloborde' }, i18n.t('styles.border_style')),
                        React.createElement(FormControl, {
                            componentClass: 'select',
                            value: this.props.container.style ? this.props.container.style.borderStyle : 'none',
                            key: 'sel',
                            onChange: e => {
                                this.props.onSortablePropsChanged(this.props.id, this.props.parentId, 'borderStyle', e.target.value);
                            },
                        },
                        ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']
                            .map((option, index) => {
                                return (React.createElement('option',
                                    { key: 'child_' + index, value: option }, option));
                            }))])
                }
            </div>
        );
    }
}

GridConfigurator.propTypes = {
    /**
     * Identificador del elemento del DOM
     */
    id: PropTypes.string,
    /**
     * Identificador de la caja seleccionada
     */
    parentId: PropTypes.any.isRequired,
    /**
     * Contenedor actual
     */
    container: PropTypes.any.isRequired,
    /**
     * Cambia las distribución de columnas
     */
    onColsChanged: PropTypes.func.isRequired,
    /**
     * Cambia las distribución de filas
     */
    onRowsChanged: PropTypes.func.isRequired,
    /**
     * Propiedades del sortable container
     */
    sortableProps: PropTypes.object,
    /**
     * Cambia las propiedades del sortable container
     */
    onSortablePropsChanged: PropTypes.func.isRequired,
    /**
     * Redimensiona el sortable container
     */
    onSortableContainerResized: PropTypes.func.isRequired,
};
