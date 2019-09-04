import React from "react";
import { Col, Grid, Row } from "react-bootstrap";
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
        this.changeAxis = this.changeAxis.bind(this);
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
        for (let i = 0; i < values.data.length; i++) {
            let object = { name: values.data[i][0] };
            for (let o = 0; o < data[0].length; o++) {
                let value = isNaN(data[i][o]) || typeof(data[i][o]) === "boolean" || data[i][o] === "" || data[i][o] === null ? data[i][o] : parseFloat(data[i][o], 10);
                object[o] = value;
            }
            dataObject.push(object);
        }

        this.props.updateState({ ...this.props.state, editing: false, keys: values.keys, dataProvided: [values.keys].slice().concat(values.data.slice()), dataProcessed: dataObject });
        /* CONVERSOR BETWEEN OLD AND NEW */

        this.setOptions(keys, data, dataObject);
    }

    changeAxis(value) {
        let oldvalue = this.props.state.options.xaxis;
        let newvalue = parseInt(value, 10);
        let options = { ...this.props.state.options, xaxis: newvalue };
        let newData = this.props.state.dataProcessed.slice();
        // go through elements and change graphs
        Object.keys(options.graphs).forEach(e=>{
            if (options.graphs[e].column === newvalue) {
                options.graphs[e].column = oldvalue;
            }
        });
        this.state.dataProcessed.forEach(e=>{
            e.name = e[newvalue];
        });

        this.props.updateState({ ...this.props.state, options: options, dataProcessed: newData });
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
        let { dataProcessed, dataProvided, options } = this.props.state;
        return (
            <Grid>
                <Row>
                    <Col lg={(this.props.step === 1) ? 12 : 5} xs={12}>
                        {this.props.step === 1 ? <h4>{i18n.t("GraficaD3.header.origin")}</h4> : null}
                        {this.props.step === 1 &&
                        <DataProvider dataProvided={dataProvided} dataChanged={this.dataChanged} id={this.props.id} props={this.props.props}/>
                        }
                        {this.props.step === 2 &&
                        <ChartOptions dataProcessed={dataProcessed} options={options} dataProvided={dataProvided} dataChanged={this.dataChanged} keys={this.state.keys} changeAxis={this.changeAxis} xcolumn={this.state.xcolumn} optionsChanged={this.optionsChanged}/>
                        }
                    </Col>
                    <div className="col-xs-12 col-lg-7" ref="chartContainer" style={{ padding: '0px' }}>
                        {this.props.step === 2 &&
                        <div style={{ height: '300px', width: '95%' }}>
                            <h4>{i18n.t("GraficaD3.preview")}</h4>
                            <Chart fromConfig id={this.props.id} dataProcessed={dataProcessed} options={options} keys={this.state.keys} values={this.state.values} width={this.state.chartWidth}
                            />
                        </div>
                        }
                    </div>
                </Row>
            </Grid>
        );
    }

}
/* eslint-enable react/prop-types */
