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
     *  Shows/hides the plugin tab
     */
    hideTab: PropTypes.oneOf(["show", "hide"]).isRequired,
    /**
     * Object containing the global configuration of the document
     */
    globalConfig: PropTypes.object.isRequired,
    /**
     * Modifies the global configuration of the document
     */
    changeGlobalConfig: PropTypes.func.isRequired,
    /**
     * Shows the global configuration of the document
     */
    showGlobalConfig: PropTypes.bool.isRequired,
    /**
     * Toggles the global configuration of the document
     */
    toggleGlobalConfig: PropTypes.func.isRequired,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Current selected box
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Undoes the last change
     */
    undo: PropTypes.func.isRequired,
    /**
     * Redoes the last change
     */
    redo: PropTypes.func.isRequired,
    /**
     * Activates preview mode
     */
    visor: PropTypes.func.isRequired,
    /**
     * Exports the document to HTML
     */
    export: PropTypes.func.isRequired,
    /**
     * Exports the document to SCORM
     */
    scorm: PropTypes.func.isRequired,
    /**
     * Saves the changes in the server
     */
    save: PropTypes.func.isRequired,
    /**
     * Selected plugin category
     */
    category: PropTypes.string.isRequired,
    /**
     * Load server changes
     */
    opens: PropTypes.func.isRequired,
    /**
     * Opens a modal indicating the server operation status
     */
    serverModalOpen: PropTypes.func.isRequired,
    /**
      * Callback for opening the file upload modal
      */
    toggleFileUpload: PropTypes.func.isRequired,
    /**
     * Last files uploaded to server or searched in modal
     */
    fileModalResult: PropTypes.object,
    /**
     * Changes the category of plugins selected
     */
    setcat: PropTypes.func.isRequired,
    /**
   * Object that contains all created views (identified by its *id*)
   */
    navItems: PropTypes.object.isRequired,
    /**
     * Opens Tour Modal
     */
    openTour: PropTypes.func.isRequired,
    /**
     * Publish the document
     */
    publishing: PropTypes.func.isRequired,
    /**
       * Indicates if there is a current server operation
       */
    isBusy: PropTypes.any,
    /**
     *  Function for uploading a file to the server
     */
    uploadFunction: PropTypes.func.isRequired,
    /**
     * Function for selecting a box
     */
    onBoxSelected: PropTypes.func.isRequired,
    /**
     * Function for updating style config
     */
    changeStyleConfig: PropTypes.func.isRequired,
};

/**
 * TODO: Si queremos parametrizar esta clase hacemos un json y lo recorremos con los siguientes elementos:
 *
 *  {
 *    navbar:[{
 *      title,
 *      className,
 *      disabled,
 *      tooltip,
 *      icon,
 *      onClick [func],
 *      shownCondition [func],
 *    },{},...],
 *    dropdownMenu: [{title,
 *      className,
 *      disabled,
 *      tooltip,
 *      icon,
 *      onClick [func],
 *      shownCondition [func],}]
 *  }
 * */
