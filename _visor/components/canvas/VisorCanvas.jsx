import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisorCanvasDoc from './VisorCanvasDoc';
import VisorCanvasSli from './VisorCanvasSli';
import Watermark from './Watermark';
import { isSlide } from '../../../common/utils';

export default class VisorCanvas extends Component {

    render() {
        return [(isSlide(this.props.navItems[this.props.currentView].type)) ?
            (<VisorCanvasSli key="0" {...this.props} />) :
            (<VisorCanvasDoc key="0" {...this.props} />),
        <Watermark ediphy_document_id={this.props.ediphy_document_id} ediphy_platform={this.props.ediphy_platform} key={"1"}/>];

    }

    componentDidUpdate() {
        if (window.MathJax) {
            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
        }

    }

}

VisorCanvas.propTypes = {
    /**
   * Show the current view
   */
    show: PropTypes.bool,
    /**
     * Object containing all created boxes (by id)
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
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Vista actual
     */
    currentView: PropTypes.any,
    /**
     * Object containing all views (by id)
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
    /**
   * Ediphy Document id
   */
    ediphy_document_id: PropTypes.any,
    /**
   * Platform where excursion is hosted
   */
    ediphy_platform: PropTypes.any,
};
