import React from "react";
import { Form, FormGroup, FormControl, Col, Radio } from "react-bootstrap";
import ToggleSwitch from '@trendmicro/react-toggle-switch';

import i18n from 'i18next';

export default class ChartOptions extends React.Component {
    constructor(props) {
        super(props);
        let options = this.props.options;
        options.keys = this.props.keys;
        this.state = options;
    }

    componentDidUpdate(prevProps, prevState) {

        if(prevState !== this.state) {
            if (typeof this.props.optionsChanged === 'function') {
                // console.log(this.state);
                this.props.optionsChanged({
                    disableFilter: this.state.disableFilter,
                    disableRowChoice: this.state.disableRowChoice,
                    disablePagination: this.state.disablePagination,
                    pageSizeLabel: this.state.pageSizeLabel,
                    searchLabel: this.state.searchLabel,
                    searchPlaceholder: this.state.searchPlaceholder,
                    initialPageLength: this.state.initialPageLength,
                    noDataLabel: this.state.noDataLabel,
                    initialSort: this.state.initialSort || this.props.options.keys[0] || 0,
                    initialOrder: this.state.initialOrder,
                    theme: this.state.theme || 'basic',
                });
            }
        }
    }
    render() {
        return (
            <div>
                <h4>{i18n.t("DataTable.header.options")}</h4>
                <div className="content-block">
                    <Form horizontal>
                        <FormGroup>
                            <Col xs={12} sm={3}>
                                <label htmlFor="">{i18n.t("DataTable.show")}</label><br/>
                                <ToggleSwitch className="mycb"
                                    size="sm"
                                    label={i18n.t('DataTable.options.disableFilter')}
                                    checked={!this.state.disableFilter}
                                    onChange={()=> this.setState({ disableFilter: !this.state.disableFilter })}/>
                                {i18n.t('DataTable.options.disableFilter')}<br/>
                                <ToggleSwitch className="mycb"
                                    size="sm"
                                    label={i18n.t('DataTable.options.disablePagination')}
                                    checked={!this.state.disablePagination}
                                    onChange={()=> this.setState({ disablePagination: !this.state.disablePagination })}/>
                                {i18n.t('DataTable.options.disablePagination')}<br/>
                                <ToggleSwitch className="mycb"
                                    size="sm"
                                    label={i18n.t('DataTable.options.disableRowChoice')}
                                    checked={!this.state.disableRowChoice}
                                    onChange={()=> this.setState({ disableRowChoice: !this.state.disableRowChoice })}/>
                                {i18n.t('DataTable.options.disableRowChoice')} <br/>
                                <br/>
                                <label htmlFor="">{i18n.t("DataTable.options.initialPageLength")}</label>
                                <FormControl type="number" value={this.state.initialPageLength} onChange={(e)=>{if (!isNaN(parseInt(e.target.value, 10))) { this.setState({ initialPageLength: parseInt(e.target.value, 10) });}}}/>

                            </Col>
                            <Col xs={12} sm={3}>
                                <label htmlFor="">{i18n.t("DataTable.options.initialSortProp")}</label>
                                <FormControl componentClass="select" placeholder="line" value={this.state.initialSort || this.props.options.keys[0] || 0} onChange={(e)=>{this.setState({ initialSort: e.target.value });}}>
                                    {/* <option key={"DEFAULT_0"} value={0}>{" "}</option>*/}
                                    {this.state.keys.map(key=>{
                                        return(<option key={key} value={key}>{key}</option>);
                                    })}

                                </FormControl>
                                <label htmlFor="">{i18n.t("DataTable.options.initialOrderProp")}</label>
                                <FormGroup>
                                    <Radio name="radioGroup" inline style={{ marginLeft: '15px' }} onChange={e=>{this.setState({ initialOrder: 'ascending' });}} checked={this.state.initialOrder === 'ascending'}>
                                        {i18n.t("DataTable.options.ascending")}
                                    </Radio>
                                    <br/>
                                    <Radio name="radioGroup" inline style={{ marginLeft: '15px' }} onChange={e=>{this.setState({ initialOrder: 'descending' });}} checked={this.state.initialOrder === 'descending'}>
                                        {i18n.t("DataTable.options.descending")}
                                    </Radio>
                                </FormGroup>
                                <label> {i18n.t("DataTable.theme.label")}</label>
                                <FormControl onChange={(e)=>{this.setState({ theme: e.target.value });}} value={this.state.theme} componentClass="select" placeholder="...">
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
                            <Col xs={12} sm={6} id="thirdCol" >
                                <label>{i18n.t("DataTable.options.labels")}</label>
                                <div style={{ display: this.state.disableRowChoice ? 'none' : 'block' }}>
                                    <label htmlFor="">{i18n.t("DataTable.options.pageSizeLabel")}</label>
                                    <FormControl type="text" value={this.state.pageSizeLabel} onChange={(e)=>{this.setState({ pageSizeLabel: e.target.value });}}/>
                                </div>
                                <div className="col-xs-12 col-md-5" style={{ display: this.state.disableFilter ? 'none' : 'block', padding: '0px' }}>
                                    <label htmlFor="">{i18n.t("DataTable.options.searchLabel")}</label>
                                    <FormControl type="text" value={this.state.searchLabel} onChange={(e)=>{this.setState({ searchLabel: e.target.value });}}/>
                                </div>
                                <div className="col-xs-12 col-md-6 col-md-push-1" style={{ display: this.state.disableFilter ? 'none' : 'block', padding: '0px' }}>
                                    <label htmlFor="">{i18n.t("DataTable.options.searchPlaceholder")}</label>
                                    <FormControl type="text" value={this.state.searchPlaceholder} placeholder="Introduce aquí tu búsqueda" onChange={(e)=>{this.setState({ searchPlaceholder: e.target.value });}}/>
                                </div>
                                <div>
                                    <label htmlFor="">{i18n.t("DataTable.options.noDataLabel")}</label>
                                    <FormControl type="text" value={this.state.noDataLabel} onChange={(e)=>{this.setState({ noDataLabel: e.target.value });}}/>
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup />
                    </Form>
                </div>
            </div>
        );
    }
}
