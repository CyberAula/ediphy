import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import DaliCanvasSli from '../../canvas/dali_canvas_sli/DaliCanvasSli';
import DaliCanvasDoc from '../../canvas/dali_canvas_doc/DaliCanvasDoc';
import { isSlide } from '../../../../common/utils';

/**
 * Container component to render contained views
 *
 */
export default class ContainedCanvas extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         * @type {{showTitle: boolean}}
         */
        this.state = {
            showTitle: false,
        };
    }

    /**
     * Render React Component
     * @returns {*}
     */
    render() {
        let canvasContent;
        let containedViewSelected = this.props.containedViewSelected;
        if (containedViewSelected && containedViewSelected !== 0) {
            if (isSlide(containedViewSelected.type)) {
                canvasContent = (<DaliCanvasSli
                    addMarkShortcut={this.props.addMarkShortcut}
                    boxes={this.props.boxes}
                    boxSelected={this.props.boxSelected}
                    boxLevelSelected={this.props.boxLevelSelected}
                    canvasRatio={this.props.canvasRatio}
                    containedViews={this.props.containedViews}
                    containedViewSelected={this.props.containedViewSelected}
                    deleteMarkCreator={this.props.deleteMarkCreator}
                    fromCV
                    lastActionDispatched={this.props.lastActionDispatched}
                    markCreatorId={this.props.markCreatorId}
                    onBoxAdded={this.props.onBoxAdded}
                    onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                    onBoxSelected={this.props.onBoxSelected}
                    onBoxMoved={this.props.onBoxMoved}
                    onBoxResized={this.props.onBoxResized}
                    onBoxDropped={this.props.onBoxDropped}
                    onBoxDeleted={this.props.onBoxDeleted}
                    onSortableContainerReordered={this.props.onSortableContainerReordered}
                    onSortableContainerResized={this.props.onSortableContainerResized}
                    onSortableContainerDeleted={this.props.onSortableContainerDeleted}
                    onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                    onContainedViewSelected={this.props.onContainedViewSelected}
                    onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                    onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                    onTextEditorToggled={this.props.onTextEditorToggled}
                    navItems={this.props.navItems}
                    navItemSelected={this.props.navItemSelected}
                    title={this.props.title}
                    toolbars={this.props.toolbars}
                    showCanvas={this.props.showCanvas}
                />);
            } else {
                canvasContent = (<DaliCanvasDoc
                    addMarkShortcut={this.props.addMarkShortcut}
                    boxes={this.props.boxes}
                    boxSelected={this.props.boxSelected}
                    boxLevelSelected={this.props.boxLevelSelected}
                    containedViews={this.props.containedViews}
                    containedViewSelected={this.props.containedViewSelected}
                    deleteMarkCreator={this.props.deleteMarkCreator}
                    fromCV
                    lastActionDispatched={this.props.lastActionDispatched}
                    markCreatorId={this.props.markCreatorId}
                    onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                    onBoxAdded={this.props.onBoxAdded}
                    onBoxSelected={this.props.onBoxSelected}
                    onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                    onBoxMoved={this.props.onBoxMoved}
                    onBoxResized={this.props.onBoxResized}
                    onContainedViewSelected={this.props.onContainedViewSelected}
                    onSortableContainerResized={this.props.onSortableContainerResized}
                    onSortableContainerDeleted={this.props.onSortableContainerDeleted}
                    onSortableContainerReordered={this.props.onSortableContainerReordered}
                    onBoxDropped={this.props.onBoxDropped}
                    onBoxDeleted={this.props.onBoxDeleted}
                    onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                    onTextEditorToggled={this.props.onTextEditorToggled}
                    onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                    navItems={this.props.navItems}
                    navItemSelected={this.props.navItemSelected}
                    toolbars={this.props.toolbars}
                    showCanvas={this.props.showCanvas}
                    title={this.props.title}
                />);
            }
        } else {
            canvasContent = (<Col id="containedCanvas"
                md={12}
                xs={12}
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
    componentWillReceiveProps(nextProps) {
        if (nextProps.boxSelected !== -1) {
            this.setState({ showTitle: false });
        }
    }

}

ContainedCanvas.propTypes = {
    /**
     * Relación de aspecto para diapositivas
     */
    canvasRatio: PropTypes.number.isRequired,
    /**
     * Indicador de si se muestra el canvas (tiene qu haber un navItem seleccionado)
     */
    showCanvas: PropTypes.bool,
    /**
     * Diccionario que contiene todas las cajas creadas, accesibles por su *id*
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
     * Diccionario que contiene todas las vistas creadas, accesibles por su *id*
     */
    navItems: PropTypes.object.isRequired,
    /** *
     * Vista  seleccionada identificada por su *id*
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Diccionario que contiene todas las vistas contenidas, accesibles por su *id*
     */
    containedViews: PropTypes.object.isRequired,
    /** *
     * Vista contenida seleccionada identificada por su *id*
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Título del curso
     */
    title: PropTypes.string.isRequired,
    /**
     * Diccionario que contiene todas las cajas y vistas creadas , accesibles por su *id*
     */
    toolbars: PropTypes.object.isRequired,
    /**
     * Última acción realizada en Redux
     */
    lastActionDispatched: PropTypes.any.isRequired,
    /** *
     * Añade una marca a la caja
     */
    addMarkShortcut: PropTypes.func.isRequired,
    /**
     * Función que oculta el overlay de creación de marcas
     */
    deleteMarkCreator: PropTypes.func.isRequired,
    /**
     * Identificador de la caja en la que se va a crear una marca
     */
    markCreatorId: PropTypes.any.isRequired,
    /**
     * Oculta/muestra el overlay de creación de marcas
     */
    onMarkCreatorToggled: PropTypes.func.isRequired,
    /**
     * Añade una caja
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * Borra una caja
     */
    onBoxDeleted: PropTypes.func.isRequired,
    /**
     * Selecciona la caja
     */
    onBoxSelected: PropTypes.func.isRequired,
    /**
     * Aumenta el nivel de profundidad de selección (plugins dentro de plugins)
     */
    onBoxLevelIncreased: PropTypes.func.isRequired,
    /**
     * Mueve la caja
     */
    onBoxMoved: PropTypes.func.isRequired,
    /**
     * Redimensiona la caja
     */
    onBoxResized: PropTypes.func.isRequired,
    /**
     * Suelta la caja en una zona de un DaliBoxSortable
     */
    onBoxDropped: PropTypes.func.isRequired,
    /**
     * Alínea la caja verticalmente
     */
    onVerticallyAlignBox: PropTypes.func.isRequired,
    /**
     * Reordena las cajas dentro de su contenedor
     */
    onBoxesInsideSortableReorder: PropTypes.func.isRequired,
    /**
     * Borra un contenedor
     */
    onSortableContainerDeleted: PropTypes.func.isRequired,
    /**
     * Reordena los contenedores
     */
    onSortableContainerReordered: PropTypes.func.isRequired,
    /**
     * Redimensiona un contenedor
     */
    onSortableContainerResized: PropTypes.func.isRequired,
    /**
     * Selecciona una vista contenida
     */
    onContainedViewSelected: PropTypes.func.isRequired,
    /**
     * Hace aparecer/desaparecer el CKEditor
     */
    onTextEditorToggled: PropTypes.func.isRequired,
};
