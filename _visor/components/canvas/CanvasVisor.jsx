import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CanvasVisorDoc from './CanvasVisorDoc';
import CanvasVisorSli from './CanvasVisorSli';
import { isSlide } from '../../../common/utils';

export default class CanvasVisor extends Component {

    render() {
        let visorContent;
        if (isSlide(this.props.navItems[this.props.currentView].type)) {
            visorContent = <CanvasVisorSli
                boxes={this.props.boxes}
                boxLevelSelected={this.props.boxLevelSelected}
                boxSelected={this.props.boxSelected}
                canvasRatio={this.props.canvasRatio}
                changeCurrentView={this.props.changeCurrentView}
                containedViews={this.props.containedViews}
                currentView={this.props.currentView}
                navItems={this.props.navItems}
                removeLastView={this.props.removeLastView}
                richElementsState={this.props.richElementsState}
                showCanvas={this.props.showCanvas}
                title={this.props.title}
                toolbars={this.props.toolbars}
                triggeredMarks={this.props.triggeredMarks}
                viewsArray={this.props.viewsArray}/>;
        }else{
            visorContent = <CanvasVisorDoc
                boxes={this.props.boxes}
                boxLevelSelected={this.props.boxLevelSelected}
                boxSelected={this.props.boxSelected}
                containedViews={this.props.containedViews}
                changeCurrentView={this.props.changeCurrentView}
                currentView={this.props.currentView}
                navItems={this.props.navItems}
                removeLastView={this.props.removeLastView}
                richElementsState={this.props.richElementsState}
                showCanvas={this.props.showCanvas}
                toolbars={this.props.toolbars}
                title={this.props.title}
                triggeredMarks={this.props.triggeredMarks}
                viewsArray={this.props.viewsArray}/>;
        }

        return (
            visorContent
        );
    }

    componentDidUpdate() {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    }

}

CanvasVisor.propTypes = {
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
