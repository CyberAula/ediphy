import React from "react";
import { Form, Button, FormGroup, FormControl, ControlLabel, Col } from "react-bootstrap";
import FileInput from '../../../_editor/components/common/file-input/FileInput';
import Alert from '../../../_editor/components/common/alert/Alert';
import i18n from 'i18next';
/* eslint-disable react/prop-types */

export default class DataProvider extends React.Component {

    constructor(props) {
        super(props);
        let rows = this.props.data.length;
        let cols = this.props.data.length === 0 ? 2 : Object.keys(this.props.data[0]).length;
        this.confirmButton = this.confirmButton.bind(this);
        this.colLeft = this.colLeft.bind(this);
        this.colLeft = this.colLeft.bind(this);
        this.colRight = this.colRight.bind(this);
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
            data: this.props.data,
            keys: this.props.keys,
            error: false,
        };
    }
    /**
     * TODO Revisar
     * */
    confirmButton() {
        let empty = false;
        outerloop:
        for (let i = 0; i < this.state.data.length; i++) {
            for (let o = 0; o < this.state.keys.length; o++) {
                let k = this.state.keys[o];
                if(this.state.data[i][k] === "") {
                    let alertComp = (<Alert className="pageModal" show hasHeader closeButton onClose={()=>{this.setState({ alert: null });}}>
                        <span> {i18n.t("DataTable.alert_msg")} </span>
                    </Alert>);
                    this.setState({ alert: alertComp });
                    empty = true;
                    break outerloop;
                }
            }
        }

        if (typeof this.props.dataChanged === 'function' && !empty) {
            this.props.dataChanged({ data: this.state.data, keys: this.state.keys });
        }
    }
    colLeft(col) {
        let pre = this.state.cols;
        let keys = this.state.keys;
        let left = keys[col - 1];
        let current = keys[col];
        keys[col - 1] = current;
        keys[col] = left;

        this.setState({ keys: keys });
    }
    colRight(col) {
        let pre = this.state.cols;
        let keys = this.state.keys;
        let right = keys[col + 1];
        let current = keys[col];
        keys[col + 1] = current;
        keys[col] = right;
        this.setState({ keys: keys });
    }
    deleteCols(col) {
        let pre = this.state.cols - 1;
        let keys = this.state.keys;
        let data = this.state.data;

        for (let i = 0; i < data.length; i++) {
            delete data[i][keys[col]];
        }
        keys.splice(col, 1);

        this.setState({ cols: pre, data: data, keys: keys });
    }
    colsChanged(event) {
        let pre = this.state.cols;
        let value = parseInt(event.target.value, 10);
        let keys = this.state.keys;
        let data = this.state.data;

        if (value > pre) {
            for (let o = pre; o < value; o++) {
                keys.push(o);
            }
            for (let i = 0; i < data.length; i++) {
                for (let o = pre; o < value; o++) {
                    data[i][o] = "";
                }
            }

        } else if (value < pre) {

            for (let i = 0; i < data.length; i++) {
                for (let o = value; o < pre; o++) {
                    delete data[i][keys[o]];
                }
            }
            keys = keys.slice(0, value);
        }
        this.setState({ cols: parseInt(value, 10), data: data, keys: keys });
    }
    deleteRows(row) {
        let pre = this.state.rows - 1;
        let data = this.state.data;
        data.splice(row, 1);

        this.setState({ rows: pre, data: data });
    }
    rowsChanged(event) {
        let pre = this.state.rows;
        let value = parseInt(event.target.value, 10);

        let keys = this.state.keys;
        let data = this.state.data;

        if (value > pre) {
            let row = {};
            for (let i = 0; i < keys.length; i++) {
                row[keys[i]] = "";
            }
            for (let i = pre; i < value; i++) {
                data.push(row);
            }
        } else if (value < pre) {
            data = data.slice(0, value);
        }
        this.setState({ rows: parseInt(value, 10), data: data });
    }
    keyChanged(event) {
        let keys = this.state.keys;
        let pre = keys[event.target.name];
        let data = this.state.data;
        keys[event.target.name] = event.target.value;
        for (let i = 0; i < data.length; i++) {
            let val = data[i][pre];
            data[i][event.target.value] = val;
            delete data[i][pre];
        }
        this.setState({ keys: keys, data: data });

    }
    csvToJSON(csv) {

        let lines = csv.split("\n");

        let result = [];

        let headers = lines[0].split(",");

        for(let i = 1; i < lines.length; i++) {

            let obj = {};
            let currentline = lines[i].split(",");

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = "" + currentline[j];
            }
            result.push(obj);
        }

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
                data = this.csvToJSON(data);
            } else if(file.name.split('.').pop() === "json") {
                data = JSON.parse(data);
            } else {
                let alertComp = (<Alert className="pageModal" show hasHeader closeButton onClose={()=>{this.setState({ alert: null });}}>
                    <span> {i18n.t("DataTable.file_msg")} </span>
                </Alert>);
                this.setState({ alert: alertComp });
                return;
            }
            this.setState({ name: file.name });
            this.validateJson(data);
        }.bind(this);
        reader.readAsBinaryString(file);
    }
    dataChanged(event) {
        let pos = event.target.name.split(" ");
        let row = pos[0];
        let col = pos[1];
        let data = this.state.data;
        let newvalue = event.target.value === "" || event.target.value === null ? "" : event.target.value;
        let newRow = {};
        newRow[col] = newvalue;
        data[row] = Object.assign({}, data[row], newRow);
        this.setState({ data: data });
    }

    render() {
        return (
            <div id="datatable_config_modal">
                { this.state.alert }
                <Form horizontal style={{ padding: "16px" }}>
                    <FormGroup>
                        <FileInput onChange={this.fileChanged} className="fileInput" accept=".csv,.json">
                            {/* <Button className="btn btn-primary" style={{ marginTop: '0px' }}>{ Ediphy.i18n.t('FileDialog') }</Button>*/}
                            {/* <span style={{ marginLeft: '10px' }}>*/}
                            {/* <label className="control-label">{ Ediphy.i18n.t('FileDialog') + ':   ' } </label> { this.state.name || '' }</span>*/}
                            <div className="fileDrag">
                                <span style={{ display: this.props.name ? 'none' : 'block' }}><i className="material-icons">ic_file_upload</i><b>{ i18n.t('FileInput.Drag') }</b>{ i18n.t('FileInput.Drag_2') }<b>{ i18n.t('FileInput.Click') }</b>{ i18n.t('FileInput.Click_2') }</span>
                                <span className="fileUploaded" style={{ display: this.props.name ? 'block' : 'none' }}><i className="material-icons">insert_drive_file</i>{ this.props.name || '' }</span>
                            </div>
                        </FileInput>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} xs={4}>
                            <FormControl.Static>
                                {i18n.t("DataTable.fill_in")}
                            </FormControl.Static>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} xs={2}>
                            {i18n.t("DataTable.data_cols")}
                        </Col>
                        <Col xs={3}>
                            <FormControl type="number" name="cols" value={this.state.cols} onChange={this.colsChanged}/>
                        </Col>

                        <Col componentClass={ControlLabel} xs={1}>
                            {i18n.t("DataTable.data_rows")}
                        </Col>
                        <Col xs={3}>
                            <FormControl type="number" name="rows" value={this.state.rows} onChange={this.rowsChanged}/>
                        </Col>
                        <Col xs={3}>
                            <Button className="btn btn-primary" onClick={this.confirmButton} style={{ marginTop: '0px' }}>{i18n.t("DataTable.confirm")}</Button>
                        </Col>
                    </FormGroup>
                    <div style={{ marginTop: '10px', overflowX: 'auto' }}>
                        <div style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                            {Array.apply(0, Array(this.state.cols)).map((x, i) => {
                                return(
                                    <FormControl.Static key={i + 1} style={{ display: 'table-cell', padding: '8px', textAlign: 'center' }} />
                                );
                            })}
                        </div>
                        <table className="table bordered hover" >
                            <thead>
                                <tr>
                                    {Array.apply(0, Array(this.state.cols)).map((x, i) => {
                                        return(
                                            <th key={i + 1}>
                                                <i className="material-icons clearCol" onClick={(e)=>{this.deleteCols(i);}}>clear</i>
                                                <FormControl type="text" name={i} value={this.props.keys[i]} style={{ margin: '0px' }} onChange={this.keyChanged}/>
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

                                                        <FormControl type="text" style={{ width: 'calc(100% - 30px)' }} name={i + " " + this.props.keys[o]} value={this.props.data[i][this.props.keys[o]] } onChange={this.dataChanged}/>

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
