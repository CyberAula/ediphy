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
            dataProcessed: {},
            keys: [],
            values: [],
            options: {},
        };
    }

    componentDidMount() {
        let { clientWidth } = this.refs.chartContainer;
        this.setState({ chartWidth: clientWidth });
    }

    dataChanged(values) {
        this.props.updateState({ ...this.props.state, editing: false, dataProvided: [values.keys].slice().concat(values.data.slice()) });
        /* CONVERSOR BETWEEN OLD AND NEW */
        let keys = values.keys.slice();
        let data = values.data.slice();

        this.setOptions(keys, data);
    }

    setOptions(keys, values) {
        let dataObject = [];
        for (let o = 0; o < values.length; o++) {
            for (let i = 0; i < keys.length; i++) {
                let value = isNaN(values[o][i]) || typeof(values[o][i]) === "boolean" || values[o][i] === "" || values[o][i] === null ? values[o][i] : parseFloat(values[o][i], 10);
                dataObject.push({ name: keys[i], value: value });
            }
        }

        let options = JSON.parse(JSON.stringify(this.props.state.options));
        this.setState({ ...this.props.state, dataProcessed: dataObject, keys: keys, values: values, options: options });
    }

    optionsChanged(options) {
        // this.props.updateState({ ...this.props.state, options });
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
                        <ChartOptions dataProcessed={this.state.dataProcessed} options={this.state.options} keys={this.state.keys} values={this.state.values} optionsChanged={this.optionsChanged}/>
                        }
                    </Col>
                    <div className="col-xs-12 col-lg-7" ref="chartContainer" style={{ padding: '0px' }}>
                        {!editing &&
                        <div style={{ height: '300px', width: '95%' }}>
                            <h4>Previsualización</h4>
                            <Chart dataProcessed={this.state.dataProcessed} options={this.state.options} keys={this.state.keys} values={this.state.values} width={this.state.chartWidth}
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
