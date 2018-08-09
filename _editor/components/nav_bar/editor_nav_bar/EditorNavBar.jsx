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
/**
 * Upper navigation bar component
 */
export default class EditorNavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showGlobalConfig: false,
            showImportFile: false,
            showExport: false,
            isFullScreenOn: screenfull.isFullscreen,
        };

        this.toggleGlobalConfig = this.toggleGlobalConfig.bind(this);
        this.toggleExport = this.toggleExport.bind(this);
    }

    render() {
        return (
            <Col id="iconBar">
                <div className="grad1" />
                <div className="identity"><span className="highlight">ED</span>iphy</div>
                <PluginsMenu category={this.props.category} hideTab={this.props.hideTab} setcat={this.props.setcat} />
                <NavActionButtons boxSelected={this.props.boxSelected}
                    changeGlobalConfig={this.props.changeGlobalConfig}
                    globalConfig={this.props.globalConfig}
                    navItemSelected={this.props.navItemSelected}
                    navItems={this.props.navItems}
                    onTextEditorToggled={this.props.onTextEditorToggled}
                    redo={this.props.redo}
                    redoDisabled={this.props.redoDisabled}
                    publishing={this.props.publishing}
                    save={this.props.save}
                    serverModalOpen={this.props.serverModalOpen}
                    undo={this.props.undo}
                    undoDisabled={this.props.undoDisabled}
                    visor={this.props.visor} />
                <NavDropdown /* export={this.props.export}*/
                    navItemSelected={this.props.navItemSelected}
                    opens={this.props.opens}
                    save={this.props.save}
                    openExitModal={this.props.openExitModal}
                    openTour={this.props.openTour}
                    serverModalOpen={this.props.serverModalOpen}
                    toggleGlobalConfig={this.toggleGlobalConfig}
                    toggleImportFile={this.toggleImportFile}
                    toggleExport={this.toggleExport}
                    toggleFileUpload={this.props.toggleFileUpload}
                    undoDisabled={this.props.undoDisabled} />
                <GlobalConfig show={this.state.showGlobalConfig}
                    globalConfig={this.props.globalConfig}
                    toggleFileUpload={this.props.toggleFileUpload}
                    fileModalResult={this.props.fileModalResult}
                    changeGlobalConfig={this.props.changeGlobalConfig}
                    close={this.toggleGlobalConfig} />
                <ExportModal show={this.state.showExport} export={this.props.export} scorm={this.props.scorm} close={this.toggleExport} />

            </Col>
        );
    }

    /**
     * Shows/Hides the global configuration menu
     */
    toggleGlobalConfig() {
        this.setState((prevState, props) => ({
            showGlobalConfig: !prevState.showGlobalConfig,
        }));
    }

    /**
       * Shows/Hides the Export course modal
       */
    toggleExport(forceClose) {
        this.setState((prevState, props) => ({
            showExport: forceClose ? false : !prevState.showExport,
        }));
    }
}

EditorNavBar.propTypes = {
    /**
     * Callback for toggling the CKEDitor
     */
    onTextEditorToggled: PropTypes.func.isRequired,
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
     * Allows the use of the undo funtion
     */
    undoDisabled: PropTypes.bool,
    /**
     * Allows the use of the redo function
     */
    redoDisabled: PropTypes.bool,
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
     * Shows exit modal
     */
    openExitModal: PropTypes.func.isRequired,
    /**
     * Opens Tour Modal
     */
    openTour: PropTypes.func.isRequired,
    /**
     * Whether the document is being published
     */
    publishing: PropTypes.bool,
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
