import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import GlobalConfig from '../global_config/GlobalConfig';
import NavActionButtons from './NavActionButtons.jsx';
import NavDropdown from './NavDropdown.jsx';
import PluginsMenu from './PluginsMenu.jsx';
import './_navBar.scss';

/**
 * Upper navigation bar component
 */
export default class EditorNavBar extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);

        /**
         * Component's initial state
         */
        this.state = {
            showGlobalConfig: false,
        };

        /**
         * Binded function
         */
        this.toggleGlobalConfig = this.toggleGlobalConfig.bind(this);
    }

    /**
     * Render React Component
     * @returns {code}
     */
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
                    onTextEditorToggled={this.props.onTextEditorToggled}
                    redo={this.props.redo}
                    redoDisabled={this.props.redoDisabled}
                    save={this.props.save}
                    serverModalOpen={this.props.serverModalOpen}
                    undo={this.props.undo}
                    undoDisabled={this.props.undoDisabled}
                    visor={this.props.visor} />
                <NavDropdown export={this.props.export}
                    navItemSelected={this.props.navItemSelected}
                    onExternalCatalogToggled={this.props.onExternalCatalogToggled}
                    opens={this.props.opens}
                    save={this.props.save}
                    scorm={this.props.scorm}
                    serverModalOpen={this.props.serverModalOpen}
                    toggleGlobalConfig={this.toggleGlobalConfig}
                    undoDisabled={this.props.undoDisabled} />
                <GlobalConfig show={this.state.showGlobalConfig}
                    globalConfig={this.props.globalConfig}
                    changeGlobalConfig={this.props.changeGlobalConfig}
                    close={this.toggleGlobalConfig} />
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
     * Array que contiene todas las vistas identificables por su *id*
     */
    navItemsIds: PropTypes.array,
    /**
     * Diccionario que contiene todas las vistas identificables por su *id*
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Modifica el título del curso
     */
    onTitleChanged: PropTypes.func.isRequired,
    /**
     * Identifica la vista contenida que se está editando
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Identifica la vista contenida que se está editando
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Caja seleccionada
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Cierra la edición de texto en curso
     */
    onTextEditorToggled: PropTypes.func.isRequired,
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
