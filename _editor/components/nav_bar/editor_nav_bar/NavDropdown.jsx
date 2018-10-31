import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';

import Ediphy from '../../../../core/editor/main';
import Alert from '../../common/alert/Alert';
/**
 * Dropdown menu in the editor's navbar
 */
export default class NavDropdown extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            alert: undefined,
        };
    }

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        let isBusy = this.props.isBusy.toString(); // Only to trigger render
        return (
            <Dropdown id="dropdown-menu" style={{ float: 'right' }}>
                <Dropdown.Toggle noCaret className="navButton">
                    <i className="material-icons">more_vert</i>
                    <span className="hideonresize" style={{ fontSize: '12px' }}>Menu</span>
                </Dropdown.Toggle>
                <Dropdown.Menu id="topMenu" className="pageMenu super-colors topMenu">
                    {(Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button) &&
                    <MenuItem eventKey="6" key="6">
                        <button className="dropdownButton"
                            disabled={this.props.undoDisabled}
                            onClick={(e) => {
                                this.props.save();
                                this.props.serverModalOpen();
                            }}>
                            <i className="material-icons">save</i>
                            {i18n.t('Save')}
                        </button>
                    </MenuItem>}
                    <MenuItem disabled={this.props.undoDisabled} eventKey="1" key="1">
                        <button className="dropdownButton" title={i18n.t('messages.import')}
                            disabled={ false }
                            onClick={()=>{this.props.toggleFileUpload(undefined, '*');}}>
                            <i className="material-icons">file_upload</i>
                            {i18n.t('messages.import')}
                        </button>
                    </MenuItem>
                    <MenuItem eventKey="2" key="2">
                        <button className="dropdownButton" title={i18n.t('messages.export')}
                            disabled={this.props.navItemSelected === 0}
                            onClick={()=>this.props.toggleExport()}><i className="material-icons">file_download</i>
                            {i18n.t('messages.export')}
                        </button>
                    </MenuItem>
                    <MenuItem disabled={false} eventKey="3" key="3">
                        <button className="dropdownButton" title={i18n.t('messages.global_config')}
                            disabled={false}
                            onClick={this.props.toggleGlobalConfig}><i className="material-icons">settings</i>
                            {i18n.t('messages.global_config')}
                        </button>
                    </MenuItem>
                    {Ediphy.Config.external_providers.enable_catalog_modal &&
                    [<MenuItem divider key="div_4"/>,
                        <MenuItem eventKey="4" key="4">
                            <button className="dropdownButton" title={i18n.t('Open_Catalog')}
                                onClick={() => {
                                    this.props.onExternalCatalogToggled();
                                }}><i className="material-icons">grid_on</i>
                                {i18n.t('Open_Catalog')}
                            </button>
                        </MenuItem>]}
                    {(Ediphy.Config.open_button_enabled === undefined || Ediphy.Config.open_button_enabled) &&
                    [<MenuItem divider key="div_5"/>,
                        <MenuItem eventKey="5" key="5">
                            <button className="dropdownButton"
                                onClick={(e) => {
                                    this.props.serverModalOpen();
                                    this.props.opens();
                                }}>
                                <i className="material-icons">folder_open</i>
                                {i18n.t('Open')}
                            </button>
                        </MenuItem>]}
                    <MenuItem disabled={false} eventKey="6" key="6">
                        <button className="dropdownButton" title={i18n.t('messages.help')}
                            disabled={false}
                            onClick={this.props.openTour}><i className="material-icons">help</i>
                            {i18n.t('messages.help')}
                        </button>
                    </MenuItem>
                    {(this.isAlreadySaved()) ? <MenuItem disabled={false} eventKey="7" key="7">
                        <button className="dropdownButton" title={i18n.t('delete')}
                            disabled={false}
                            onClick={this.onDeleteDocument.bind(this)}><i className="material-icons">delete</i>
                            {i18n.t('delete')}
                        </button>
                    </MenuItem> : null}
                    {(Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button) &&
                    <MenuItem disabled={false} eventKey="8" key="8">
                        <button className="dropdownButton" title={i18n.t('messages.help')}
                            disabled={false}
                            onClick={(e) => {
                                this.props.openExitModal();
                            }}><i className="material-icons">exit_to_app</i>
                            {i18n.t('messages.exit')}
                        </button>
                    </MenuItem>}

                </Dropdown.Menu>
                {this.state.alert}
            </Dropdown>
        );
    }
    isAlreadySaved() {
        let reg = /.*ediphy_documents\/\d+\/edit/;
        let matched = window.parent.location.href.toString().match(reg);
        return matched && matched.length > 0;
    }
    onDeleteDocument() {
        let alertComponent = (
            <Alert className="pageModal"
                show
                hasHeader
                title={<span><i style={{ fontSize: '14px', marginRight: '5px', color: "orange" }} className="material-icons">warning</i>{i18n.t("messages.delete_ediphy_document")}</span>}
                cancelButton
                acceptButtonText={i18n.t("messages.OK")}
                onClose={(bool)=>{
                    if (bool && ediphy_editor_params) {
                        let form = new FormData();
                        form.append("authenticity_token", ediphy_editor_params.authenticity_token);
                        form.append("_method", 'delete');

                        fetch(ediphy_editor_params.export_url, {
                            credentials: 'same-origin',
                            method: 'POST',
                            body: form,
                        })
                            .then(response => {
                                if (response.status >= 400) {
                                    throw new Error(i18n.t("error.exporting"));
                                }
                                window.parent.location = response.url;
                            })
                            .catch(e =>{
                                alert("There was an error");
                            });
                    }
                    this.setState({ alert: null });
                }}>
                <span> {i18n.t("messages.delete_ediphy_document_message")} </span><br/>
            </Alert>);
        this.setState({ alert: alertComponent });
    }
}

NavDropdown.propTypes = {

    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Opens an external catalog with all the resources uploaded to the server
     */
    onExternalCatalogToggled: PropTypes.func,
    /**
     * Callback for opening the file upload modal
     */
    toggleFileUpload: PropTypes.func.isRequired,
    /**
     * Load an specific course from the remote server
     */
    opens: PropTypes.func.isRequired,
    /**
     * Stores the changes in the remote server
     */
    save: PropTypes.func.isRequired,
    /**
     * Popup that indicates whether the import/export to the server was successful or not
     */
    serverModalOpen: PropTypes.func.isRequired,
    /**
     * Shows/Hides the global course configuration modal form
     */
    toggleGlobalConfig: PropTypes.func.isRequired,
    /**
     * Shows/Hides the exportation modal form
     */
    toggleExport: PropTypes.func.isRequired,
    /**
     * Enables the "undo" feature
     */
    undoDisabled: PropTypes.bool,
    /**
     * Shows exit modal
     */
    openExitModal: PropTypes.func.isRequired,
    /**
     * Opens Tour Modal
     */
    openTour: PropTypes.func.isRequired,
    /**
   * Indicates if there is a current server operation
   */
    isBusy: PropTypes.any,
};
