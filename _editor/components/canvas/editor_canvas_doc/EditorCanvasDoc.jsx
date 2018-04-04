import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorBox from '../editor_box/EditorBox';
import EditorBoxSortable from '../editor_box_sortable/EditorBoxSortable';
import EditorShortcuts from '../editor_shortcuts/EditorShortcuts';
import { Col } from 'react-bootstrap';
import EditorHeader from '../editor_header/EditorHeader';
import Ediphy from '../../../../core/editor/main';
import { isSortableBox } from '../../../../common/utils';

export default class EditorCanvasDoc extends Component {
    render() {
        let titles = [];
        let itemSelected = this.props.fromCV ? this.props.containedViewSelected : this.props.navItemSelected;
        if (itemSelected.id !== 0) {
            let initialTitle = this.props.viewToolbars[itemSelected.id].viewName;
            titles.push(initialTitle);
            if (!this.props.fromCV) {
                let parent = itemSelected.parent;
                while (parent !== 0) {
                    titles.push(this.props.viewToolbars[parent].viewName);
                    parent = this.props.navItems[parent].parent;
                }
            }
            titles.reverse();
        }

        let maincontent = document.getElementById(this.props.fromCV ? "contained_maincontent" : "maincontent");
        let actualHeight;
        if (maincontent) {
            actualHeight = parseInt(maincontent.scrollHeight, 10);
            actualHeight = (parseInt(maincontent.clientHeight, 10) < actualHeight) ? (actualHeight) + 'px' : '100%';
        }

        let overlayHeight = actualHeight ? actualHeight : '100%';
        let boxes = itemSelected ? itemSelected.boxes : [];
        let show = itemSelected && itemSelected.id !== 0;

        let commonProps = {
            addMarkShortcut: this.props.addMarkShortcut,
            accordions: this.props.accordions,
            marks: this.props.marks,
            background: itemSelected.background,
            setCorrectAnswer: this.props.setCorrectAnswer,
            boxes: this.props.boxes,
            boxSelected: this.props.boxSelected,
            boxLevelSelected: this.props.boxLevelSelected,
            containedViews: this.props.containedViews,
            containedViewSelected: this.props.containedViewSelected,
            pluginToolbars: this.props.pluginToolbars,
            lastActionDispatched: this.props.lastActionDispatched,
            deleteMarkCreator: this.props.deleteMarkCreator,
            onRichMarkMoved: this.props.onRichMarkMoved,
            markCreatorId: this.props.markCreatorId,
            onBoxAdded: this.props.onBoxAdded,
            onBoxSelected: this.props.onBoxSelected,
            onBoxLevelIncreased: this.props.onBoxLevelIncreased,
            onBoxMoved: this.props.onBoxMoved,
            onBoxResized: this.props.onBoxResized,
            onBoxesInsideSortableReorder: this.props.onBoxesInsideSortableReorder,
            onSortableContainerResized: this.props.onSortableContainerResized,
            onSortableContainerDeleted: this.props.onSortableContainerDeleted,
            onSortableContainerReordered: this.props.onSortableContainerReordered,
            onRichMarksModalToggled: this.props.onRichMarksModalToggled,
            onBoxDropped: this.props.onBoxDropped,
            onVerticallyAlignBox: this.props.onVerticallyAlignBox,
            onTextEditorToggled: this.props.onTextEditorToggled,
            pageType: itemSelected.type || 0,
        };

        return (
            <Col id={this.props.fromCV ? 'containedCanvas' : 'canvas'} md={12} xs={12} className="canvasDocClass"
                style={{ display: this.props.containedViewSelected !== 0 && !this.props.fromCV ? 'none' : 'initial' }}>

                <div className="scrollcontainer"
                    style={{ backgroundColor: show ? itemSelected.background : 'transparent', display: show ? 'block' : 'none' }}
                    onMouseDown={e => {
                        if (e.target == e.currentTarget) {
                            this.props.onBoxSelected(-1);
                            this.setState({ showTitle: false });
                        }
                        e.stopPropagation();
                    }}>
                    { /* {this.props.boxSelected} - ({(this.props.boxSelected && this.props.boxes[this.props.boxSelected]) ? this.props.boxes[this.props.boxSelected].level : '-'}) - {this.props.boxLevelSelected} */ }
                    <EditorHeader titles={titles}
                        onBoxSelected={this.props.onBoxSelected}
                        courseTitle={this.props.title}
                        navItem={this.props.navItemSelected}
                        navItems={this.props.navItems}
                        containedView={this.props.containedViewSelected}
                        containedViews={this.props.containedViews}
                        viewToolbars={this.props.viewToolbars}
                        boxes={this.props.boxes}
                        onViewTitleChanged={this.props.onViewTitleChanged}
                        onTitleChanged={this.props.onTitleChanged}
                    />
                    <div className="outter canvaseditor" style={{ background: itemSelected.background, display: show ? 'block' : 'none' }}>
                        <div id={this.props.fromCV ? 'airlayer_cv' : 'airlayer'}
                            className={'doc_air'}
                            style={{ background: itemSelected.background, visibility: (show ? 'visible' : 'hidden') }}>

                            <div id={this.props.fromCV ? "contained_maincontent" : "maincontent"}
                                className={'innercanvas doc'}
                                style={{ background: itemSelected.background, visibility: (show ? 'visible' : 'hidden'), paddingBottom: '10px' }}>

                                <br/>

                                {boxes.map(id => {
                                    let box = boxes[id];
                                    if (!isSortableBox(id)) {
                                        return null;
                                        // return <EditorBox key={id} id={id} {...commonProps} exercises={itemSelected ? (this.props.exercises[itemSelected.id].exercises[id]) : undefined} />;
                                    }
                                    return <EditorBoxSortable key={id} {...commonProps}
                                        id={id} exercises={this.props.exercises} page={itemSelected ? itemSelected.id : 0} />;

                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <EditorShortcuts
                    openConfigModal={this.props.openConfigModal}
                    accordions={this.props.accordions}
                    box={this.props.boxes[this.props.boxSelected]}
                    containedViewSelected={this.props.containedViewSelected}
                    isContained={this.props.fromCV}
                    onTextEditorToggled={this.props.onTextEditorToggled}
                    onBoxResized={this.props.onBoxResized}
                    onBoxDeleted={this.props.onBoxDeleted}
                    navItemSelected={this.props.navItemSelected}
                    lastActionDispatched={this.props.lastActionDispatched}
                    pointerEventsCallback={this.props.pluginToolbars[this.props.boxSelected] && this.props.pluginToolbars[this.props.boxSelected].config && this.props.pluginToolbars[this.props.boxSelected].config.name && Ediphy.Plugins.get(this.props.pluginToolbars[this.props.boxSelected].config.name) ? Ediphy.Plugins.get(this.props.pluginToolbars[this.props.boxSelected].config.name).pointerEventsCallback : null}
                    onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                    pluginToolbar={this.props.pluginToolbars[this.props.boxSelected]}/>
            </Col>
        );
    }
}

EditorCanvasDoc.propTypes = {
    /**
     * Si se renderiza el componente desde una vista contenida (true) o una normal (false)
     */
    fromCV: PropTypes.bool,
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
     * Suelta la caja en una zona de un EditorBoxSortable
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
     * Hace aparecer/desaparecer el CKEditor
     */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
   * Hace aparecer/desaparecer el modal de configuración de marcas
   */
    onRichMarksModalToggled: PropTypes.func.isRequired,
    /**
   * Actualiza marca
   */
    onRichMarkUpdated: PropTypes.func.isRequired,
    /**
     * Cambia el texto del título del curso
     */
    onTitleChanged: PropTypes.func.isRequired,
    /**
   * Object containing all exercises
   */
    exercises: PropTypes.object,
    /**
   * Function for setting the right answer of an exercise
   */
    setCorrectAnswer: PropTypes.func.isRequired,

};
