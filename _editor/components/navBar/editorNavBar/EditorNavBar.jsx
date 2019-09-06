import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import GlobalConfig from '../globalConfig/GlobalConfig';
import NavActionButtons from './NavActionButtons.jsx';
import NavDropdown from './NavDropdown.jsx';
import PluginsMenu from './PluginsMenu.jsx';
import './_navBar.scss';
import screenfull from 'screenfull';
import { selectNavItem } from "../../../../common/actions";
import ExportModal from '../export/ExportModal';
import StyleConfig from '../styleConfig/StyleConfig';
import { connect } from "react-redux";
import { updateUI } from "../../../../common/actions";
import { UI } from "../../../../common/UI.es6";

/**
 * Upper navigation bar component
 */
class EditorNavBar extends Component
{
    state = {
        showExport: false,
        isFullScreenOn: screenfull.isFullscreen,
    };

    render() {
        return (
            <Col id="iconBar">
                <div className="grad1" />
                <div className="identity">
                    <span className="highlight">ED</span>iphy
                </div>
                <PluginsMenu/>
                <NavActionButtons
                    save={this.props.handleExportImport.save}
                    toggleStyleConfig={this.toggleStyleConfig}
                />
                <NavDropdown
                    save={this.props.handleExportImport.save}
                    toggleExport={this.toggleExport}
                    toggleFileUpload={this.toggleFileUpload}
                />
                <StyleConfig/>
                <GlobalConfig
                    globalConfig={this.props.globalConfig}
                    toggleFileUpload={this.toggleFileUpload}
                />
                <ExportModal
                    export={this.props.handleExportImport.exportResource}
                    scorm={this.props.handleExportImport.exportToScorm}
                    close={this.toggleExport} />
            </Col>
        );
    }

    /**
       * Shows/Hides the Export course modal
       */
    toggleExport = (forceClose) => {
        let newExportState = forceClose ? false : !this.props.reactUI.showExportModal;
        this.props.dispatch(updateUI(UI.showExportModal, newExportState));
    };
    /**
     * Shows/Hides the StyleConfig modal
     */
    toggleStyleConfig = () => {
        return this.props.dispatch(updateUI({ showStyleConfig: !this.props.reactUI.showStyleConfig }));
    };
    /**
     * Shows/Hides the Import file modal
     */
    toggleFileUpload = (id, accept) => {
        this.props.dispatch(updateUI({
            showFileUpload: accept,
            fileModalResult: { id: id, value: undefined },
            fileUploadTa: 0,
        }));
    };
}

export default connect(mapStateToProps)(EditorNavBar);

function mapStateToProps(state) {
    return {
        status: state.status,
        everPublished: state.everPublished,
        globalConfig: state.undoGroup.present.globalConfig,
        navItemSelected: state.undoGroup.present.navItemSelected,
        navItems: state.undoGroup.present.navItemsById,
        boxSelected: state.undoGroup.present.boxSelected,
        reactUI: state.reactUI,
    };
}
EditorNavBar.propTypes = {
    /**
     * Redux actions trigger
     */
    dispatch: PropTypes.func,
    /**
     * Object containing the global configuration of the document
     */
    globalConfig: PropTypes.object.isRequired,
    /**
     * React UI params
     */
    reactUI: PropTypes.object.isRequired,
    /**
     * Collection of functions for export and import handling
     */
    handleExportImport: PropTypes.object.isRequired,
};
