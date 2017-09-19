import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DaliCanvasSli from '../dali_canvas_sli/DaliCanvasSli';
import DaliCanvasDoc from '../dali_canvas_doc/DaliCanvasDoc';
import { REORDER_SORTABLE_CONTAINER, REORDER_BOXES } from '../../../../common/actions';
import { isSlide } from '../../../../common/utils';

import './_canvas.scss';

/**
 * Container component to render documents or slides
 *
 */
export default class DaliCanvas extends Component {
    /**
     * Constructor
     * @param props React component props
     */
    constructor(props) {
        super(props);
    }

    /**
     * Renders React Component
     * @returns {code} React rendered component
     */
    render() {
        let canvasContent;
        if (isSlide(this.props.navItemSelected.type)) {
            canvasContent = <DaliCanvasSli
                addMarkShortcut={this.props.addMarkShortcut}
                boxes={this.props.boxes}
                boxSelected={this.props.boxSelected}
                boxLevelSelected={this.props.boxLevelSelected}
                canvasRatio={this.props.canvasRatio}
                containedViews={this.props.containedViews}
                containedViewSelected={this.props.containedViewSelected}
                deleteMarkCreator={this.props.deleteMarkCreator}
                fromCV={false}
                lastActionDispatched={this.props.lastActionDispatched}
                markCreatorId={this.props.markCreatorId}
                onBoxAdded={this.props.onBoxAdded}
                onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                onBoxSelected={this.props.onBoxSelected}
                onBoxMoved={this.props.onBoxMoved}
                onBoxResized={this.props.onBoxResized}
                onBoxDropped={this.props.onBoxDropped}
                onBoxDeleted={this.props.onBoxDeleted}
                onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                onTextEditorToggled={this.props.onTextEditorToggled}
                onContainedViewSelected={this.props.onContainedViewSelected}
                onSortableContainerDeleted={this.props.onSortableContainerDeleted}
                onSortableContainerResized={this.props.onSortableContainerResized}
                onSortableContainerReordered={this.props.onSortableContainerReordered}
                onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                navItems={this.props.navItems}
                navItemSelected={this.props.navItemSelected}
                title={this.props.title}
                titleModeToggled={this.props.titleModeToggled}
                toolbars={this.props.toolbars}
                showCanvas={this.props.showCanvas}
            />;
        }else{
            canvasContent = <DaliCanvasDoc
                addMarkShortcut={this.props.addMarkShortcut}
                boxes={this.props.boxes}
                boxSelected={this.props.boxSelected}
                boxLevelSelected={this.props.boxLevelSelected}
                containedViews={this.props.containedViews}
                containedViewSelected={this.props.containedViewSelected}
                deleteMarkCreator={this.props.deleteMarkCreator}
                fromCV={false}
                lastActionDispatched={this.props.lastActionDispatched}
                markCreatorId={this.props.markCreatorId}
                onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                onBoxAdded={this.props.onBoxAdded}
                onBoxSelected={this.props.onBoxSelected}
                onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                onBoxMoved={this.props.onBoxMoved}
                onBoxResized={this.props.onBoxResized}
                onSortableContainerResized={this.props.onSortableContainerResized}
                onSortableContainerDeleted={this.props.onSortableContainerDeleted}
                onSortableContainerReordered={this.props.onSortableContainerReordered}
                onContainedViewSelected={this.props.onContainedViewSelected}
                onBoxDropped={this.props.onBoxDropped}
                onBoxDeleted={this.props.onBoxDeleted}
                onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                onTextEditorToggled={this.props.onTextEditorToggled}
                onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                navItems={this.props.navItems}
                navItemSelected={this.props.navItemSelected}
                toolbars={this.props.toolbars}
                showCanvas={this.props.showCanvas}
                titleModeToggled={this.props.titleModeToggled}
                title={this.props.title}
            />;
        }

        return (
            canvasContent
        );
    }

    /**
     * Before component receives props
     * Scrolls to top when the user changes to a different page
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.navItemSelected.id !== nextProps.navItemSelected.id) {
            document.getElementById('maincontent').scrollTop = 0;
        }
    }

    /**
     * After component updates
     * Fixes bug when reordering dalibox sortable CKEDITOR doesn't update otherwise
     * @param prevProps React previous props
     * @param prevState React previous state
     */
    componentDidUpdate(prevProps, prevState) {
        if(this.props.lastActionDispatched.type === REORDER_SORTABLE_CONTAINER || this.props.lastActionDispatched.type === REORDER_BOXES) {
            for (let instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].destroy();
            }
            CKEDITOR.inlineAll();
            for (let editor in CKEDITOR.instances) {
                if (this.props.toolbars[editor].state.__text) {
                    CKEDITOR.instances[editor].setData(decodeURI(this.props.toolbars[editor].state.__text));
                }
            }
        }
    }

}

DaliCanvas.propTypes = {
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
    /**
     * Vista  seleccionada identificada por su *id*
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Diccionario que contiene todas las vistas contenidas, accesibles por su *id*
     */
    containedViews: PropTypes.object.isRequired,
    /**
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
    /**
     * Añade una marca a la caja
     */
    addMarkShortcut: PropTypes.func.isRequired,
    /**
     * TODO
     */
    deleteMarkCreator: PropTypes.func.isRequired,
    /**
     * TODO
     */
    onMarkCreatorToggled: PropTypes.func.isRequired,
    /**
     * TODO
     */
    markCreatorId: PropTypes.any.isRequired,
    /**
     * TODO
     */
    titleModeToggled: PropTypes.func.isRequired,
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
