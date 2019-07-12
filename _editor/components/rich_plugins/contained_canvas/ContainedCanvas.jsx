import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import EditorCanvasSli from '../../canvas/editor_canvas_sli/EditorCanvasSli';
import EditorCanvasDoc from '../../canvas/editor_canvas_doc/EditorCanvasDoc';
import { isSlide } from '../../../../common/utils';

import { connect } from "react-redux";

/**
 * ContainerJS component to render contained views
 *
 */
class ContainedCanvas extends Component {

    state = { showTitle: false };

    /**
     * Render React Component
     * @returns {*}
     */
    render() {
        const containedViewSelected = this.props.containedViewSelected;

        let canvasContent;
        if (containedViewSelected && containedViewSelected !== 0) {
            if (isSlide(containedViewSelected.type)) {
                canvasContent = (<EditorCanvasSli fromCV {...this.props} />);
            } else {
                canvasContent = (<EditorCanvasDoc fromCV {...this.props} />);
            }
        } else {
            canvasContent = (<Col id="containedCanvas" md={12} xs={12}
                style={{
                    height: "100%",
                    padding: 0,
                    display: containedViewSelected !== 0 ? 'initial' : 'none',
                }} />);

        }
        return (
            canvasContent
        );
    }

    /**
     * Before component receives props
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.boxSelected !== -1) {
            this.setState({ showTitle: false });
        }
    }

}

function mapStateToProps(state) {
    return{
        title: state.undoGroup.present.globalConfig.title || '---',
        boxes: state.undoGroup.present.boxesById,
        grid: state.reactUI.grid,
        boxSelected: state.undoGroup.present.boxSelected,
        boxLevelSelected: state.undoGroup.present.boxLevelSelected,
        lastActionDispatched: state.undoGroup.present.lastActionDispatched,
        marks: state.undoGroup.present.marksById,
        navItems: state.undoGroup.present.navItemsById,
        navItemSelected: state.undoGroup.present.navItemsById[state.undoGroup.present.navItemSelected],
        containedViews: state.undoGroup.present.containedViewsById,
        containedViewSelected: state.undoGroup.present.containedViewsById[state.undoGroup.present.containedViewSelected] || 0,
        showCanvas: state.undoGroup.present.navItemSelected !== 0,
        pluginToolbars: state.undoGroup.present.pluginToolbarsById,
        viewToolbars: state.undoGroup.present.viewToolbarsById,
        aspectRatio: state.undoGroup.present.globalConfig.canvasRatio,
        markCreatorId: state.reactUI.markCreatorVisible,
        exercises: state.undoGroup.present.exercises,
        fileModalResult: state.reactUI.fileModalResult,
    };
}

export default connect(mapStateToProps)(ContainedCanvas);

ContainedCanvas.propTypes = {
    /**
     * Indicador de si se muestra el canvas (tiene qu haber un navItem seleccionado)
     */
    showCanvas: PropTypes.bool,
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Caja seleccionada en el momento. Si no hay ninguna, -1
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Nivel de profundidad de caja seleccionada (sólo para plugins dentro de plugins)
     */
    boxLevelSelected: PropTypes.number.isRequired,
    /**
     * Object containing all views (by id)
     */
    navItems: PropTypes.object.isRequired,
    /** *
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /** *
     * Selected contained view
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Título del curso
     */
    title: PropTypes.string.isRequired,
    /**
     * Diccionario que contiene todas las istas creadas , accesibles por su *id*
     */
    viewToolbars: PropTypes.object.isRequired,
    /**
     * Diccionario que contiene todos los valores de cajas, accesibles por su *id*
     */
    pluginToolbars: PropTypes.object.isRequired,
    /**
     * Última acción realizada en Redux
     */
    lastActionDispatched: PropTypes.any.isRequired,
    /**
     * Identificador de la caja en la que se va a crear una marca
     */
    markCreatorId: PropTypes.any.isRequired,
    /**
     *  Callback for selecting contained view
     */
    onContainedViewSelected: PropTypes.func.isRequired,
    /**
     * Whether or not the grid is activated for slides
     */
    grid: PropTypes.bool,
};
