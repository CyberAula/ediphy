import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { Button, Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import '../../../nav_bar/global_config/_reactTags.scss';
import { extensions } from '../FileHandlers/FileHandlers';
import PDFHandler from "../FileHandlers/PDFHandler";
export default class MyFilesComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: undefined,
            filter: "",
            extensionFilter: this.props.show,
            keywords: [],
        };

    }
    render() {
        let keywords = this.state.keywords;
        let empty = true;
        let files = Object.keys(this.props.filesUploaded).map(f => {
            let file = this.props.filesUploaded[f];
            let type;
            let icon = "attach_file";
            for (let e in extensions) {
                let ext = extensions[e];
                if (file.mimetype.match(ext.value)) {
                    type = ext.value;
                    icon = ext.icon;
                }
            }
            if(((file.name && file.name.match(this.state.filter)) || (file.mimetype && file.mimetype.match(this.state.filter))) // Matches written filter
                && (this.state.extensionFilter === "*" || (file.mimetype && file.mimetype.match(this.state.extensionFilter))) // Matches extension filter
            ) { empty = false;
                return { ...file, type, icon };
            }

            return { ...file, type, icon, hide: true };
        });
        files.reverse();
        let currentExtension = this.props.show === "*" ? this.state.extensionFilter : this.props.show;
        currentExtension = currentExtension === '*' ? '' : currentExtension;
        let aux = currentExtension;
        for (let e in extensions) {
            let ext = extensions[e];
            if (currentExtension.match(ext.value)) {
                aux = ext.value;
            }
        }
        currentExtension = aux;
        return(<div className="myFilesComponent">
            <h5>{this.props.icon ? <img className="fileMenuIcon" src={this.props.icon } alt=""/> : this.props.name}</h5>
            <hr />

            <Row>
                <Col key="filter" xs={12} md={6}>
                    <FormGroup >
                        <ControlLabel>{i18n.t('Filter')}:</ControlLabel><br/>
                        <FormControl type="text" value={this.state.filter} placeholder="..." id="filterInput" autoFocus onChange={e => {this.setState({ filter: e.target.value });}}/>
                    </FormGroup>
                </Col>
                <Col key="extfilter" xs={12} md={6}>
                    <FormGroup >
                        <ControlLabel>{i18n.t('Extensions')}:</ControlLabel><br/>
                        <Select
                            name="form-field-extensions"
                            value={currentExtension}
                            disabled = {this.props.show !== "*"}
                            options={extensions}
                            onChange={e => {this.setState({ extensionFilter: e.value });}} />
                    </FormGroup>

                </Col>
            </Row>
            <Row className="myFilesRow" onClick={e=>{this.props.onElementSelected(undefined, undefined, undefined);}}>
                {files.map((file, i)=>{
                    return (<Col key={i} className={"myFile" + (file.hide ? ' hidden' : '')} xs={12} sm={6} md={4} lg={3}>
                        <Button style={{ backgroundImage: file.type === 'image' ? ("url(" + file.url + ")") : "" }} onClick={(e)=>{
                            this.props.onElementSelected(file.name, file.url, file.type, file.id);
                            e.stopPropagation();
                        }} className={"myFileContent" + ((file.id === this.props.id) ? " active" : "")}>
                            {file.type === 'image' ? "" : <i className="material-icons">{file.icon || "attach_file"}</i>}
                        </Button>
                        <span className="ellipsis">{file.name}</span>
                    </Col>);
                })}
                <p className="empty">{empty ? 'No hay ficheros con las condiciones especificadas' : ''}</p>
            </Row>

        </div>);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show !== this.props.show) {
            this.setState({ extensionFilter: nextProps.show });
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if ((nextProps.filesUploaded && this.props.filesUploaded && nextProps.filesUploaded.length !== this.props.filesUploaded.length)
        /* || nextState.filter !== this.state.filter || nextState.extensionFilter !== this.state.extensionFilter*/) {
            // this.props.onElementSelected( undefined, undefined, undefined);
        }
    }

}

MyFilesComponent.propTypes = {
    /**
   * Boolean that shows/hide the file upload modal
   */
    callback: PropTypes.func,
};
