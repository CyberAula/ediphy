import React from "react";
import { Form, FormGroup, FormControl, Col, Checkbox, Radio } from "react-bootstrap";

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
                    initialSort: this.state.initialSort,
                    initialOrder: this.state.initialOrder,
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
                            <Col xs={12}>
                                <FormControl.Static>
                                    {i18n.t("DataTable.show")}
                                </FormControl.Static>
                                <Col xs={12} >
                                    <Checkbox className="mycb" checked={!this.state.disableFilter}
                                        onChange={()=>{this.setState({ disableFilter: !this.state.disableFilter });}} />
                                    {i18n.t('DataTable.options.disableFilter')}</Col>
                                <Col xs={12} >
                                    <Checkbox className="mycb" checked={!this.state.disablePagination}
                                        onChange={()=>{this.setState({ disablePagination: !this.state.disablePagination });}} />
                                    {i18n.t('DataTable.options.disablePagination')}</Col>
                                <Col xs={12} >
                                    <Checkbox className="mycb" checked={!this.state.disableRowChoice}
                                        onChange={()=>{this.setState({ disableRowChoice: !this.state.disableRowChoice });}} />
                                    {i18n.t('DataTable.options.disableRowChoice')}</Col><br/><br/><br/>

                                <label htmlFor="">{i18n.t("DataTable.options.initialPageLength")}</label>
                                <FormControl type="number" value={this.state.initialPageLength}
                                    onChange={(e)=>{if (!isNaN(parseInt(e.target.value, 10))) { this.setState({ initialPageLength: parseInt(e.target.value, 10) });}}}/>
                                <label htmlFor="">{i18n.t("DataTable.options.initialSortProp")}</label>
                                <FormControl componentClass="select" placeholder="line"
                                    value={this.state.initialSort}
                                    onChange={(e)=>{this.setState({ initialSort: e.target.value });}}>
                                    <option key={"DEFAULT_0"} value={0}>{" "}</option>
                                    {this.state.keys.map(key=>{
                                        return(<option key={key} value={key}>{key}</option>);
                                    })}

                                </FormControl>
                                <label htmlFor="">{i18n.t("DataTable.options.initialOrderProp")}</label>
                                <FormGroup>
                                    <Radio name="radioGroup" inline style={{ marginLeft: '15px' }}
                                        onChange={e=>{this.setState({ initialOrder: 'ascending' });}}
                                        checked={this.state.initialOrder === 'ascending'}>
                                        {i18n.t("DataTable.options.ascending")}
                                    </Radio>

                                    <Radio name="radioGroup" inline style={{ marginLeft: '15px' }}
                                        onChange={e=>{this.setState({ initialOrder: 'descending' });}}
                                        checked={this.state.initialOrder === 'descending'}>
                                        {i18n.t("DataTable.options.descending")}
                                    </Radio>
                                </FormGroup>

                            </Col>
                            <Col xs={12}>
                                <div style={{ display: this.state.disableRowChoice ? 'none' : 'block' }}>
                                    <label htmlFor="">{i18n.t("DataTable.options.pageSizeLabel")}</label>
                                    <FormControl type="text" value={this.state.pageSizeLabel}
                                        onChange={(e)=>{this.setState({ pageSizeLabel: e.target.value });}}/>
                                </div>
                                <div style={{ display: this.state.disableFilter ? 'none' : 'block' }}>
                                    <label htmlFor="">{i18n.t("DataTable.options.searchLabel")}</label>
                                    <FormControl type="text" value={this.state.searchLabel}
                                        onChange={(e)=>{this.setState({ searchLabel: e.target.value });}}/>
                                </div>
                                <div style={{ display: this.state.disableFilter ? 'none' : 'block' }}>
                                    <label htmlFor="">{i18n.t("DataTable.options.searchPlaceholder")}</label>
                                    <FormControl type="text" value={this.state.searchPlaceholder}
                                        onChange={(e)=>{this.setState({ searchPlaceholder: e.target.value });}}/>
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
