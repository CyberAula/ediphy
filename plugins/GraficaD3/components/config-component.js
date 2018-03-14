import React from "react";
import { Button, Col, Grid, Row } from "react-bootstrap";
import i18n from 'i18next';
import DataProvider from './data-provider';
import ChartOptions from './chart-options';
import Chart from './chart-component';
/* eslint-disable react/prop-types */

export default class Config extends React.Component {

    constructor(props) {
        super(props);
        this.dataChanged = this.dataChanged.bind(this);
        this.setOptions = this.setOptions.bind(this);
        this.optionsChanged = this.optionsChanged.bind(this);
        this.editButtonClicked = this.editButtonClicked.bind(this);
    }

    componentDidMount() {
        let { clientWidth } = this.refs.chartContainer;
        this.setState({ chartWidth: clientWidth });
    }

    dataChanged(values) {
        this.props.updateState({ ...this.props.state, editing: false, dataProvided: values.dataProvided.slice(0) });
        /* CONVERSOR BETWEEN OLD AND NEW */
        let keys = values.dataProvided.slice(0).map((x)=>{return x[0];});
        let oldObjectStructure = new Array(values.dataProvided[0].length - 1);
        for(let n = 0; n < oldObjectStructure.length; n++) {
            oldObjectStructure[n] = {};
        }
        values.dataProvided.slice(0).forEach((array, indx)=>{
            for(let n = 1; n < array.length; n++) {
                oldObjectStructure[n - 1][array[0]] = array[n];
            }
        });
        /* CONVERSOR BETWEEN OLD AND NEW */

        this.setOptions(oldObjectStructure, keys);
        // this.updateChart();
    }

    setOptions(dataProcessed, keys) {
        let nKeys = [];
        for (let i = 0; i < keys.length; i++) {
            let value = keys[i];
            nKeys[i] = {};
            nKeys[i].value = value;
            nKeys[i].notNumber = true;
        }

        for (let o = 0; o < dataProcessed.length; o++) {
            let row = dataProcessed[o];
            for (let i = 0; i < keys.length; i++) {
                let key = nKeys[i];
                dataProcessed[o][keys[i]] = isNaN(dataProcessed[o][keys[i]]) || typeof(dataProcessed[o][keys[i]]) === "boolean" || dataProcessed[o][keys[i]] === "" || dataProcessed[o][keys[i]] === null ? dataProcessed[o][keys[i]] : parseFloat(dataProcessed[o][keys[i]], 10);
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
        let options = JSON.parse(JSON.stringify(this.props.state.options));
        options.x = keys[0];
        options.y = [{ key: valueKeys[0], color: "#17CFC8" }];
        options.rings = [{ name: keys[0], value: valueKeys[0], color: "#17CFC8" }];
        this.props.updateState({ ...this.props.state, dataProcessed: dataProcessed, keys: keys, valueKeys: valueKeys, options: options });
    }

    optionsChanged(options) {
        this.props.updateState({ ...this.props.state, options });
    }

    editButtonClicked() {
        this.props.updateState({ ...this.props.state, editing: true });
    }

    render() {
        let { dataProcessed, dataProvided, keys, editing, valueKeys, options } = this.props.state;
        return (
            <Grid>
                <Row>
                    <Col lg={editing ? 12 : 5} xs={12}>
                        <h4> {i18n.t("GraficaD3.header.origin")} </h4>
                        {!editing &&
                        <Button onClick={this.editButtonClicked} style={{ marginTop: '0px' }}
                            className="btn-primary">{i18n.t("GraficaD3.edit")}</Button>
                        }
                        {editing &&
                        <DataProvider dataProvided={dataProvided} dataChanged={this.dataChanged} keys={keys}
                            valueKeys={valueKeys}/>
                        }
                        {!editing &&
                        <ChartOptions options={options} optionsChanged={this.optionsChanged} keys={keys} valueKeys={valueKeys}/>
                        }
                    </Col>
                    <div className="col-xs-12 col-lg-7" ref="chartContainer" style={{ padding: '0px' }}>
                        {!editing &&
                        <div style={{ height: '300px', width: '95%' }}>
                            <h4>Previsualización</h4>
                            <Chart dataProcessed={dataProcessed} options={options} width={this.state.chartWidth}
                                key={2}/>
                        </div>
                        }
                    </div>
                </Row>
            </Grid>
        );
    }

}
/* eslint-enable react/prop-types */
