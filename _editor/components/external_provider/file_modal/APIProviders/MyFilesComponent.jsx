import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { Button, Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import ExternalDropzone from './ExternalDropzone';
import { WithContext as ReactTags } from 'react-tag-input';
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
        let files = this.props.filesUploaded.map(file => {
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
                            this.props.onElementSelected(file.name, file.url, file.type);
                            e.stopPropagation();
                        }} className={"myFileContent" + ((file.url === this.props.elementSelected) ? " active" : "")}>
                            {file.type === 'image' ? "" : <i className="material-icons">{file.icon || "attach_file"}</i>}
                        </Button>
                        <span className="ellipsis">{file.name}</span>
                    </Col>);
                })}
                <p className="empty">{empty ? 'No hay ficheros con las condiciones especificadas' : ''}</p>
            </Row>
            <div id="sideBar" className={this.props.pdfSelected ? "showBar" : ""}>
                {this.props.pdfSelected ? (<div id="wrapper">
                    <div id="sideArrow">
                        <button onClick={()=>{this.props.closeSideBar();}}><i className="material-icons">keyboard_arrow_right</i></button>
                    </div>
                    <div id="pdfContent">
                        <PDFHandler navItemSelected={this.props.navItemSelected}
                            boxes={this.props.boxes}
                            onBoxAdded={this.props.onBoxAdded}
                            onNavItemAdded={this.props.onNavItemAdded}
                            onNavItemsAdded={this.props.onNavItemsAdded}
                            onIndexSelected={this.props.onIndexSelected}
                            onNavItemSelected={this.props.onNavItemSelected}
                            // onToolbarUpdated={this.props.onToolbarUpdated}
                            navItemsIds={this.props.navItemsIds}
                            navItems={this.props.navItems}
                            containedViews={this.props.containedViews}
                            containedViewSelected={this.props.containedViewSelected}
                            show
                            url={this.props.elementSelected}
                            close={this.props.closeSideBar}/></div>
                </div>) : null }

            </div>
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
