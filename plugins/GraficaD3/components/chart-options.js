import React from "react";
import { Form, FormGroup, FormControl, ControlLabel, Col, Checkbox, Radio } from "react-bootstrap";

import i18n from 'i18next';

export default class ChartOptions extends React.Component {
    constructor(props) {
        super(props);
        let options = this.props.options;
        options.keys = this.props.keys;
        options.valueKeys = this.props.valueKeys;
        this.state = options;
        this.typeChanged = this.typeChanged.bind(this);
        this.colorChanged = this.colorChanged.bind(this);
        this.yAxisChanged = this.yAxisChanged.bind(this);
        this.xKeyChanged = this.xKeyChanged.bind(this);
        this.xGridChanged = this.xGridChanged.bind(this);
        this.yKeyChanged = this.yKeyChanged.bind(this);
        this.yGridChanged = this.yGridChanged.bind(this);
        this.ringsNumberChanged = this.ringsNumberChanged.bind(this);
        this.ringNameChanged = this.ringNameChanged.bind(this);
        this.ringValueChanged = this.ringValueChanged.bind(this);
        this.ringColorChanged = this.ringColorChanged.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {

        if(prevState !== this.state) {
            if (typeof this.props.optionsChanged === 'function') {
                // console.log(this.state);
                this.props.optionsChanged({
                    type: this.state.type,
                    x: this.state.x,
                    y: this.state.y,
                    gridX: this.state.gridX,
                    gridY: this.state.gridY,
                    rings: this.state.rings,
                });
            }
        }
    }

    typeChanged(event) {
        this.setState({ type: event.target.value });
    }

    colorChanged(event) {
        let y = this.state.y;
        y[event.target.name].color = event.target.value;
        this.setState({ y: y });
    }

    yAxisChanged(event) {
        let yAxis = this.state.y;
        let number = event.target.value;
        if(number > yAxis.length) {
            for (let i = yAxis.length; i < number; i++) {
                yAxis[i] = {
                    key: "",
                    color: "#1FC8DB",
                };
            }
        } else {
            yAxis = yAxis.slice(0, number);
        }
        this.setState({ y: yAxis });
    }

    xKeyChanged(event) {
        this.setState({ x: event.target.value });
    }

    xGridChanged(event) {
        this.setState({ gridX: event.target.checked });
    }

    yKeyChanged(event) {
        let y = this.state.y;
        y[event.target.name].key = event.target.value;
        this.setState({ y: y });
    }

    yGridChanged(event) {
        this.setState({ gridY: event.target.checked });
    }

    ringsNumberChanged(event) {
        let rings = this.state.rings;
        let number = event.target.value;
        if(number > rings.length) {
            for (let i = rings.length; i < number; i++) {
                rings[i] = {
                    name: this.state.keys[0],
                    value: this.state.valueKeys[0],
                    color: "#1FC8DB",
                };
            }
        } else {
            rings = rings.slice(0, number);
        }
        this.setState({ rings: rings });
    }

    ringNameChanged(event) {
        let rings = this.state.rings;
        rings[event.target.name].name = event.target.value;
        this.setState({ rings: rings });
    }

    ringValueChanged(event) {
        let rings = this.state.rings;
        rings[event.target.name].value = event.target.value;
        this.setState({ rings: rings });
    }

    ringColorChanged(event) {
        let rings = this.state.rings;
        rings[event.target.name].color = event.target.value;
        this.setState({ rings: rings });
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
                                <FormControl componentClass="select" placeholder="line" value={this.state.type} onChange={this.typeChanged}>
                                    <option value="line">{i18n.t("GraficaD3.types.line")}</option>
                                    <option value="area">{i18n.t("GraficaD3.types.area")}</option>
                                    <option value="bar">{i18n.t("GraficaD3.types.bar")}</option>
                                    <option value="pie">{i18n.t("GraficaD3.types.pie")}</option>
                                </FormControl>
                            </Col>
                        </FormGroup>{/**/}
                        <FormGroup>
                            <Col xs={12}>
                                <FormControl.Static>
                                    {i18n.t("GraficaD3.see_grid")}
                                </FormControl.Static>
                            </Col>
                            <Col xs={6}>
                                <Checkbox checked={this.state.gridX} onChange={this.xGridChanged} />
                                {i18n.t("GraficaD3.horizontal")}
                            </Col>
                            <Col xs={6}>
                                <Checkbox checked={this.state.gridY} onChange={this.yGridChanged} />
                                {i18n.t("GraficaD3.vertical")}
                            </Col>
                        </FormGroup>
                    </Form>
                    {this.state.type !== 'pie' &&
                    <Form horizontal>
                        <FormGroup>
                            <Col xs={5}>
                                <FormControl.Static>
                                    {i18n.t("GraficaD3.axes_h")}
                                </FormControl.Static>
                            </Col>
                            <Col xs={7}>
                                <FormControl componentClass="select" placeholder={this.state.keys[0]} value={this.state.x} onChange={this.xKeyChanged}>
                                    {this.state.keys.map((x, i) => {
                                        return(
                                            <option key={i + 1} value={x}>{x}</option>
                                        );
                                    })}
                                </FormControl>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col xs={5}>
                                <FormControl.Static>
                                    {i18n.t("GraficaD3.axes_v")}
                                </FormControl.Static>
                            </Col>
                            <Col xs={7}>
                                <FormControl type="number" value={this.state.y.length} onChange={this.yAxisChanged}/>
                            </Col>
                        </FormGroup>

                        {this.state.y.map((y, i) => {
                            return(

                                <div key={i + 1}>
                                    <hr />
                                    <FormGroup>
                                        <Col xs={12}>
                                            <h5>
                                                {i18n.t("GraficaD3.axis") + ' ' + i}
                                            </h5>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup>
                                        <Col xs={5}>
                                            <FormControl.Static>
                                                {i18n.t("GraficaD3.key") + ' ' }
                                            </FormControl.Static>
                                        </Col>
                                        <Col xs={7}>
                                            <FormControl componentClass="select" placeholder={this.state.valueKeys[0]} name={i} value={y.key} onChange={this.yKeyChanged}>
                                                {this.state.valueKeys.map((x, w) => {
                                                    return(
                                                        <option key={w + 1} value={x}>{x}</option>
                                                    );
                                                })}
                                            </FormControl>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup>
                                        <Col xs={5}>
                                            <FormControl.Static>
                                                {"Color"}
                                            </FormControl.Static>
                                        </Col>
                                        <Col xs={7}>
                                            <FormControl type="color" name={i} value={y.color} onChange={this.colorChanged}/>
                                        </Col>
                                    </FormGroup>
                                </div>
                            );
                        })}

                    </Form>
                    }
                    {this.state.type === 'pie' &&
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} xs={4}>
                                <FormControl.Static>
                                    {i18n.t("GraficaD3.rings")}
                                </FormControl.Static>
                            </Col>
                            <Col xs={6}>
                                <FormControl type="number" value={this.state.rings.length} onChange={this.ringsNumberChanged}/>
                            </Col>

                        </FormGroup>

                        {this.state.rings.map((ring, i) => {
                            return(
                                <div key={i + 1}>
                                    <FormGroup>
                                        <Col componentClass={ControlLabel} xs={6}>
                                            <FormControl.Static>
                                                {i18n.t("GraficaD3.ring") + ' ' + (i + 1)}
                                            </FormControl.Static>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup>
                                        <Col componentClass={ControlLabel} xs={6} xsOffset={3}>
                                            {i18n.t("GraficaD3.name")}
                                        </Col>
                                        <Col xs={6}>
                                            <FormControl componentClass="select" placeholder="select" name={i} value={ring.name} onChange={this.ringNameChanged}>
                                                {this.state.keys.map((key, n) => {
                                                    return(
                                                        <option key={n + 1} value={key}>{key}</option>
                                                    );
                                                })}
                                            </FormControl>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup>
                                        <Col componentClass={ControlLabel} xs={6} xsOffset={3}>
                                            {i18n.t("GraficaD3.value")}
                                        </Col>
                                        <Col xs={6}>
                                            <FormControl componentClass="select" placeholder={this.state.valueKeys[0]} name={i} value={ring.value} onChange={this.ringValueChanged}>
                                                {this.state.valueKeys.map((key, r) => {
                                                    return(
                                                        <option key={r + 1} value={key}>{key}</option>
                                                    );
                                                })}
                                            </FormControl>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup>
                                        <Col componentClass={ControlLabel} xs={6} xsOffset={3}>
                                            {i18n.t("GraficaD3.color")}
                                        </Col>
                                        <Col xs={6}>
                                            <FormControl type="color" name={i} value={ring.color} onChange={this.ringColorChanged}/>
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
