import React from "react";
import { Form, Button, FormGroup, FormControl, ControlLabel, Col } from "react-bootstrap";
import FileInput from '../../../_editor/components/common/file-input/FileInput';
import Alert from '../../../_editor/components/common/alert/Alert';
import i18n from 'i18next';
/* eslint-disable react/prop-types */

export default class DataProvider extends React.Component {
    constructor(props) {
        super(props);

        let data = this.props.dataProvided.slice();
        let keys = data.splice(0, 1)[0];
        let rows = data.length;
        let cols = data[0].length;
        this.confirmButton = this.confirmButton.bind(this);
        this.deleteCols = this.deleteCols.bind(this);
        this.colsChanged = this.colsChanged.bind(this);
        this.deleteRows = this.deleteRows.bind(this);
        this.rowsChanged = this.rowsChanged.bind(this);
        this.keyChanged = this.keyChanged.bind(this);
        this.validateJson = this.validateJson.bind(this);
        this.fileChanged = this.fileChanged.bind(this);
        this.dataChanged = this.dataChanged.bind(this);

        this.state = {
            cols: cols,
            rows: rows,
            data: data,
            keys: keys,
            error: false,
        };
    }

    confirmButton() {
        let empty = false;
        if (typeof this.props.dataChanged === 'function' && !empty) {
            this.props.dataChanged({ data: this.state.data, keys: this.state.keys });
        }
    }

    deleteCols(col) {
        let cols = this.state.cols - 1;
        let keys = this.state.keys.slice();
        keys.splice(col, 1);
        let data = this.state.data.map(ele=>{
            let ele2 = ele.slice();
            ele2.splice(col, 1);
            return ele2;
        });

        this.setState({ cols: cols, keys: keys, data: data });
    }

    dataChanged(event) {
        let pos = event.target.name.split(" ");
        let row = pos[0];
        let col = pos[1];
        let data = this.state.data.slice();
        let newvalue = event.target.value === "" || event.target.value === null ? "" : event.target.value;
        data[row][col] = newvalue;
        this.setState({ data: data });
    }

    colsChanged(event) {
        let pre = this.state.cols;
        let value = parseInt(event.target.value, 10);
        let keys = this.state.keys.slice();
        let data = this.state.data.slice();
        if(value > 1) {
            if (value > pre) {
                let difference = value - pre;
                keys = keys.concat(Array(difference).fill(""));
                data = data.map(ele=>{
                    return ele.concat(Array(difference).fill(""));
                });
            } else if (value < pre) {
                let difference = pre - value;
                keys.splice(value, pre - value);
                data = data.map(ele=>{
                    let ele2 = ele.slice();
                    ele2.splice(value, pre - value);
                    return ele2;
                });
            }

            this.setState({ keys: keys, data: data, cols: value });
        }
    }

    deleteRows(row) {
        let rows = this.state.rows - 1;
        let data = this.state.data.slice();
        data.splice(row, 1);
        this.setState({ rows: rows, data: data });
    }

    rowsChanged(event) {
        let pre = this.state.rows;
        let value = parseInt(event.target.value, 10);
        let cols = this.state.cols;
        let keys = this.state.keys.slice();
        let data = this.state.data.slice();

        if(value > 1) {
            if (value > pre) {
                let difference = value - pre;
                data = data.concat(Array.from({ length: difference }, e => Array(cols).fill("")));
            } else if (value < pre) {
                data.splice(value, pre - value);
            }
            this.setState({ keys: keys, data: data, rows: value });
        }
    }

    keyChanged(event) {
        let pos = event.target.name;
        let keys = this.state.keys.slice();
        let newvalue = event.target.value === "" || event.target.value === null ? "" : event.target.value;
        keys[pos] = newvalue;
        this.setState({ keys: keys });
    }

    csvToState(csv) {
        let lines = csv.split("\n");

        let result = [];

        let headers = lines[0].split(",");
        // console.log(lines, headers);
        for(let i = 1; i < lines.length; i++) {
            let obj = Array(headers.length);
            let currentline = lines[i].split(",");
            for (let j = 0; j < headers.length; j++) {
                obj[j] = "" + currentline[j];
            }
            result.push(obj);
        }
        console.log(result);
        return result;
    }

    validateJson(json) {
        let data = {};
        if(json.length === 0) {
            this.setState({ error: true });
            return false;
        }
        let cols = Object.keys(json[0]);
        if(cols.length === 0) {
            this.setState({ error: true, file: false });
            return false;
        }
        for(let row of json) {

            if(!this.compareKeys(cols, Object.keys(row))) {
                this.setState({ error: true, file: false });
                return false;
            }
            cols = Object.keys(row);
        }
        this.setState({ cols: cols.length, rows: json.length, data: json, keys: cols, x: cols[0] });

        this.setState({ error: false });
        return true;
    }

    compareKeys(a, b) {
        a = a.sort().toString();
        b = b.sort().toString();
        return a === b;
    }

    fileChanged(event) {
        let files = event.target.files;
        let file = files[0];

        let reader = new FileReader();
        reader.onload = function() {
            let data = reader.result;
            if(file.name.split('.').pop() === "csv") {
                data = this.csvToState(data);
                console.log(data);
                /* } else if(file.name.split('.').pop() === "json") {
                    data = JSON.parse(data);*/
            } else {
                let alertComp = (<Alert className="pageModal" show hasHeader closeButton onClose={()=>{this.setState({ alert: null });}}>
                    <span> {i18n.t("DataTable.file_msg")} </span>
                </Alert>);
                this.setState({ alert: alertComp });
                return;
            }
            this.setState({ name: file.name, data: data, rows: data.length, cols: data[0].length });
            // this.validateJson(data);
        }.bind(this);

        reader.readAsBinaryString(file);
    }
    render() {
        return (
            <div>
                { this.state.alert }
                <Form horizontal style={{ padding: "16px" }}>
                    <FormGroup>
                        <FileInput onChange={this.fileChanged} className="fileInput" accept=".csv,.json">
                            <div className="fileDrag">
                                <span style={{ display: this.state.name ? 'none' : 'block' }}><i className="material-icons">ic_file_upload</i><b>{ i18n.t('FileInput.Drag') }</b>{ i18n.t('FileInput.Drag_2') }<b>{ i18n.t('FileInput.Click') }</b>{ i18n.t('FileInput.Click_2') }</span>
                                <span className="fileUploaded" style={{ display: this.props.name ? 'block' : 'none' }}><i className="material-icons">insert_drive_file</i>{ this.props.name || '' }</span>
                            </div>
                        </FileInput>
                    </FormGroup>
                    {/*
                    <FormGroup>
                        <Col componentClass={ControlLabel} xs={4}>
                            <FormControl.Static>
                                {i18n.t("GraficaD3.fill_in")}
                            </FormControl.Static>
                        </Col>
                    </FormGroup>
                    */}
                    <FormGroup>
                        <Col componentClass={ControlLabel} xs={2}>
                            {i18n.t("GraficaD3.data_cols")}
                        </Col>
                        <Col xs={3}>
                            <FormControl type="number" name="cols" value={this.state.cols} onChange={this.colsChanged}/>
                        </Col>

                        <Col componentClass={ControlLabel} xs={1}>
                            {i18n.t("GraficaD3.data_rows")}
                        </Col>
                        <Col xs={3}>
                            <FormControl type="number" name="rows" value={this.state.rows} onChange={this.rowsChanged}/>
                        </Col>
                        <Col xs={3}>
                            <Button className="btn btn-primary" onClick={this.confirmButton} style={{ marginTop: '0px' }}>{i18n.t("GraficaD3.confirm")}</Button>
                        </Col>
                    </FormGroup>
                    <div style={{ marginTop: '10px', overflowX: 'auto' }}>
                        {/*
                        <div style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                            {Array.apply(0, Array(this.state.cols)).map((x) => {

                                return(
                                    <FormControl.Static key={x} style={{ display: 'table-cell', padding: '8px', textAlign: 'center' }} />
                                );
                            })}
                        </div>
                        */}
                        <table className="table bordered hover" >
                            <thead>
                                <tr>
                                    {Array.apply(0, Array(this.state.cols)).map((x, i) => {
                                        return(
                                            <th key={i + 1}>
                                                <i className="material-icons clearCol" onClick={(e)=>{this.deleteCols(i);}}>clear</i>
                                                <FormControl type="text" name={i} value={this.state.keys[i]} style={{ margin: '0px' }} onChange={this.keyChanged}/>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody style={{ backgroundColor: '#f2f2f2' }}>
                                {Array.apply(0, Array(this.state.rows)).map((x, i) => {
                                    return(
                                        <tr key={i + 1}>

                                            {Array.apply(0, Array(this.state.cols)).map((q, o) => {
                                                return(
                                                    <td key={o + 1}>
                                                        {o === 0 ? (<i className="material-icons clearRow" style={{ float: 'left' }} onClick={()=>{this.deleteRows(i);}}>clear</i>) : null}
                                                        <FormControl type="text" style={{ width: 'calc(100% - 30px)' }} name={i + " " + o} value={this.state.data[i][o] } onChange={this.dataChanged}/>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Form>
            </div>
        );
    }
}
/* eslint-enable react/prop-types */
