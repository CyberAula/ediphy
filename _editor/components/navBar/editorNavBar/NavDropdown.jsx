import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';

import Ediphy from '../../../../core/editor/main';
import Alert from '../../common/alert/Alert';
import { importStateAsync, updateUI } from "../../../../common/actions";

import { connect } from "react-redux";
import { UI } from "../../../../common/UI.es6";
import { Description, DropdownButton, EDDropDown, NavButton } from "./Styles";
import { MatIcon } from "../../../../sass/general/constants";
/**
 * Dropdown menu in the editor's navbar
 */
class NavDropdown extends Component
{
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
        return (
            <EDDropDown id="dropdown-menu">
                <Dropdown.Toggle noCaret className="navButton">
                    <NavButton>
                        <MatIcon children={'more_vert'} className={'material-icons'}/>
                        <Description className={'hideonresize'}>Menu</Description>
                    </NavButton>
                </Dropdown.Toggle>
                <Dropdown.Menu id="topMenu" style={{ left: 'auto', right: 0 }} className="pageMenu super-colors topMenu">
                    { this.dropdownButtons.map((button, i) => (
                        button.show ?
                            (button.divider ?
                                <MenuItem divider key={'div_' + i}/> :
                                <MenuItem eventKey={i} key={i}>
                                    <DropdownButton disabled={button.disabled} onClick={button.onClick}>
                                        <MatIcon>{button.icon}</MatIcon>{button.text}
                                    </DropdownButton>
                                </MenuItem>) : null))}
                </Dropdown.Menu>
                {this.state.alert}
            </EDDropDown>
        );
    }
    isAlreadySaved = () => {
        let reg = /.*ediphy_documents\/\d+\/edit/;
        let matched = window.parent.location.href.toString().match(reg);
        return matched && matched.length > 0;
    };

    onDeleteDocument = () => {
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
                            .catch(() =>{
                                alert("There was an error");
                            });
                    }
                    this.setState({ alert: null });
                }}>
                <span> {i18n.t("messages.delete_ediphy_document_message")} </span><br/>
            </Alert>);
        this.setState({ alert: alertComponent });
    };

    dropdownButtons = [
        {
            icon: 'save',
            text: i18n.t('Save'),
            show: Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button,
            disabled: this.props.undoDisabled,
            onClick: () => {
                this.props.save();
                this.props.dispatch(updateUI(UI.serverModal, true));
            },
        },
        {
            icon: 'file_upload',
            text: i18n.t('messages.import'),
            show: true,
            disabled: false,
            onClick: () => this.props.toggleFileUpload(undefined, '*'),
        },
        {
            icon: 'file_download',
            text: i18n.t('messages.export'),
            show: true,
            disabled: this.props.navItemSelected === 0,
            onClick: this.props.toggleExport,
        },
        {
            icon: 'settings',
            text: i18n.t('messages.globalConfig'),
            show: true,
            disabled: false,
            onClick: () => this.props.dispatch(updateUI(UI.showGlobalConfig, true)),
        },
        {
            divider: true,
            show: Ediphy.Config.externalProviders.enable_catalog_modal,
        },
        {
            icon: 'grid_on',
            text: i18n.t('Open_Catalog'),
            show: Ediphy.Config.externalProviders.enable_catalog_modal,
            disabled: false,
            onClick: this.props.onExternalCatalogToggled,
        },
        {
            divider: true,
            show: Ediphy.Config.open_button_enabled === undefined || Ediphy.Config.open_button_enabled,
        },
        {
            icon: 'folder_open',
            text: i18n.t('Open'),
            show: Ediphy.Config.open_button_enabled === undefined || Ediphy.Config.open_button_enabled,
            disabled: false,
            onClick: () => {
                this.props.dispatch(updateUI(UI.serverModal, true));
                this.props.dispatch(importStateAsync());
            },
        },
        {
            icon: 'help',
            text: i18n.t('messages.help'),
            show: true,
            disabled: false,
            onClick: () => this.props.dispatch(updateUI(UI.showHelpButton, true)),
        },
        {
            icon: 'delete',
            text: i18n.t('delete'),
            show: this.isAlreadySaved(),
            disabled: false,
            onClick: this.onDeleteDocument,
        },
        {
            icon: 'exit_to_app',
            text: i18n.t('messages.exit'),
            show: Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button,
            disabled: false,
            onClick: () => this.props.dispatch(updateUI(UI.showExitModal, true)),
        },

    ];
}

function mapStateToProps(state) {
    return {
        reactUI: state.reactUI,
        navItemSelected: state.undoGroup.present.navItemSelected,
        isBusy: state.undoGroup.present.isBusy,
        undoDisabled: state.undoGroup.past.length === 0,
    };
}

export default connect(mapStateToProps)(NavDropdown);

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
     * Stores the changes in the remote server
     */
    save: PropTypes.func.isRequired,
    /**
     * Shows/Hides the exportation modal form
     */
    toggleExport: PropTypes.func.isRequired,
    /**
     * Enables the "undo" feature
     */
    undoDisabled: PropTypes.bool,
    /**
     * Redux actions trigger
     */
    dispatch: PropTypes.func,
};
