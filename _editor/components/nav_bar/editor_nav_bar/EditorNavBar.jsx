import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Input, Dropdown, MenuItem } from 'react-bootstrap';
import EditorIndexTitle from '../../carrousel/editor_index_title/EditorIndexTitle';
import GlobalConfig from '../global_config/GlobalConfig';
import i18n from 'i18next';
import { isSection } from '../../../../common/utils';
import Ediphy from '../../../../core/editor/main';
// import { toggleFullScreen, isFullScreenOn, fullScreenListener } from '../../../../common/common_tools';
import './_navBar.scss';
import screenfull from 'screenfull';

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
            isFullScreenOn: screenfull.isFullscreen,

        };
        /**
         * Binded function
         */
        this.checkFullScreen = this.checkFullScreen.bind(this);

    }
    /**
     * Click on plugin category callback
     */
    openPlugin(category) {
        this.props.setcat(category);
    }

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        let disablePlugins = (this.props.navItemsIds.length === 0 || (this.props.navItemSelected === 0 && this.props.containedViewSelected === 0));
        let modalTitle = "";
        let modalShow = false;
        return (
            <Col id="iconBar">
                <div className="grad1" />
                <div className="navBarSpace">
                    <EditorIndexTitle className="tituloCurso"
                        title={this.props.globalConfig.title}
                        onNameChanged={this.props.onTitleChanged}/>
                </div>

                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'text' ? 'navButtonPlug active' : 'navButtonPlug' }
                    title={i18n.t("Text")} disabled={false /* disablePlugins*/}
                    onClick={() => {this.openPlugin('text');}}><i
                        className="material-icons">text_fields</i><br/> <span
                        className="hideonresize">{i18n.t("Text")}</span></button>
                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'image' ? 'navButtonPlug active' : 'navButtonPlug' }
                    title={i18n.t("Images")} disabled={false /* disablePlugins*/}
                    onClick={() => { this.openPlugin('image');}}><i className="material-icons">image</i><br/><span
                        className="hideonresize"> {i18n.t("Images")}</span></button>
                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'multimedia' ? 'navButtonPlug active' : 'navButtonPlug' }
                    title={i18n.t("Multimedia")} disabled={false /* disablePlugins*/}
                    onClick={() => {this.openPlugin('multimedia');}}><i className="material-icons">play_circle_filled</i><br/> <span
                        className="hideonresize">{i18n.t("Multimedia")}</span></button>
                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'animations' ? ' navButtonPlug active' : 'navButtonPlug' }
                    title={i18n.t("Animations")} disabled={false /* disablePlugins*/}
                    style={{ display: 'none' }}
                    onClick={() => {this.openPlugin('animations');}}><i className="material-icons">toys</i><br/> <span
                        className="hideonresize">{i18n.t("Animations")}</span></button>
                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'exercises' ? 'navButtonPlug active' : 'navButtonPlug' }
                    title={i18n.t("Exercises")} disabled={false /* disablePlugins*/}
                    style={{ display: 'none' }}
                    onClick={() => {this.openPlugin('exercises'); }}><i className="material-icons">school</i><br/> <span
                        className="hideonresize">{i18n.t("Exercises")}</span></button>

                <Dropdown id="dropdown-menu" style={{ float: 'right' }}>
                    <Dropdown.Toggle noCaret className="navButton">
                        <i className="material-icons">more_vert</i><br/>
                        <span className="hideonresize" style={{ fontSize: '12px' }}>Menu</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu id="topMenu" className="pageMenu super-colors topMenu">
                        {(Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button) &&
                        <MenuItem disabled={this.props.undoDisabled} eventKey="6" key="6">
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
                            <button className="dropdownButton" title={i18n.t('messages.export_to_HTML')}
                                disabled={ (this.props.navItemSelected === 0) || this.props.undoDisabled}
                                onClick={() => this.props.export() }><i className="material-icons">file_download</i>
                                {i18n.t('messages.export_to_HTML')}
                            </button>
                        </MenuItem>
                        <MenuItem disabled={this.props.undoDisabled} eventKey="2" key="2">
                            <button className="dropdownButton" title={i18n.t('messages.export_to_SCORM')}
                                disabled={(this.props.navItemSelected === 0) || this.props.undoDisabled}
                                onClick={() => this.props.scorm() }><i className="material-icons">class</i>
                                {i18n.t('messages.export_to_SCORM')}
                            </button>
                        </MenuItem>
                        <MenuItem disabled={false} eventKey="3" key="3">
                            <button className="dropdownButton" title={i18n.t('messages.global_config')}
                                disabled={false}
                                onClick={() => this.setState({ showGlobalConfig: true })}><i className="material-icons">settings</i>
                                {i18n.t('messages.global_config')}
                            </button>
                        </MenuItem>
                        {Ediphy.Config.external_providers.enable_catalog_modal &&
                        <MenuItem divider key="div_4"/> &&
                        <MenuItem eventKey="4" key="4">
                            <button className="dropdownButton" title={i18n.t('Open_Catalog')}
                                onClick={() => {
                                    this.props.onExternalCatalogToggled();
                                }}><i className="material-icons">grid_on</i>
                                {i18n.t('Open_Catalog')}
                            </button>
                        </MenuItem>
                        }
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
                    </Dropdown.Menu>
                </Dropdown>

                <div className="navButtons">
                    <button className="navButton"
                        title={i18n.t("messages.fullscreen")}
                        onClick={() => {
                            /* let el = document.documentElement; //
                            if (!(window===window.parent)){
                                el = document.getElementById('mainbody');
                            }*/
                            screenfull.toggle(document.documentElement);
                        }}>
                        {this.state.isFullScreenOn ?
                            (<i className="material-icons">fullscreen_exit</i>) :
                            (<i className="material-icons">fullscreen</i>)}
                        <br/>
                        <span className="hideonresize">{i18n.t('fullscreen')}</span>
                    </button>
                    <button className="navButton"
                        title="Undo"
                        disabled={this.props.undoDisabled}
                        onClick={() => this.props.undo()}>
                        <i className="material-icons">undo</i>
                        <br/>
                        <span className="hideonresize">{i18n.t('Undone')}</span>
                    </button>
                    <button className="navButton"
                        title="Redo"
                        disabled={this.props.redoDisabled}
                        onClick={() => this.props.redo()}>
                        <i className="material-icons">redo</i>
                        <br/>
                        <span className="hideonresize">{i18n.t('Redone')}</span>
                    </button>
                    { (!Ediphy.Config.disable_save_button && (Ediphy.Config.publish_button === undefined || !Ediphy.Config.publish_button)) &&
                        <button className="navButton"
                            title={i18n.t('Save')}
                            disabled={this.props.undoDisabled }
                            onClick={() => {
                                this.props.save();
                                this.props.serverModalOpen();
                            }}>
                            <i className="material-icons">save</i>
                            <br/>
                            <span className="hideonresize">{i18n.t('Save')}</span>
                        </button>
                    }
                    { Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button && this.props.globalConfig.status === "draft" &&
                    <button className="navButton"
                        title={i18n.t('Publish')}
                        disabled={this.props.undoDisabled }
                        onClick={() => {
                            this.props.changeGlobalConfig("status", "final");
                            this.props.save();
                            this.props.serverModalOpen();
                        }}>
                        <i className="material-icons">publish</i>
                        <br/>
                        <span className="hideonresize">{i18n.t('Publish')}</span>
                    </button>
                    }
                    { Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button && this.props.globalConfig.status === "final" &&
                    <button className="navButton"
                        title={i18n.t('Unpublish')}
                        disabled={this.props.undoDisabled }
                        onClick={() => {
                            this.props.changeGlobalConfig("status", "draft");
                            this.props.save();
                            this.props.serverModalOpen();
                        }}>
                        <i className="material-icons">no_sim</i>
                        <br/>
                        <span className="hideonresize">{i18n.t('Unpublish')}</span>
                    </button>
                    }

                    <button className="navButton"
                        title={i18n.t('Preview')}
                        disabled={((this.props.navItemSelected === 0 || (this.props.navItemSelected && !Ediphy.Config.sections_have_content && isSection(this.props.navItemSelected))))}
                        onClick={() =>
                        { if (this.props.boxSelected !== 0) {
                            this.props.onTextEditorToggled(this.props.boxSelected, false);
                        }
                        this.props.visor();
                        }}><i className="material-icons">visibility</i>
                        <br/>
                        <span className="hideonresize">{i18n.t('Preview')}</span>
                    </button>
                </div>
                <GlobalConfig show={this.state.showGlobalConfig}
                    globalConfig={this.props.globalConfig}
                    changeGlobalConfig={this.props.changeGlobalConfig}
                    close={()=>{this.setState({ showGlobalConfig: false });}}/>
            </Col>
        );
    }

    /**
     * Add fullscreen listeners
     */
    componentDidMount() {
        screenfull.on('change', this.checkFullScreen);
        // fullScreenListener(this.checkFullScreen, true);

    }

    /**
     * Remove fullscreen listeners
     */
    componentWillUnmount() {
        screenfull.off('change', this.checkFullScreen);
        // fullScreenListener(this.checkFullScreen, false);

    }

    /**
     * Check if browser is in fullscreen mode and update state
     */
    checkFullScreen(e) {
        this.setState({ isFullScreenOn: screenfull.isFullscreen });
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
