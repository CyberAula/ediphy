import React from "react";
import { Form, Button, FormGroup, FormControl, ControlLabel, Col } from "react-bootstrap";
import FileInput from '../../../_editor/components/common/file-input/FileInput';
import Alert from '../../../_editor/components/common/alert/Alert';
import i18n from 'i18next';

export default class DataProvider extends React.Component {

    constructor(props) {
        super(props);
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
            data: this.props.data,
            error: false,
        };
    }

    confirmButton() {
        let empty = false;
        outerloop:
        for (let i = 0; i < this.state.data.length; i++) {
            for (let o = 0; o < this.state.data.length; o++) {
                if(this.state.data[i][o] === "") {
                    let alertComp = (<Alert className="pageModal" show hasHeader closeButton onClose={()=>{this.setState({ alert: null });}}>
                        <span> {i18n.t("GraficaD3.alert_msg")} </span>
                    </Alert>);
                    this.setState({ alert: alertComp });
                    empty = true;
                    break outerloop;
                }
            }
        }
        if (typeof this.props.dataChanged === 'function' && !empty) {
            this.props.dataChanged({ data: this.state.data});
        }
    }

    deleteCols(col) {
        if (col > -1){
            let newData = this.state.data.slice(0);
            newData.splice(col, 1);
            this.setState({data: newData});
        }
    }


    colsChanged(event) {
        let colNumber = parseInt(event.target.value);
        let newData = this.state.data.slice(0);
        let rowLength = newData[0].length;

        if(colNumber !== newData.length && colNumber > 0){
            if(colNumber > newData.length){
                //Initializes columns
                let iterationSize = colNumber - newData.length;
                for(let n =0; n < iterationSize; n++){
                    let column = new Array(rowLength).fill('');
                    newData.push(column);
                }
            } else if (colNumber < newData.length){

                newData = newData.slice(0,colNumber);
            }
            this.setState({ data: newData });
        }

    }

    deleteRows(row) {
        let newData = this.state.data.slice(0);
        for(let n in newData){
            newData[n].splice(row + 1, 1);
        }

        this.setState({ data: newData });
    }

    rowsChanged(event) {
        let rowNumber = parseInt(event.target.value);
        let newData = this.state.data.slice(0);
        if(rowNumber !== newData[0].length && rowNumber > 0){
            if(rowNumber > newData[0].length){
                let rowAmount = rowNumber - newData[0].length;
                let nextArray = new Array(rowAmount).fill('');
                for (let n = 0; n < newData.length; n++){
                    newData[n] = newData[n].concat(nextArray.slice(0));
                }
            } else if (rowNumber < newData[0].length){
                for (let n = 0; n < newData.length; n++){
                    newData[n] = newData[n].slice(0,rowNumber);
                }
            }
            this.setState({ data: newData });
        }
    }

    keyChanged(event) {
        let pos = parseInt(event.target.name);
        let newData = this.state.data.slice(0);

        newData[pos][0] = event.target.value;
        this.setState({data: newData });

    }

    csvToJSON(csv) {
        let lines = csv.split("\n");
        let result = [];
        let headers = lines[0].split(",");

        for(let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(",");
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
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
        reader.onload = () => {
            let data = reader.result;
            if(file.name.split('.').pop() === "csv") {
                data = this.csvToJSON(data);
            } else if(file.name.split('.').pop() === "json") {
                data = JSON.parse(data);
            }
            this.setState({ name: file.name });
            this.validateJson(data);
        };
        reader.readAsText(file);
    }

    dataChanged(event) {
        let pos = event.target.name.split(" ");
        let row = parseInt(pos[1])+1;
        let col = parseInt(pos[0]);
        let newData = this.state.data.slice(0);

        if( typeof event.target.value !== "undefined" /*&& !isNaN(parseInt(event.target.value))*/){
            newData[col][row] = event.target.value;
            this.setState({ data: newData });
        }
    }

    render() {
        return (
            /* jshint ignore:start */
            <div>
                { this.state.alert }
                <Form horizontal style={{ padding: "16px" }}>
                    {/* <FormGroup>
                        <FileInput onChange={this.fileChanged} className="fileInput">
                            <div className="fileDrag">
                                <span style={{ display: this.state.name ? 'none' : 'block' }}><i className="material-icons">ic_file_upload</i><b>{ i18n.t('FileInput.Drag') }</b>{ i18n.t('FileInput.Drag_2') }<b>{ i18n.t('FileInput.Click') }</b>{ i18n.t('FileInput.Click_2') }</span>
                                <span className="fileUploaded" style={{ display: this.state.name ? 'block' : 'none' }}><i className="material-icons">insert_drive_file</i>{ this.state.name || '' }</span>
                            </div>
                        </FileInput>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} xs={4}>
                            <FormControl.Static>
                                {i18n.t("GraficaD3.fill_in")}
                            </FormControl.Static>
                        </Col>
                    </FormGroup>*/}
                    <FormGroup>
                        <Col componentClass={ControlLabel} xs={2}>
                            {i18n.t("GraficaD3.data_cols")}
                        </Col>
                        <Col xs={3}>
                            <FormControl type="number" name="cols" value={this.state.data.length} onChange={this.colsChanged}/>
                        </Col>

                        <Col componentClass={ControlLabel} xs={1}>
                            {i18n.t("GraficaD3.data_rows")}
                        </Col>
                        <Col xs={3}>
                            <FormControl type="number" name="rows" value={this.state.data[0].length} onChange={this.rowsChanged}/>
                        </Col>
                        <Col xs={3}>
                            <Button className="btn btn-primary" onClick={this.confirmButton} style={{ marginTop: '0px' }}>{i18n.t("GraficaD3.confirm")}</Button>
                        </Col>
                    </FormGroup>
                    <div style={{ marginTop: '10px', overflowX: 'auto' }}>
                        <div style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                            {this.state.data.map((x, i) => {
                                return(
                                    <FormControl.Static key={i + 1} style={{ display: 'table-cell', padding: '8px', textAlign: 'center' }} />
                                );
                            })}
                        </div>
                        <table className="table bordered hover" >
                            <thead>
                                <tr>
                                    {this.state.data.map((x, i) => {
                                        return(
                                            <th key={i + 1}>
                                                <i className="material-icons clearCol" onClick={(e)=>{this.deleteCols(i);}}>clear</i>
                                                <FormControl type="text" name={i} value={this.state.data[i][0]} style={{ margin: '0px' }} onChange={this.keyChanged}/>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody style={{ backgroundColor: '#f2f2f2' }}>
                                {this.state.data[0].map((x, i) => {
                                    if(i === this.state.data[0].length - 1){
                                        return;
                                    }

                                    return(
                                        <tr key={i + 1}>
                                            {this.state.data.map((q, o) => {
                                                return(
                                                    <td key={o + 1}>
                                                        <i className="material-icons clearRow" onClick={()=>{this.deleteRows(i);}}>clear</i>
                                                        <FormControl type="text" name={o + " " + i} value={this.state.data[o][i+1]} onChange={this.dataChanged}/>

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
            /* jshint ignore:end */
        );
    }
}
