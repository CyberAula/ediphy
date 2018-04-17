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
        this.state = {
            dataProcessed: [],
            keys: [],
            values: [],
            options: this.props.options,
        };
    }

    componentDidMount() {
        let { clientWidth } = this.refs.chartContainer;
        this.setState({ chartWidth: clientWidth });
    }

    dataChanged(values) {
        let dataObject = [];
        let keys = values.keys.slice();
        let data = values.data.slice();
        for (let i = 0; i < keys.length; i++) {
            let object = { name: keys[i] };
            for (let o = 0; o < data.length; o++) {
                let value = isNaN(data[o][i]) || typeof(data[o][i]) === "boolean" || data[o][i] === "" || data[o][i] === null ? data[o][i] : parseFloat(data[o][i], 10);
                object[o] = value;
            }
            dataObject.push(object);
        }

        this.props.updateState({ ...this.props.state, editing: false, dataProvided: [values.keys].slice().concat(values.data.slice()), dataProcessed: dataObject });
        /* CONVERSOR BETWEEN OLD AND NEW */

        this.setOptions(keys, data, dataObject);
    }

    setOptions(keys, values, dataObject) {
        let options = JSON.parse(JSON.stringify(this.props.state.options));
        this.setState({ ...this.props.state, dataProcessed: dataObject, keys: keys, values: values, options: options });
    }

    optionsChanged(options) {
        this.props.updateState({ ...this.props.state, options: { ...this.props.state.options, ...options } });
    }

    editButtonClicked() {
        this.props.updateState({ ...this.props.state, editing: true });
    }

    render() {
        let { dataProcessed, dataProvided, editing, options } = this.props.state;
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
                        <DataProvider dataProvided={dataProvided} dataChanged={this.dataChanged}/>
                        }
                        {!editing &&
                        <ChartOptions dataProcessed={dataProcessed} options={options} dataProvided={dataProvided} optionsChanged={this.optionsChanged}/>
                        }
                    </Col>
                    <div className="col-xs-12 col-lg-7" ref="chartContainer" style={{ padding: '0px' }}>
                        {!editing &&
                        <div style={{ height: '300px', width: '95%' }}>
                            <h4>{i18n.t("GraficaD3.preview")}</h4>
                            <Chart dataProcessed={dataProcessed} options={options} keys={this.state.keys} values={this.state.values} width={this.state.chartWidth}
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
