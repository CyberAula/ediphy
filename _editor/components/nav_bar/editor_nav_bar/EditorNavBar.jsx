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
/**
 * Upper navigation bar component
 */
export default class EditorNavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showImportFile: false,
            showExport: false,
            isFullScreenOn: screenfull.isFullscreen,
        };

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
                    redo={this.props.redo}
                    redoDisabled={this.props.redoDisabled}
                    publishing={this.props.publishing}
                    save={this.props.save}
                    serverModalOpen={this.props.serverModalOpen}
                    undo={this.props.undo}
                    undoDisabled={this.props.undoDisabled}
                    onBoxSelected={this.props.onBoxSelected}
                    toggleStyleConfig={this.props.toggleStyleConfig}
                    visor={this.props.visor} />
                <NavDropdown /* export={this.props.export}*/
                    navItemSelected={this.props.navItemSelected}
                    opens={this.props.opens}
                    save={this.props.save}
                    openExitModal={this.props.openExitModal}
                    openTour={this.props.openTour}
                    serverModalOpen={this.props.serverModalOpen}
                    toggleGlobalConfig={this.props.toggleGlobalConfig}
                    toggleImportFile={this.toggleImportFile}
                    toggleExport={this.toggleExport}
                    toggleFileUpload={this.props.toggleFileUpload}
                    isBusy={this.props.isBusy}
                    undoDisabled={this.props.undoDisabled} />
                <StyleConfig show={this.props.showStyleConfig}
                    styleConfig={this.props.styleConfig}
                    toggleFileUpload={this.props.toggleFileUpload}
                    fileModalResult={this.props.fileModalResult}
                    changeStyleConfig={this.props.changeStyleConfig}
                    uploadFunction={this.props.uploadFunction}
                    close={this.props.toggleStyleConfig} />
                <GlobalConfig show={this.props.showGlobalConfig}
                    globalConfig={this.props.globalConfig}
                    toggleFileUpload={this.props.toggleFileUpload}
                    fileModalResult={this.props.fileModalResult}
                    changeGlobalConfig={this.props.changeGlobalConfig}
                    uploadFunction={this.props.uploadFunction}
                    close={this.props.toggleGlobalConfig} />
                <ExportModal aspectRatio={this.props.globalConfig.canvasRatio}
                    show={this.state.showExport}
                    export={this.props.export}
                    scorm={this.props.scorm}
                    close={this.toggleExport} />

            </Col>
        );
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
     * Function for opening/closing Style config modal
     */
    toggleStyleConfig: PropTypes.func.isRequired,
    /**
     * Function for updating style config
     */
    changeStyleConfig: PropTypes.func.isRequired,
    /**
     * Object with style params
     */
    styleConfig: PropTypes.object,
    /**
     * Should style config modal be shown
     */
    showStyleConfig: PropTypes.bool,
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
