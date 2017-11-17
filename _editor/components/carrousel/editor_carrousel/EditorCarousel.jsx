import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CarrouselList from '../carrousel_list/CarrouselList';
import i18n from 'i18next';

/**
 * Index wrapper container
 */
export default class EditorCarousel extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
    }

    /**
     * Renders React Component
     * @returns {code}
     */
    render() {
        let displayModeClassName = "";
        let carrouselContent;
        if (this.props.displayMode === "list") {
            carrouselContent = <CarrouselList id={0}
                containedViews={this.props.containedViews}
                containedViewSelected={this.props.containedViewSelected}
                boxes={this.props.boxes}
                navItemsIds={this.props.navItemsIds}
                navItems={this.props.navItems}
                navItemSelected={this.props.navItemSelected}
                indexSelected={this.props.indexSelected}
                onBoxAdded={this.props.onBoxAdded}
                onContainedViewDeleted={this.props.onContainedViewDeleted}
                onContainedViewSelected={this.props.onContainedViewSelected}
                onContainedViewNameChanged={this.props.onContainedViewNameChanged}
                onNavItemNameChanged={this.props.onNavItemNameChanged}
                onNavItemAdded={this.props.onNavItemAdded}
                onNavItemSelected={this.props.onNavItemSelected}
                onIndexSelected={this.props.onIndexSelected}
                onNavItemExpanded={this.props.onNavItemExpanded}
                onNavItemDeleted={this.props.onNavItemDeleted}
                onNavItemReordered={this.props.onNavItemReordered}/>;
        }
        return (
            <div style={{
                minWidth: this.props.carouselShow ? (this.props.carouselFull ? '100%' : '212px') : '80px',
                maxWidth: this.props.carouselFull ? '100%' : '212px',
                overflowX: this.props.carouselFull ? 'hidden' : '',
            }} id="colLeft">
                <div className="wrapperCarousel">
                    <div style={{ textAlign: this.props.carouselShow ? 'left' : 'center' }}
                        onClick={() => {this.props.onToggleWidth();}}
                        className={this.props.carouselShow ? 'carouselListTitle toolbarSpread' : 'carouselListTitle toolbarHide'}>
                        <i style={{ fontSize: this.props.carouselShow ? "16px" : "28px" }} className="material-icons">format_list_numbered</i>
                        {!this.props.carouselShow ? <br/> : null}
                        <div className="textIndex">{i18n.t('INDEX')}</div>
                        <i style={{
                            fontSize: this.props.carouselShow ? "16px" : "32px",
                            position: this.props.carouselShow ? "absolute" : "initial",
                            right: 0,
                        }}
                        className="material-icons"
                        onClick={e => {
                            this.props.onToggleFull();
                            e.stopPropagation();
                        }}>{!this.props.carouselFull ? "keyboard_arrow_right" : "keyboard_arrow_left"}
                        </i>
                        <div className="clear" />
                    </div>
                    <div id="indice"
                        className="editorCarousel"
                        key="indice"
                        style={{ height: '100%' }}>
                        {this.props.carouselShow ? carrouselContent : <br/>}
                    </div>
                </div>
            </div>
        );
    }

}

EditorCarousel.propTypes = {
    /**
     * Diccionario que contiene todas las vistas contenidas, accesibles por su *id*
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Vista contenida seleccionada, identificada por su *id*
     */
    containedViewSelected: PropTypes.any,
    /**
     * Diccionario que contiene todas las cajas creadas, accesibles por su *id*
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Array que contiene todas las vistas creadas, identificadas por su *id*
     */
    navItemsIds: PropTypes.array.isRequired,
    /**
     * Diccionario que contiene todas las vistas creadas, accesibles por su *id*
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Vista seleccionada, identificada por su *id*
     */
    navItemSelected: PropTypes.any,
    /**
     * Vista/vista contenida seleccionada en el índice
     */
    indexSelected: PropTypes.any,
    /**
     * Añade caja
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * Borra vista contenida
     */
    onContainedViewDeleted: PropTypes.func.isRequired,
    /**
     * Selecciona vista contenida
     */
    onContainedViewSelected: PropTypes.func.isRequired,
    /**
     * Renombre vista contenida
     */
    onContainedViewNameChanged: PropTypes.func.isRequired,
    /**
     * Renombra vista
     */
    onNavItemNameChanged: PropTypes.func.isRequired,
    /**
     * Añade vista
     */
    onNavItemAdded: PropTypes.func.isRequired,
    /**
     * Selecciona vista
     */
    onNavItemSelected: PropTypes.func.isRequired,
    /**
     * Selecciona vista/vista contenida en el contexto del índice
     */
    onIndexSelected: PropTypes.func.isRequired,
    /**
     * Expande sección
     */
    onNavItemExpanded: PropTypes.func.isRequired,
    /**
     * Elimina vista/vista contenida
     */
    onNavItemDeleted: PropTypes.func.isRequired,
    /**
     * Reordena elementos del índice
     */
    onNavItemReordered: PropTypes.func.isRequired,
    /**
     * Título del curso
     */
    title: PropTypes.string.isRequired,
    /**
     * Modo de renderizar el índice (por ahora solo lista - `list`)
     */
    displayMode: PropTypes.string.isRequired,
    /**
     * Cambia modo de renderizado
     */
    onDisplayModeChanged: PropTypes.func.isRequired,
    /**
     * Indicador de si la lista de vistas contenidas está desplegada
     */
    containedViewsVisible: PropTypes.bool,
    /**
     * Despliega la lista de vistas contenidas
     */
    onContainedViewsExpand: PropTypes.func.isRequired,
    /**
     * Indicador de si el índice desplegado
     */
    carouselShow: PropTypes.bool,
    /**
     * Indicador de si el índice ocupa el ancho de la pantalla completo
     */
    carouselFull: PropTypes.bool,
    /**
     * Expande el índice para que ocupe el 100% del ancho
     */
    onToggleFull: PropTypes.func.isRequired,
    /**
     * Modifica el ancho del índice
     */
    onToggleWidth: PropTypes.func.isRequired,

};
