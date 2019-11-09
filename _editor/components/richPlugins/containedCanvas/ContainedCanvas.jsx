import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import EditorCanvasSli from '../../canvas/editorCanvasSli/EditorCanvasSli';
import EditorCanvasDoc from '../../canvas/editorCanvasDoc/EditorCanvasDoc';
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
        const containedViewSelected = this.props.containedViewsById[this.props.containedViewSelected];
        let canvasContent;
        if (containedViewSelected && this.props.containedViewSelected !== 0) {
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
                    display: this.props.containedViewSelected !== 0 ? 'initial' : 'none',
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
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.boxSelected !== -1) {
            this.setState({ showTitle: false });
        }
    }

}

function mapStateToProps(state) {
    const { boxesById, boxLevelSelected, boxSelected, containedViewsById, containedViewSelected, exercises, globalConfig, lastActionDispatched,
        marksById, navItemsById, navItemSelected, pluginToolbarsById, viewToolbarsById } = state.undoGroup.present;
    const { grid, markCreatorVisible, fileModalResult } = state.reactUI;
    return{
        aspectRatio: globalConfig.canvasRatio,
        boxesById,
        boxLevelSelected,
        boxSelected,
        containedViewsById,
        containedViewSelected,
        exercises,
        fileModalResult,
        globalConfig,
        grid,
        lastActionDispatched,
        markCreatorVisible,
        marksById,
        navItemsById,
        navItemSelected,
        pluginToolbarsById,
        viewToolbarsById,
    };
}
export default connect(mapStateToProps)(ContainedCanvas);

ContainedCanvas.propTypes = {
    /**
     * Object containing all created boxes (by id)
     */
    boxesById: PropTypes.object.isRequired,
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
    navItemsById: PropTypes.object.isRequired,
    /** *
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViewsById: PropTypes.object.isRequired,
    /** *
     * Selected contained view
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Título del curso
     */
    title: PropTypes.string,
    /**
     * Diccionario que contiene todas las istas creadas , accesibles por su *id*
     */
    viewToolbarsById: PropTypes.object.isRequired,
    /**
     * Diccionario que contiene todos los valores de cajas, accesibles por su *id*
     */
    pluginToolbarsById: PropTypes.object.isRequired,
    /**
     * Última acción realizada en Redux
     */
    lastActionDispatched: PropTypes.any.isRequired,
    /**
     * Identificador de la caja en la que se va a crear una marca
     */
    markCreatorVisible: PropTypes.any.isRequired,
    /**
     * Whether or not the grid is activated for slides
     */
    grid: PropTypes.bool,
};
