import React from "react";
import { Form, Button, FormGroup, FormControl, ControlLabel, Col } from "react-bootstrap";
import FileInput from '../../../_editor/components/common/file-input/FileInput';
import Alert from '../../../_editor/components/common/alert/Alert';
import i18n from 'i18next';
/* eslint-disable react/prop-types */

export default class DataProvider extends React.Component {

    constructor(props) {
        super(props);
        this.confirmButton = this.confirmButton.bind(this);

        this.deleteCols = this.deleteCols.bind(this);
        this.colsChanged = this.colsChanged.bind(this);
        this.deleteRows = this.deleteRows.bind(this);
        this.rowsChanged = this.rowsChanged.bind(this);
        this.keyChanged = this.keyChanged.bind(this);
        this.fileChanged = this.fileChanged.bind(this);
        this.dataChanged = this.dataChanged.bind(this);

        this.state = {
            dataProvided: this.props.dataProvided,
            error: false,
        };
    }

    confirmButton() {
        let empty = false;
        outerloop:
        for (let i = 0; i < this.props.dataProvided.length; i++) {
            for (let o = 0; o < this.props.dataProvided.length; o++) {
                if(this.props.dataProvided[i][o] === "") {
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
            this.props.dataChanged({ dataProvided: this.props.dataProvided });
        }
    }

    deleteCols(col) {
        if (col > -1) {
            let newData = this.props.dataProvided.slice(0);
            newData.splice(col, 1);
            this.setState({ dataProvided: newData });
        }
    }

    colsChanged(event) {
        let colNumber = parseInt(event.target.value, 10);
        let newData = this.props.dataProvided.slice(0);
        let rowLength = newData[0].length;

        if (colNumber !== newData.length && colNumber > 0) {
            if(colNumber > newData.length) {
                // Initializes columns
                let iterationSize = colNumber - newData.length;
                for (let n = 0; n < iterationSize; n++) {
                    let column = new Array(rowLength).fill('');
                    newData.push(column);
                }
            } else if (colNumber < newData.length) {

                newData = newData.slice(0, colNumber);
            }
            this.setState({ dataProvided: newData });
        }

    }

    deleteRows(row) {
        let newData = this.props.dataProvided.slice(0);
        for(let n in newData) {
            newData[n].splice(row + 1, 1);
        }

        this.setState({ dataProvided: newData });
    }

    rowsChanged(event) {
        let rowNumber = parseInt(event.target.value, 10);
        let newData = this.props.dataProvided.slice(0);
        if (rowNumber !== newData[0].length && rowNumber > 0) {
            if (rowNumber > newData[0].length) {
                let rowAmount = rowNumber - newData[0].length;
                let nextArray = new Array(rowAmount).fill('');
                for (let n = 0; n < newData.length; n++) {
                    newData[n] = newData[n].concat(nextArray.slice(0));
                }
            } else if (rowNumber < newData[0].length) {
                for (let n = 0; n < newData.length; n++) {
                    newData[n] = newData[n].slice(0, rowNumber);
                }
            }
            this.setState({ dataProvided: newData });
        }
    }

    keyChanged(event) {
        let pos = parseInt(event.target.name, 10);
        let newData = this.props.dataProvided.slice(0);

        newData[pos][0] = event.target.value;
        this.setState({ dataProvided: newData });

    }

    parseCSVtoDataProvider(csv) {
        let lines = csv.split("\n");

        let horizontalArray = [];
        lines.forEach((x)=>{
            let row = x.split(',');
            horizontalArray.push(row);
        });

        /* Reverts Array*/
        let verticalArray = new Array(horizontalArray[0].length);
        for (let n = 0; n < horizontalArray[0].length; n++) {
            verticalArray[n] = [];
            for (let y = 0; y < horizontalArray.length; y++) {
                verticalArray[n].push(horizontalArray[y][n]);
            }
        }

        return verticalArray;
    }

    parseJSONtoDataProvider(json) {
        let parsedJSON = JSON.parse(json);
        let keys = Object.keys(parsedJSON[0]);
        let nextArray = new Array(keys.length);

        for (let n = 0; n < nextArray.length; n++) {
            nextArray[n] = [keys[n]];
        }
        for (let n = 0; n < nextArray.length; n++) {
            Object.keys(parsedJSON).forEach((x)=>{
                nextArray[n].push(parsedJSON[x][keys[n]]);
            });
        }
        return nextArray;
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
                data = this.parseCSVtoDataProvider(data);
            } else if(file.name.split('.').pop() === "json") {
                data = this.parseJSONtoDataProvider(data);
            }
            this.setState({ name: file.name, dataProvided: data });
        };
        reader.readAsText(file);
    }

    dataChanged(event) {
        let pos = event.target.name.split(" ");
        let row = parseInt(pos[1], 10) + 1;
        let col = parseInt(pos[0], 10);
        let newData = this.props.dataProvided.slice(0);

        if (typeof event.target.value !== "undefined"/* && !isNaN(parseInt(event.target.value)) */) {
            newData[col][row] = event.target.value;
            this.setState({ dataProvided: newData });
            this.props.dataChanged;
        }
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
                    <FormGroup>
                        <Col componentClass={ControlLabel} xs={4}>
                            <FormControl.Static>
                                {i18n.t("GraficaD3.fill_in")}
                            </FormControl.Static>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} xs={2}>
                            {i18n.t("GraficaD3.data_cols")}
                        </Col>
                        <Col xs={3}>
                            <FormControl type="number" name="cols" value={this.props.dataProvided.length} onChange={this.colsChanged}/>
                        </Col>

                        <Col componentClass={ControlLabel} xs={1}>
                            {i18n.t("GraficaD3.data_rows")}
                        </Col>
                        <Col xs={3}>
                            <FormControl type="number" name="rows" value={this.props.dataProvided[0].length} onChange={this.rowsChanged}/>
                        </Col>
                        <Col xs={3}>
                            <Button className="btn btn-primary" onClick={this.confirmButton} style={{ marginTop: '0px' }}>{i18n.t("GraficaD3.confirm")}</Button>
                        </Col>
                    </FormGroup>
                    <div style={{ marginTop: '10px', overflowX: 'auto' }}>
                        <div style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                            {this.props.dataProvided.map((x, i) => {
                                return(
                                    <FormControl.Static key={i + 1} style={{ display: 'table-cell', padding: '8px', textAlign: 'center' }} />
                                );
                            })}
                        </div>
                        <table className="table bordered hover" >
                            <thead>
                                <tr>
                                    {this.state.dataProvided.map((x, i) => {
                                        return(
                                            <th key={i + 1}>
                                                <i className="material-icons clearCol" onClick={(e)=>{this.deleteCols(i);}}>clear</i>
                                                <FormControl type="text" name={i} value={this.props.dataProvided[i][0]} style={{ margin: '0px' }} onChange={this.keyChanged}/>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody style={{ backgroundColor: '#f2f2f2' }}>
                                {this.props.dataProvided[0].map((x, i) => {
                                    if(i === this.props.dataProvided[0].length - 1) {
                                        return true;
                                    }

                                    return (
                                        <tr key={i + 1}>
                                            {this.props.dataProvided.map((q, o) => {
                                                return(
                                                    <td key={o + 1}>
                                                        <i className="material-icons clearRow" onClick={()=>{this.deleteRows(i);}}>clear</i>
                                                        <FormControl type="text" name={o + " " + i} value={this.props.dataProvided[o][i + 1]} onChange={this.dataChanged}/>

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
