import React from "react";
import { Button, Col, Grid, Row } from "react-bootstrap";
import i18n from 'i18next';
import DataProvider from './data-provider';
import ChartOptions from './chart-options';
import Chart from './chart-component';

export default class Config extends React.Component {

    constructor(props) {
        super(props);
        this.modifyState = this.modifyState.bind(this);
        this.dataChanged = this.dataChanged.bind(this);
        this.setOptions = this.setOptions.bind(this);
        this.optionsChanged = this.optionsChanged.bind(this);
        this.editButtonClicked = this.editButtonClicked.bind(this);
        this.updateChart = this.updateChart.bind(this);
        this.state = props.state;
    }

    componentDidUpdate(nextProps, nextState) {
        if (nextProps.state.editing === false) {
            nextProps.configModalNeedsUpdate();
        }
    }
    componentWillUpdate(nextProps,nextState){
        nextProps.base.setState("options", this.state.options);
        nextProps.base.setState("data", this.state.data);
        nextProps.base.setState("keys", this.state.keys);
        nextProps.base.setState("valueKeys", this.state.valueKeys);
        nextProps.base.setState("editing", this.state.editing);
    }

    componentDidMount() {
        let { clientWidth } = this.refs.chartContainer;
        this.setState({ chartWidth: clientWidth });
    }

    modifyState() {

    }

    dataChanged(values) {
        this.setState({ editing: false });
        this.state.base.setState("data", values.data);
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
                data[o][keys[i]] = isNaN(data[o][keys[i]]) || typeof(data[o][keys[i]]) === "boolean" || data[o][keys[i]] === "" || data[o][keys[i]] === null ? data[o][keys[i]] : parseFloat(data[o][keys[i]], 10);
                if (key.notNumber) {
                    nKeys[i].notNumber = isNaN(row[key.value]) || typeof(row[key.value]) === "boolean" || row[key.value] === "";
                }
            }
        }

        let valueKeys = [];
        for (let key of nKeys) {
            if (!key.notNumber) {
                valueKeys.push(key.value);
            }
        }
        let options = this.state.options;
        options.x = keys[0];
        options.y = [{ key: valueKeys[0], color: "#1FC8DB" }];
        options.rings = [{ name: keys[0], value: valueKeys[0], color: "#1FC8DB" }];
        this.setState({ data: data, keys: keys, valueKeys: valueKeys, options: options });
    }

    optionsChanged(options) {
        this.setState({ options: options });
        this.state.base.setState("options", options);
        this.updateChart();
    }

    editButtonClicked() {
        this.setState({ editing: true });
    }

    updateChart() {
        this.setState({ key: Math.random() });
    }

    render() {

        return (
            <Grid>
                <Row>
                    <Col lg={this.state.editing ? 12 : 5} xs={12}>
                        <h4> {i18n.t("GraficaD3.header.origin")} </h4>
                        {!this.state.editing &&
                        <Button onClick={this.editButtonClicked} style={{ marginTop: '0px' }}
                            className="btn-primary">{i18n.t("GraficaD3.edit")}</Button>
                        }
                        {this.state.editing &&
                        <DataProvider data={this.state.data} dataChanged={this.dataChanged} keys={this.state.keys}
                            valueKeys={this.state.valueKeys}/>
                        }
                        {!this.state.editing &&
                        <ChartOptions options={this.state.options} optionsChanged={this.optionsChanged}
                            keys={this.state.keys} valueKeys={this.state.valueKeys}/>
                        }
                    </Col>
                    <div className="col-xs-12 col-lg-7" ref="chartContainer" style={{ padding: '0px' }}>
                        {!this.state.editing &&
                        <div style={{ height: '300px', width: '95%' }}>
                            <h4>Previsualización</h4>
                            <Chart data={this.state.data} options={this.state.options} width={this.state.chartWidth}
                                key={this.state.key}/>
                        </div>
                        }
                    </div>
                </Row>
            </Grid>
        );
    }

}
