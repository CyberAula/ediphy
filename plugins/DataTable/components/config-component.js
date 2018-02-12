import React from "react";
import { Button, Col, Grid, Row } from "react-bootstrap";
import i18n from 'i18next';
import TableComponent from './table-component';
import DataProvider from './data-provider';
import ChartOptions from './chart-options';
/* eslint-disable react/prop-types */

export default class Config extends React.Component {
    render() {

        this.modifyState();
        return (
            <Grid>
                <Row>

                    <Col lg={12} xs={12}>
                        <h4> {i18n.t("DataTable.header.origin")} </h4>
                        {!this.state.editing &&
                        <Button onClick={this.editButtonClicked} style={{ marginTop: '0px' }} className="btn-primary">{i18n.t("DataTable.edit")} </Button>
                        }
                        {this.state.editing &&
                        <DataProvider data={this.state.data} dataChanged={this.dataChanged} keys={this.state.keys} />
                        }
                        {!this.state.editing &&
                        <ChartOptions options={this.state.options} optionsChanged={this.optionsChanged} keys={this.state.keys} />
                        }
                    </Col>
                    <Col lg={12} xs={12} ><br/>
                        {!this.state.editing && <div>
                            <h4>{i18n.t("DataTable.header.preview")}</h4><br/>
                            <div style={{ marginRight: '-10px', marginLeft: '0px' }} ref="chartContainer" id="chartContainer">
                                <TableComponent data={this.state.data} options={this.state.options} key={this.state.key} />
                            </div>
                        </div>}
                        {!this.state.editing && <div id="previewOverlay"/>}
                    </Col>

                </Row>

            </Grid>

        );
    }
    constructor(props) {
        super(props);
        let state = this.props.state;
        // state.base = this.props.base;
        this.modifyState = this.modifyState.bind(this);
        this.dataChanged = this.dataChanged.bind(this);
        this.setOptions = this.setOptions.bind(this);
        this.optionsChanged = this.optionsChanged.bind(this);
        this.editButtonClicked = this.editButtonClicked.bind(this);
        this.updateChart = this.updateChart.bind(this);
        this.state = state;
    }

    componentDidUpdate(nextProps, nextState) {
        if(nextProps.state.editing === false) {
            this.props.base.configModalNeedsUpdate();
        }
    }

    modifyState() {
        this.props.base.setState("options", this.state.options);
        this.props.base.setState("data", this.state.data);
        this.props.base.setState("keys", this.state.keys);
        this.props.base.setState("editing", this.state.editing);
    }

    dataChanged(values) {

        this.setState({ editing: false });
        this.props.base.setState("data", values.data);
        this.setOptions(values.data, values.keys);
        this.updateChart();

    }

    setOptions(data, keys) {
        let nKeys = [];
        for (let i = 0; i < keys.length; i++) {
            let value = keys[i];
            nKeys[i] = {};
            nKeys[i].value = value;
            nKeys[i].notNumber = true;
        }

        for (let o = 0; o < data.length; o++) {
            let row = data[o];
            for (let i = 0; i < keys.length; i++) {
                let key = nKeys[i];
                data[o][keys[i]] = isNaN(data[o][keys[i]]) || typeof(data[o][keys[i]]) === "boolean" || data[o][keys[i]] === "" || data[o][keys[i]] === null ? data[o][keys[i]] : parseFloat(data[o][keys[i]]);
                if(key.notNumber) {
                    nKeys[i].notNumber = isNaN(row[key.value]) || typeof(row[key.value]) === "boolean" || row[key.value] === "";
                }
            }
        }

        let options = this.state.options;
        this.setState({ data: data, keys: keys, options: options });
    }

    optionsChanged(options) {
        // console.log("optionshanged");
        // console.log(options);
        this.setState({ options: options });
        this.props.base.setState("options", options);
        this.updateChart();
    }

    editButtonClicked() {
        // console.log("editButton");
        // console.log(this.state);
        this.setState({ editing: true });
    }

    updateChart() {
        this.forceUpdate();
        this.setState({ key: Math.random() });
    }

}

/* eslint-enable react/prop-types */
