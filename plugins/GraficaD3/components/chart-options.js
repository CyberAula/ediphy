import React from "react";
import { Form, FormGroup, FormControl, ControlLabel, Col, Checkbox, Radio } from "react-bootstrap";

import i18n from 'i18next';
/* eslint-disable react/prop-types */

export default class ChartOptions extends React.Component {
    constructor(props) {
        super(props);

        this.typeChanged = this.typeChanged.bind(this);
        this.colorChanged = this.colorChanged.bind(this);
        this.xGridChanged = this.xGridChanged.bind(this);
        this.yKeyChanged = this.yKeyChanged.bind(this);
        this.yGridChanged = this.yGridChanged.bind(this);
        this.colorChanged = this.colorChanged.bind(this);
        this.graphsChanged = this.graphsChanged.bind(this);
        this.rowChanged = this.rowChanged.bind(this);
        this.rowNameChanged = this.rowNameChanged.bind(this);

        this.state = {
            dataProcessed: this.props.dataProcessed,
            values: this.props.dataProvided.slice(1, this.props.dataProvided.length),
        };

    }

    typeChanged(event) {
        this.props.optionsChanged({ type: event.target.value });
    }

    colorChanged(event) {
        let graph = this.props.options.graphs.slice();
        graph[event.target.name].color = event.target.value;
        this.props.optionsChanged({ graphs: graph });
    }

    randomColor() {
        return `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, 0)}`;
    }

    graphsChanged(event) {
        let graphs = this.props.options.graphs.slice();
        let number = event.target.value;
        let rows = this.props.values.length;
        if(number > graphs.length) {
            if(number <= rows) {
                for (let i = graphs.length; i < number; i++) {
                    graphs[i] = {
                        row: i,
                        name: "Fila " + i,
                        color: this.randomColor(),
                    };
                }
            }
        } else if (number >= 1) {
            graphs = graphs.slice(0, number);
        }
        this.props.optionsChanged({ graphs: graphs });
    }

    /* xKeyChanged(event) {
        this.props.optionsChanged({ x: event.target.value });
    }*/

    yGridChanged(event) {
        this.props.optionsChanged({ gridY: event.target.checked });
    }

    xGridChanged(event) {
        this.props.optionsChanged({ gridX: event.target.checked });
    }

    yKeyChanged(event) {
        let y = this.state.y;
        y[event.target.name].key = event.target.value;
        this.props.optionsChanged({ y: y });
    }

    rowChanged(event) {
        let number = event.target.name;
        let graphs = this.props.options.graphs.slice();
        graphs[number].row = event.target.value;
        this.props.optionsChanged({ graphs: graphs });
    }

    rowNameChanged(event) {
        let number = event.target.name;
        let graphs = this.props.options.graphs.slice();
        graphs[number].name = event.target.value;
        this.props.optionsChanged({ graphs: graphs });
    }

    render() {
        return (
            <div>
                <h4>{i18n.t("GraficaD3.header.options")}</h4>
                <div className="content-block">
                    <Form horizontal>
                        <FormGroup>
                            <Col xs={5}>
                                <FormControl.Static>
                                    {i18n.t("GraficaD3.chart_type")}
                                </FormControl.Static>
                            </Col>
                            <Col xs={7}>
                                <FormControl componentClass="select" placeholder="line" value={this.props.options.type} onChange={this.typeChanged}>
                                    <option value="line">{i18n.t("GraficaD3.types.line")}</option>
                                    <option value="area">{i18n.t("GraficaD3.types.area")}</option>
                                    <option value="bar">{i18n.t("GraficaD3.types.bar")}</option>
                                    {/* <option value="pie">{i18n.t("GraficaD3.types.pie")}</option>*/}
                                </FormControl>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col xs={12}>
                                <FormControl.Static>
                                    {i18n.t("GraficaD3.see_grid")}
                                </FormControl.Static>
                            </Col>
                            <Col xs={6}>
                                <Checkbox checked={this.props.options.gridX} onChange={this.xGridChanged} />
                                {i18n.t("GraficaD3.horizontal")}
                            </Col>
                            <Col xs={6}>
                                <Checkbox checked={this.props.options.gridY} onChange={this.yGridChanged} />
                                {i18n.t("GraficaD3.vertical")}
                            </Col>
                        </FormGroup>
                    </Form>
                    {this.state.type !== 'pie' &&
                    <Form horizontal>
                        <FormGroup>
                            <Col xs={5}>
                                <FormControl.Static>
                                    Numero de Gráficas
                                </FormControl.Static>
                            </Col>
                            <Col xs={7}>
                                <FormControl type="number" value={this.props.options.graphs.length} onChange={this.graphsChanged}/>
                            </Col>
                        </FormGroup>

                        {this.props.options.graphs.map((y, i) => {
                            return(
                                <div key={i + 1}>
                                    <hr />
                                    <FormGroup>
                                        <Col xs={12}>
                                            <h5>
                                                {i18n.t("GraficaD3.point") + ' ' + i}
                                            </h5>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup>
                                        <Col xs={5}>
                                            <FormControl.Static>
                                                {i18n.t("GraficaD3.Fila") + ' ' + i}
                                            </FormControl.Static>
                                        </Col>
                                        <Col xs={7}>
                                            <FormControl componentClass="select" placeholder={"Fila 0"} name={i} value={this.props.options.graphs[i].row} onChange={this.rowChanged}>
                                                {this.state.values.map((x, w) => {
                                                    return(
                                                        <option key={w + 1} value={w}>{"Fila " + w}</option>
                                                    );
                                                })}
                                            </FormControl>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup>
                                        <Col xs={5}>
                                            <FormControl.Static>
                                                {"Nombre de Fila"}
                                            </FormControl.Static>
                                        </Col>
                                        <Col xs={7}>
                                            <FormControl type="text" name={i} value={this.props.options.graphs[i].name} onChange={this.rowNameChanged}/>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup>
                                        <Col xs={5}>
                                            <FormControl.Static>
                                                {"Color"}
                                            </FormControl.Static>
                                        </Col>
                                        <Col xs={7}>
                                            <FormControl type="color" name={i} value={this.props.options.graphs[i].color} onChange={this.colorChanged}/>
                                        </Col>
                                    </FormGroup>
                                </div>
                            );
                        })}

                    </Form>
                    }
                </div>
            </div>
        );
    }
}
/* eslint-enable react/prop-types */
