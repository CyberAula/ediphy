import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isSlide } from '../../../common/utils';
import VisorCanvasDoc from './VisorCanvasDoc';
import VisorCanvasSli from './VisorCanvasSli';
import { CSSTransition } from 'react-transition-group';

export default class VisorContainedCanvas extends Component {
    componentDidMount() {

    }
    render() {
        let visorContent;
        if (isSlide(this.props.containedViews[this.props.currentView].type)) {
            visorContent = <VisorCanvasSli {...this.props} />;
        }else{
            visorContent = <VisorCanvasDoc {...this.props} />;
        }
        return (
            <CSSTransition
                key="anim"
                classNames={{
                    appear: 'appear',
                    appearActive: 'active-appear',
                    enter: 'enter',
                    enterActive: 'active-enter',
                    exit: 'exit',
                    exitActive: 'active-exit',
                }}
                timeout={{ enter: 500, exit: 300 }}>
                {visorContent}
            </CSSTransition>
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.boxSelected !== -1) {
            this.setState({ showTitle: false });
        }
        document.getElementById('contained_maincontent').scrollTop = 0;

    }

    componentDidUpdate() {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    }
}

VisorContainedCanvas.propTypes = {
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
