import React from "react";
import { Form, Button, FormGroup, FormControl, ControlLabel, Col, Grid, Row, Table, Checkbox, Radio } from "react-bootstrap";
import FileInput from '@ranyefet/react-file-input';
import Alert from './../../_editor/components/alerts/alert/Alert';
import TableComponent from './table-component';
import i18n from 'i18next';

let DataProvider = React.createClass({
    getInitialState() {
        let rows = this.props.data.length;
        let cols = this.props.data.length === 0 ? 2 : Object.keys(this.props.data[0]).length;
        return {
            cols: cols,
            rows: rows,
            data: this.props.data,
            keys: this.props.keys,
            error: false,
        };
    },

    confirmButton() {
        let empty = false;
        outerloop:
        for (let i = 0; i < this.state.data.length; i++) {
            for (let o = 0; o < this.state.data.length; o++) {
                if(this.state.data[i][o] === "") {
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
    },
    deleteCols(col) {
        let pre = this.state.cols - 1;
        let keys = this.state.keys;
        let data = this.state.data;

        for (let i = 0; i < data.length; i++) {
            delete data[i][keys[col]];
        }
        keys.splice(col, 1);

        this.setState({ cols: pre, data: data, keys: keys });
    },
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
    },
    deleteRows(row) {
        let pre = this.state.rows - 1;
        let data = this.state.data;
        data.splice(row, 1);

        this.setState({ rows: pre, data: data });
    },
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
    },

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

    },

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
    },

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
    },

    compareKeys(a, b) {
        a = a.sort().toString();
        b = b.sort().toString();
        return a === b;
    },

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
    },

    dataChanged(event) {

        let pos = event.target.name.split(" ");
        let row = pos[0];
        let col = pos[1];
        let data = this.state.data;
        let newvalue = isNaN(event.target.value) || event.target.value === "" || event.target.value === null ? event.target.value : parseInt(event.target.value, 10);
        let newRow = {};
        newRow[col] = newvalue;
        data[row] = Object.assign({}, data[row], newRow);
        this.setState({ data: data });
    },

    render: function() {
        return (
            /* jshint ignore:start */
            <div id="datatable_config_modal">
                { this.state.alert }
                <Form horizontal style={{ padding: "16px" }}>
                    <FormGroup>
                        <FileInput onChange={this.fileChanged} className="fileInput">
                            {/* <Button className="btn btn-primary" style={{ marginTop: '0px' }}>{ Dali.i18n.t('FileDialog') }</Button>*/}
                            {/* <span style={{ marginLeft: '10px' }}>*/}
                            {/* <label className="control-label">{ Dali.i18n.t('FileDialog') + ':   ' } </label> { this.state.name || '' }</span>*/}
                            <div className="fileDrag">
                                <span style={{ display: this.state.name ? 'none' : 'block' }}><i className="material-icons">ic_file_upload</i><b>{ i18n.t('FileInput.Drag') }</b>{ i18n.t('FileInput.Drag_2') }<b>{ i18n.t('FileInput.Click') }</b>{ i18n.t('FileInput.Click_2') }</span>
                                <span className="fileUploaded" style={{ display: this.state.name ? 'block' : 'none' }}><i className="material-icons">insert_drive_file</i>{ this.state.name || '' }</span>
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
                                                        {o === 0 ? (<i className="material-icons clearRow" onClick={()=>{this.deleteRows(i);}}>clear</i>) : null}

                                                        <FormControl type="text" name={i + " " + this.state.keys[o]} value={this.state.data[i][this.state.keys[o]]} onChange={this.dataChanged}/>

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
    },
});

let ChartOptions = React.createClass({
    getInitialState() {

        let options = this.props.options;
        options.keys = this.props.keys;
        return options;
    },

    componentDidUpdate(prevProps, prevState) {

        if(prevState !== this.state) {
            if (typeof this.props.optionsChanged === 'function') {
                // console.log(this.state);
                this.props.optionsChanged({
                    disableFilter: this.state.disableFilter,
                    disableRowChoice: this.state.disableRowChoice,
                    disablePagination: this.state.disablePagination,
                    pageSizeLabel: this.state.pageSizeLabel,
                    searchLabel: this.state.searchLabel,
                    searchPlaceholder: this.state.searchPlaceholder,
                    initialPageLength: this.state.initialPageLength,
                    initialSort: this.state.initialSort,
                    initialOrder: this.state.initialOrder,
                });
            }
        }
    },
    render: function() {
        return (
            <div>
                <h4>{i18n.t("DataTable.header.options")}</h4>
                <div className="content-block">
                    <Form horizontal>
                        <FormGroup>
                            <Col xs={12}>
                                <FormControl.Static>
                                    {i18n.t("DataTable.show")}
                                </FormControl.Static>
                                <Col xs={12} >
                                    <Checkbox className="mycb" checked={!this.state.disableFilter}
                                        onChange={()=>{this.setState({ disableFilter: !this.state.disableFilter });}} />
                                    {i18n.t('DataTable.options.disableFilter')}</Col>
                                <Col xs={12} >
                                    <Checkbox className="mycb" checked={!this.state.disablePagination}
                                        onChange={()=>{this.setState({ disablePagination: !this.state.disablePagination });}} />
                                    {i18n.t('DataTable.options.disablePagination')}</Col>
                                <Col xs={12} >
                                    <Checkbox className="mycb" checked={!this.state.disableRowChoice}
                                        onChange={()=>{this.setState({ disableRowChoice: !this.state.disableRowChoice });}} />
                                    {i18n.t('DataTable.options.disableRowChoice')}</Col><br/><br/><br/>

                                <label htmlFor="">{i18n.t("DataTable.options.initialPageLength")}</label>
                                <FormControl type="number" value={this.state.initialPageLength}
                                    onChange={(e)=>{this.setState({ initialPageLength: e.target.value });}}/>
                                <label htmlFor="">{i18n.t("DataTable.options.initialSortProp")}</label>
                                <FormControl componentClass="select" placeholder="line"
                                    value={this.state.initialSort}
                                    onChange={(e)=>{this.setState({ initialSort: e.target.value });}}>
                                    <option key={"DEFAULT_0"} value={0}>{" "}</option>
                                    {this.state.keys.map(key=>{
                                        return(<option key={key} value={key}>{key}</option>);
                                    })}

                                </FormControl>
                                <label htmlFor="">{i18n.t("DataTable.options.initialOrderProp")}</label>
                                <FormGroup>
                                    <Radio name="radioGroup" inline style={{ marginLeft: '15px' }}
                                        onChange={e=>{this.setState({ initialOrder: 'ascending' });}}
                                        checked={this.state.initialOrder === 'ascending'}>
                                        {i18n.t("DataTable.options.ascending")}
                                    </Radio>

                                    <Radio name="radioGroup" inline style={{ marginLeft: '15px' }}
                                        onChange={e=>{this.setState({ initialOrder: 'descending' });}}
                                        checked={this.state.initialOrder === 'descending'}>
                                        {i18n.t("DataTable.options.descending")}
                                    </Radio>
                                </FormGroup>

                            </Col>
                            <Col xs={12}>
                                <label htmlFor="">{i18n.t("DataTable.options.pageSizeLabel")}</label>
                                <FormControl type="text" value={this.state.pageSizeLabel}
                                    onChange={(e)=>{this.setState({ pageSizeLabel: e.target.value });}}/>
                                <label htmlFor="">{i18n.t("DataTable.options.searchLabel")}</label>
                                <FormControl type="text" value={this.state.searchLabel}
                                    onChange={(e)=>{this.setState({ searchLabel: e.target.value });}}/>
                                <label htmlFor="">{i18n.t("DataTable.options.searchPlaceholder")}</label>
                                <FormControl type="text" value={this.state.searchPlaceholder}
                                    onChange={(e)=>{this.setState({ searchPlaceholder: e.target.value });}}/>

                            </Col>
                        </FormGroup>
                        <FormGroup />
                    </Form>
                </div>
            </div>
        );
    },
});

let Config = React.createClass({

    componentDidUpdate(nextProps, nextState) {
        if(nextProps.state.editing === false) {
            this.props.base.configModalNeedsUpdate();
        }
    },

    getInitialState() {

        let state = this.props.state;
        state.base = this.props.base;
        return state;
    },

    modifyState() {
        // console.log("modifyState");
        // console.log(this.state);
        this.state.base.setState("options", this.state.options);
        this.state.base.setState("data", this.state.data);
        this.state.base.setState("keys", this.state.keys);
        this.state.base.setState("editing", this.state.editing);
    },

    dataChanged(values) {

        this.setState({ editing: false });
        this.state.base.setState("data", values.data);
        this.setOptions(values.data, values.keys);
        this.updateChart();

    },

    setOptions(data, keys) {
        let nKeys = [];
        for (let i = 0; i < keys.length; i++) {
            let value = keys[i];
            nKeys[i] = {};
            nKeys[i].value = value;
            nKeys[i].notNumber = true;
        }

        for (let o = 0; o < data.length; o++) {
            let row = data[o];
            for (let i = 0; i < keys.length; i++) {
                let key = nKeys[i];
                data[o][keys[i]] = isNaN(data[o][keys[i]]) || typeof(data[o][keys[i]]) === "boolean" || data[o][keys[i]] === "" || data[o][keys[i]] === null ? data[o][keys[i]] : parseInt(data[o][keys[i]], 10);
                if(key.notNumber) {
                    nKeys[i].notNumber = isNaN(row[key.value]) || typeof(row[key.value]) === "boolean" || row[key.value] === "";
                }
            }
        }

        let options = this.state.options;
        this.setState({ data: data, keys: keys, options: options });
    },

    optionsChanged(options) {
        // console.log("optionshanged");
        // console.log(options);
        this.setState({ options: options });
        this.state.base.setState("options", options);
        this.updateChart();
    },

    editButtonClicked() {
        // console.log("editButton");
        // console.log(this.state);
        this.setState({ editing: true });
    },

    updateChart() {
        this.setState({ key: Math.random() });
    },

    render() {

        this.modifyState();
        return (
            <Grid>
                <Row>

                    <Col lg={this.state.editing ? 12 : 3} xs={12}>
                        <h4> {i18n.t("DataTable.header.origin")} </h4>
                        {!this.state.editing &&
                        <Button onClick={this.editButtonClicked} style={{ marginTop: '0px' }} className="btn-primary">{i18n.t("DataTable.edit")} </Button>
                        }
                        {this.state.editing &&
                        <DataProvider data={this.state.data} dataChanged={this.dataChanged} keys={this.state.keys} />
                        }
                        {!this.state.editing &&
                        <ChartOptions options={this.state.options} optionsChanged={this.optionsChanged} keys={this.state.keys} />
                        }
                    </Col>
                    <Col lg={9} xs={12}>
                        {!this.state.editing && <div>
                            <h4>{i18n.t("DataTable.header.preview")}</h4><br/>
                            <div style={{ marginRight: '-10px', marginLeft: '0px' }} ref="chartContainer">
                                <TableComponent data={this.state.data} options={this.state.options} key={this.state.key} />
                            </div>
                        </div>}
                    </Col>

                </Row>

            </Grid>

        );
    },
});

module.exports = Config;
