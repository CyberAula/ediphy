import React from "react";
import { Col, Grid, Row } from "react-bootstrap";
import i18n from 'i18next';
import TableComponent from './table-component';
import DataProvider from './data-provider';
import ChartOptions from './chart-options';
import { PreviewOverlay, TablePreviewContainer } from "../Styles";
/* eslint-disable react/prop-types */

export default class Config extends React.Component {
    render() {
        let { data, options, keys } = this.props.state;
        return (
            <Grid>
                <Row>
                    <Col lg={12} xs={12}>
                        {this.props.step === 1 ? <h4> {i18n.t("DataTable.header.origin")} </h4> : null}
                        {this.props.step === 1 &&
                        <DataProvider id={this.props.id} data={data} dataChanged={this.dataChanged} keys={keys} props={this.props.props}/>
                        }
                        {this.props.step === 2 &&
                        <ChartOptions options={options} optionsChanged={this.optionsChanged} keys={keys} />
                        }
                    </Col>
                    <Col lg={12} xs={12} ><br/>
                        {this.props.step === 2 && <div>
                            <h4>{i18n.t("DataTable.header.preview")}</h4><br/>
                            <TablePreviewContainer ref="chartContainer" id="chartContainer">
                                <TableComponent data={data} keys={keys} options={options} key={Math.random()}/>
                            </TablePreviewContainer>
                        </div>}
                        {this.props.step === 2 && <PreviewOverlay/>}
                    </Col>
                </Row>
            </Grid>
        );
    }

    dataChanged = (values) => {
        let { data, keys, options } = this.setOptions(values.data, values.keys);
        this.props.updateState({ ...this.props.state, data, keys, options, editing: false });
    };

    setOptions = (data, keys) => {
        let options = this.props.state.options;
        return { data, keys, options };
    };

    optionsChanged = (newOptions) => {
        let options = { ...this.props.state.options, ...newOptions, key: Math.random() };
        this.props.updateState({ ...this.props.state, options });
    };
}

/* eslint-enable react/prop-types */
