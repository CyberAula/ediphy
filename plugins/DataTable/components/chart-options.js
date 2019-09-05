import React from "react";
import { Form, FormGroup, FormControl, Col, Radio } from "react-bootstrap";
import ToggleSwitch from '@trendmicro/react-toggle-switch';

import i18n from 'i18next';
/* eslint-disable react/prop-types */

export default class ChartOptions extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h4>{i18n.t("DataTable.header.options")}</h4>
                <div className="content-block options-table">
                    <Form horizontal>
                        <FormGroup>
                            <Col xs={12} sm={3}>
                                <label htmlFor="">{i18n.t("DataTable.options.initialPageLength")}</label>
                                <FormControl type="number" value={this.props.options.initialPageLength} onChange={(e)=>{if (!isNaN(parseInt(e.target.value, 10))) { this.props.optionsChanged({ initialPageLength: parseInt(e.target.value, 10) });}}}/>
                                <br/>
                                <label htmlFor="">{i18n.t("DataTable.options.initialSortProp")}</label>
                                <FormControl componentClass="select" placeholder="line" value={this.props.options.initialSort || this.props.keys[0] || 0} onChange={(e)=>{this.props.optionsChanged({ initialSort: e.target.value });}}>
                                    {/* <option key={"DEFAULT_0"} value={0}>{" "}</option>*/}
                                    {this.props.keys.map(key=>{
                                        return(<option key={key} value={key}>{key}</option>);
                                    })}

                                </FormControl>
                                <br/>
                                <label htmlFor="">{i18n.t("DataTable.options.initialOrderProp")}</label>
                                <FormGroup>
                                    <Radio name="radioGroup" inline style={{ marginLeft: '15px' }} onChange={()=>{this.props.optionsChanged({ initialOrder: 'ascending' });}} checked={this.props.options.initialOrder === 'ascending'}>
                                        {i18n.t("DataTable.options.ascending")}
                                    </Radio>
                                    <br/>
                                    <Radio name="radioGroup" inline style={{ marginLeft: '15px' }} onChange={()=>{this.props.optionsChanged({ initialOrder: 'descending' });}} checked={this.props.options.initialOrder === 'descending'}>
                                        {i18n.t("DataTable.options.descending")}
                                    </Radio>
                                </FormGroup>
                            </Col>
                            <Col xs={12} sm={5} id="thirdCol" >
                                {/* <label>{i18n.t("DataTable.options.labels")}</label> */}
                                <div style={{ display: this.props.options.disableRowChoice ? 'none' : 'block' }}>
                                    <label htmlFor="">{i18n.t("DataTable.options.pageSizeLabel")}</label>
                                    <FormControl type="text" value={this.props.options.pageSizeLabel} onChange={(e)=>{this.props.optionsChanged({ pageSizeLabel: e.target.value });}}/>
                                </div>
                                <br/>
                                <div className="col-xs-12 col-md-5" style={{ display: this.props.options.disableFilter ? 'none' : 'block', padding: '0px' }}>
                                    <label htmlFor="">{i18n.t("DataTable.options.searchLabel")}</label>
                                    <FormControl type="text" value={this.props.options.searchLabel} onChange={(e)=>{this.props.optionsChanged({ searchLabel: e.target.value });}}/>
                                </div>
                                <div className="col-xs-12 col-md-6 col-md-push-1" style={{ display: this.props.options.disableFilter ? 'none' : 'block', padding: '0px' }}>
                                    <label htmlFor="">{i18n.t("DataTable.options.searchPlaceholder")}</label>
                                    <FormControl type="text" value={this.props.options.searchPlaceholder} placeholder="Introduce aquí tu búsqueda" onChange={(e)=>{this.props.optionsChanged({ searchPlaceholder: e.target.value });}}/>
                                </div>
                                <br/><br/>
                                <div>
                                    <label htmlFor="">{i18n.t("DataTable.options.noDataLabel")}</label>
                                    <FormControl type="text" value={this.props.options.noDataLabel} onChange={(e)=>{this.props.optionsChanged({ noDataLabel: e.target.value });}}/>
                                </div>
                            </Col>
                            <Col xs={12} sm={4}>
                                <label htmlFor="">{i18n.t("DataTable.show")}</label><br/>
                                <ToggleSwitch className="mycb"
                                    size="lg"
                                    label={i18n.t('DataTable.options.disableFilter')}
                                    checked={!this.props.options.disableFilter}
                                    onChange={()=> this.props.optionsChanged({ disableFilter: !this.props.options.disableFilter })}/>
                                {i18n.t('DataTable.options.disableFilter')}<br/>
                                <ToggleSwitch className="mycb"
                                    size="lg"
                                    label={i18n.t('DataTable.options.disablePagination')}
                                    checked={!this.props.options.disablePagination}
                                    onChange={()=> this.props.optionsChanged({ disablePagination: !this.props.options.disablePagination })}/>
                                {i18n.t('DataTable.options.disablePagination')}<br/>
                                <ToggleSwitch className="mycb"
                                    size="lg"
                                    label={i18n.t('DataTable.options.disableRowChoice')}
                                    checked={!this.props.options.disableRowChoice}
                                    onChange={()=> this.props.optionsChanged({ disableRowChoice: !this.props.options.disableRowChoice })}/>
                                {i18n.t('DataTable.options.disableRowChoice')} <br/><br/>
                                <label> {i18n.t("DataTable.theme.label")}</label>
                                <FormControl onChange={(e)=>{this.props.optionsChanged({ theme: e.target.value });}} value={this.props.options.theme} componentClass="select" placeholder="...">
                                    <option value="basic">
                                        {i18n.t("DataTable.theme.basic")}
                                    </option>
                                    <option value="striped">
                                        {i18n.t("DataTable.theme.striped")}
                                    </option>
                                    <option value="rows-only">
                                        {i18n.t("DataTable.theme.rows-only")}
                                    </option>
                                    <option value="solid">
                                        {i18n.t("DataTable.theme.solid")}
                                    </option>
                                    <option value="thick">
                                        {i18n.t("DataTable.theme.thick")}
                                    </option>
                                </FormControl>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        );
    }
}
/* eslint-enable react/prop-types */
