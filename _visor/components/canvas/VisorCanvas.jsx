import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisorCanvasDoc from './VisorCanvasDoc';
import VisorCanvasSli from './VisorCanvasSli';
import { isSlide } from '../../../common/utils';

export default class VisorCanvas extends Component {

    render() {
        return (isSlide(this.props.navItems[this.props.currentView].type)) ?
            (<VisorCanvasSli {...this.props} />) :
            (<VisorCanvasDoc {...this.props} />);

    }

    componentDidUpdate() {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    }

}

VisorCanvas.propTypes = {
    /**
     * Diccionario que contiene todas las cajas
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Relación de aspecto para las diapositivas
     */
    canvasRatio: PropTypes.number.isRequired,
    /**
     * Cambia la vista actual
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
     * Diccionario que contiene todas las vistas contenidas, accesibles por su *id*
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Vista actual
     */
    currentView: PropTypes.any,
    /**
     * Diccionario que contiene todas las vistas creadas, accesibles por su *id*
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Elimina la última vista
     */
    removeLastView: PropTypes.func.isRequired,
    /**
     * Estado del plugin enriquecido en la transición
     */
    richElementsState: PropTypes.object,
    /**
     * Indicador de si se muestra el canvas (tiene que haber un navItem seleccionado)
     */
    showCanvas: PropTypes.bool,
    /**
     * Título del curso
     */
    title: PropTypes.any,
    /**
     * Diccionario que contiene todas las toolbars
     */
    toolbars: PropTypes.object,
    /**
     * Lista de marcas en curso o lanzadas
     */
    triggeredMarks: PropTypes.array,
    /**
     *  Array de vistas
     */
    viewsArray: PropTypes.array,
};
