import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import GlobalConfig from '../global_config/GlobalConfig';
import NavActionButtons from './NavActionButtons.jsx';
import NavDropdown from './NavDropdown.jsx';
import PluginsMenu from './PluginsMenu.jsx';
import './_navBar.scss';
import screenfull from 'screenfull';
import { selectNavItem } from "../../../../common/actions";
import ExportModal from '../export/ExportModal';
import StyleConfig from '../style_config/StyleConfig';
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
                    redo={this.props.redo}
                    save={this.props.save}
                    undo={this.props.undo}
                    toggleStyleConfig={this.toggleStyleConfig}
                />
                <NavDropdown
                    save={this.props.save}
                    toggleExport={this.toggleExport}
                    toggleFileUpload={this.toggleFileUpload}
                />
                <StyleConfig/>
                <GlobalConfig
                    globalConfig={this.props.globalConfig}
                    toggleFileUpload={this.toggleFileUpload}
                />
                <ExportModal
                    export={this.props.export}
                    scorm={this.props.scorm}
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
     * Undoes the last change
     */
    undo: PropTypes.func,
    /**
     * Redoes the last change
     */
    redo: PropTypes.func,
    /**
     * Exports the document to HTML
     */
    export: PropTypes.func.isRequired,
    /**
     * React UI params
     */
    reactUI: PropTypes.object.isRequired,
    /**
     * Exports the document to SCORM
     */
    scorm: PropTypes.func.isRequired,
    /**
     * Saves the changes in the server
     */
    save: PropTypes.func.isRequired,
};
