import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';

import Ediphy from '../../../../core/editor/main';

/**
 * Dropdown menu in the editor's navbar
 */
export default class NavDropdown extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);
    }

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        return (
            <Dropdown id="dropdown-menu" style={{ float: 'right' }}>
                <Dropdown.Toggle noCaret className="navButton">
                    <i className="material-icons">more_vert</i><br/>
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
                            onClick={()=>{this.props.toggleFileUpload(undefined, '*');}}><i className="material-icons">file_upload</i>
                            {i18n.t('messages.import')}
                        </button>
                    </MenuItem>
                    {/*                    <MenuItem eventKey="1" key="1">
                        <button className="dropdownButton" title={i18n.t('messages.export_to_HTML')}
                            disabled={ (this.props.navItemSelected === 0) || this.props.undoDisabled}
                            onClick={() => this.props.export() }><i className="material-icons">file_download</i>
                            {i18n.t('messages.export_to_HTML')}
                        </button>
                    </MenuItem>
                    <MenuItem eventKey="2" key="2">
                        <button className="dropdownButton" title={i18n.t('messages.export_to_SCORM')}
                            disabled={(this.props.navItemSelected === 0) || this.props.undoDisabled}
                            onClick={() => this.props.scorm() }><i className="material-icons">class</i>
                            {i18n.t('messages.export_to_SCORM')}
                        </button>
                    </MenuItem>*/}
                    <MenuItem eventKey="2" key="2">
                        <button className="dropdownButton" title={i18n.t('messages.export')}
                            disabled={this.props.navItemSelected === 0}
                            onClick={this.props.toggleExport}><i className="material-icons">file_download</i>
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

                </Dropdown.Menu>
            </Dropdown>
        );
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
};
