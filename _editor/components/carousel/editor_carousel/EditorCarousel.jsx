import PropTypes from 'prop-types';
import React, { Component } from 'react';

import CarouselButtons from '../carousel_buttons/CarouselButtons';
import CarouselHeader from '../carousel_header/CarouselHeader';
import CarouselList from '../carousel_list/CarouselList';

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
        return (
            <div id="colLeft" className="wrapperCarousel"
                style={{
                    maxWidth: this.props.carouselShow ? (this.props.carouselFull ? '100%' : '212px') : '80px',
                    overflowX: this.props.carouselFull ? 'hidden' : '',
                }}>
                <CarouselHeader carouselFull={this.props.carouselFull}
                    carouselShow={this.props.carouselShow}
                    courseTitle={this.props.globalConfig.title}
                    onTitleChanged={this.props.onTitleChanged}
                    onToggleFull={this.props.onToggleFull}
                    onToggleWidth={this.props.onToggleWidth} />
                <CarouselList id={0}
                    carouselShow={this.props.carouselShow}
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
                    onNavItemReordered={this.props.onNavItemReordered}/>
                <CarouselButtons boxes={this.props.boxes}
                    containedViews={this.props.containedViews}
                    indexSelected={this.props.indexSelected}
                    navItems={this.props.navItems}
                    navItemsIds={this.props.navItemsIds}
                    onNavItemAdded={this.props.onNavItemAdded}
                    onBoxAdded={this.props.onBoxAdded}
                    onIndexSelected={this.props.onIndexSelected}
                    onContainedViewDeleted={this.props.onContainedViewDeleted}
                    onNavItemDeleted={this.props.onNavItemDeleted} />
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
     * Modifies the course's title
     */
    onTitleChanged: PropTypes.func.isRequired,
    /**
     * Título del curso
     */
    title: PropTypes.string.isRequired,
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
    /**
      * Configuración global
      */
    globalConfig: PropTypes.object,

};
