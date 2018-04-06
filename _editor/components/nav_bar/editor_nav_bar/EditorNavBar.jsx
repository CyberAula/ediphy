import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import GlobalConfig from '../global_config/GlobalConfig';
import NavActionButtons from './NavActionButtons.jsx';
import NavDropdown from './NavDropdown.jsx';
import PluginsMenu from './PluginsMenu.jsx';
import './_navBar.scss';
import screenfull from 'screenfull';
import ImportFile from "../import_file/ImportFile";
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
        this.toggleImportFile = this.toggleImportFile.bind(this);
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
                    save={this.props.save}
                    serverModalOpen={this.props.serverModalOpen}
                    undo={this.props.undo}
                    undoDisabled={this.props.undoDisabled}
                    visor={this.props.visor} />
                <NavDropdown /* export={this.props.export}*/
                    navItemSelected={this.props.navItemSelected}
                    onExternalCatalogToggled={this.props.onExternalCatalogToggled}
                    opens={this.props.opens}
                    save={this.props.save}
                    serverModalOpen={this.props.serverModalOpen}
                    toggleGlobalConfig={this.toggleGlobalConfig}
                    toggleImportFile={this.toggleImportFile}
                    toggleExport={this.toggleExport}
                    undoDisabled={this.props.undoDisabled} />
                <GlobalConfig show={this.state.showGlobalConfig}
                    globalConfig={this.props.globalConfig}
                    changeGlobalConfig={this.props.changeGlobalConfig}
                    close={this.toggleGlobalConfig} />
                <ImportFile navItemSelected={this.props.navItemSelected}
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
                    show={this.state.showImportFile}
                    close={this.toggleImportFile}/>
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
     * Shows/Hides the Import file modal
     */
    toggleImportFile() {
        this.setState((prevState, props) => ({
            showImportFile: !prevState.showImportFile,
        }));
    }
    /**
       * Shows/Hides the Export course modal
       */
    toggleExport() {
        this.setState((prevState, props) => ({
            showExport: !prevState.showExport,
        }));
    }
}

EditorNavBar.propTypes = {
    /**
     *  Muestra o oculta la barra de plugins
     */
    hideTab: PropTypes.oneOf(["show", "hide"]).isRequired,
    /**
     * Objeto que contiene la configuración global del curso almacenada en el estado de Redux
     */
    globalConfig: PropTypes.object.isRequired,
    /**
     * Modifica la configuración global del curso
     */
    changeGlobalConfig: PropTypes.func.isRequired,
    /**
     * Permite utilizar la funcionalidad de undo
     */
    undoDisabled: PropTypes.bool,
    /**
     * Permite utilizar la funcionalidad de redo
     */
    redoDisabled: PropTypes.bool,
    /**
     * Identifica la vista contenida que se está editando
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Caja seleccionada
     */
    boxSelected: PropTypes.any.isRequired,

    /**
     * Deshace el último cambio
     */
    undo: PropTypes.func.isRequired,
    /**
     * Rehace el último cambio
     */
    redo: PropTypes.func.isRequired,
    /**
     * Activa el modo previsualización
     */
    visor: PropTypes.func.isRequired,
    /**
     * Exporta el curso en HTML
     */
    export: PropTypes.func.isRequired,
    /**
     * Exporta el curso en SCORM
     */
    scorm: PropTypes.func.isRequired,
    /**
     * Guarda los cambios en el servidor remoto
     */
    save: PropTypes.func.isRequired,
    /**
     * Categoria de plugin mostrada
     */
    category: PropTypes.string.isRequired,
    /**
     * Carga los cambios desde el servidor remoto
     */
    opens: PropTypes.func.isRequired,
    /**
     * Ventana emergente que indica si la importación/exportación al servidor ha sido correcta
     */
    serverModalOpen: PropTypes.func.isRequired,
    /**
     * Abre el catálogo de recursos subidos al servidor
     */
    onExternalCatalogToggled: PropTypes.func.isRequired,
    /**
     * Cambia la categoría de plugins seleccionada
     * */
    setcat: PropTypes.func.isRequired,
    /**
     * Adds a view
     */
    onNavItemAdded: PropTypes.func.isRequired,
    /**
   * Adds several views
   */
    onNavItemsAdded: PropTypes.func.isRequired,
    /**
   * Select view/contained view in the index context
   */
    onIndexSelected: PropTypes.func.isRequired,
    /**
   * Select view
   */
    onNavItemSelected: PropTypes.func.isRequired,
    /**
   * Objects Array that contains all created views (identified by its *id*)
   */
    navItemsIds: PropTypes.array.isRequired,
    /**
   * Object that contains all created views (identified by its *id*)
   */
    navItems: PropTypes.object.isRequired,
    /**
   * Object that contains all created containedViews (identified by its *id*)
   */
    containedViews: PropTypes.object.isRequired,
    /**
   * Contained view that is being edited
   */
    containedViewSelected: PropTypes.any,
    /**
     * Object that contains the boxes
     */
    boxes: PropTypes.object,
    /**
     * Function for creating a new box
     */
    onBoxAdded: PropTypes.func.isRequired,

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
