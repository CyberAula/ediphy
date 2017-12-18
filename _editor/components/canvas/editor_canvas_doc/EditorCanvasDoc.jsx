import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorBox from '../editor_box/EditorBox';
import EditorBoxSortable from '../editor_box_sortable/EditorBoxSortable';
import EditorShortcuts from '../editor_shortcuts/EditorShortcuts';
import { Col } from 'react-bootstrap';
import EditorHeader from '../editor_header/EditorHeader';
import Ediphy from '../../../../core/editor/main';
import { isSortableBox } from '../../../../common/utils';

/**
 * EditorCanvasDoc component
 * Canvas component to display documents
 */
export default class EditorCanvasDoc extends Component {
    /**
     * Renders React Component
     * @returns {code}
     */
    render() {
        let titles = [];
        let itemSelected = this.props.fromCV ? this.props.containedViewSelected : this.props.navItemSelected;
        if (itemSelected.id !== 0) {
            titles.push(itemSelected.name);
            if (!this.props.fromCV) {
                let parent = itemSelected.parent;
                while (parent !== 0) {
                    titles.push(this.props.navItems[parent].name);
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
        /* let isSection = this.props.navItemSelected.id.toString().indexOf('se') !== -1;
        let contentAllowedInSections = Ediphy.Config.sections_have_content;
        let showCanvas = (!isSection || (isSection && contentAllowedInSections));*/
        let boxes = itemSelected ? itemSelected.boxes : [];
        let show = itemSelected && itemSelected.id !== 0;
        return (
            <Col id={this.props.fromCV ? 'containedCanvas' : 'canvas'} md={12} xs={12} className="canvasDocClass"
                style={{ display: this.props.containedViewSelected !== 0 && !this.props.fromCV ? 'none' : 'initial' }}>

                <div className="scrollcontainer"
                    style={{ backgroundColor: show ? itemSelected.background : 'transparent', display: show ? 'block' : 'none' }}
                    onClick={e => {
                        this.props.onBoxSelected(-1);
                        this.setState({ showTitle: false });
                        e.stopPropagation();
                    }}>
                    <EditorHeader titles={titles}
                        onBoxSelected={this.props.onBoxSelected}
                        courseTitle={this.props.title}
                        navItem={this.props.navItemSelected}
                        navItems={this.props.navItems}
                        containedView={this.props.containedViewSelected}
                        containedViews={this.props.containedViews}
                        toolbars={this.props.toolbars}
                        boxes={this.props.boxes}
                    />
                    <div className="outter canvaseditor" style={{ background: itemSelected.background, display: show ? 'block' : 'none' }}>
                        {/*
                    {this.props.fromCV ?  (<button className="btnOverBar cvBackButton" style={{margin: "10px 0px 0px 10px"}}
                             onClick={e => {
                                 this.props.onContainedViewSelected(0);
                                 e.stopPropagation();
                             }}><i className="material-icons">undo</i></button>):(<br/>)}
                     */}

                        <div id={this.props.fromCV ? 'airlayer_cv' : 'airlayer'}
                            className={'doc_air'}
                            style={{ background: itemSelected.background, visibility: (show ? 'visible' : 'hidden') }}>

                            <div id={this.props.fromCV ? "contained_maincontent" : "maincontent"}
                                className={'innercanvas doc'}
                                style={{ background: itemSelected.background, visibility: (show ? 'visible' : 'hidden') }}>

                                <br/>

                                <div id={this.props.fromCV ? "contained_canvas_boxes" : "canvas_boxes"}
                                    style={{
                                        width: "100%",
                                        background: "black",
                                        height: overlayHeight,
                                        position: "absolute",
                                        top: 0,
                                        opacity: 0.4,
                                        display: (this.props.boxLevelSelected > 0) ? "block" : "none",
                                        visibility: (this.props.boxLevelSelected > 0) ? "visible" : "collapse",
                                    }} />

                                {boxes.map(id => {
                                    let box = boxes[id];
                                    if (!isSortableBox(id)) {
                                        return <EditorBox key={id}
                                            id={id}
                                            addMarkShortcut={this.props.addMarkShortcut}
                                            boxes={this.props.boxes}
                                            boxSelected={this.props.boxSelected}
                                            boxLevelSelected={this.props.boxLevelSelected}
                                            containedViews={this.props.containedViews}
                                            containedViewSelected={this.props.containedViewSelected}
                                            deleteMarkCreator={this.props.deleteMarkCreator}
                                            lastActionDispatched={this.props.lastActionDispatched}
                                            markCreatorId={this.props.markCreatorId}
                                            onBoxAdded={this.props.onBoxAdded}
                                            onBoxSelected={this.props.onBoxSelected}
                                            onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                            onBoxMoved={this.props.onBoxMoved}
                                            onBoxResized={this.props.onBoxResized}
                                            onSortableContainerResized={this.props.onSortableContainerResized}
                                            onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                            onBoxDropped={this.props.onBoxDropped}
                                            onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                            onTextEditorToggled={this.props.onTextEditorToggled}
                                            toolbars={this.props.toolbars}
                                            onRichMarksModalToggled={this.props.onRichMarksModalToggled}
                                            pageType={itemSelected.type || 0}/>;
                                    }
                                    return <EditorBoxSortable key={id}
                                        id={id}
                                        addMarkShortcut={this.props.addMarkShortcut}
                                        background={itemSelected.background}
                                        boxes={this.props.boxes}
                                        boxSelected={this.props.boxSelected}
                                        boxLevelSelected={this.props.boxLevelSelected}
                                        containedViews={this.props.containedViews}
                                        containedViewSelected={this.props.containedViewSelected}
                                        toolbars={this.props.toolbars}
                                        lastActionDispatched={this.props.lastActionDispatched}
                                        deleteMarkCreator={this.props.deleteMarkCreator}
                                        markCreatorId={this.props.markCreatorId}
                                        onBoxAdded={this.props.onBoxAdded}
                                        onBoxSelected={this.props.onBoxSelected}
                                        onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                        onBoxMoved={this.props.onBoxMoved}
                                        onBoxResized={this.props.onBoxResized}
                                        onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                        onSortableContainerResized={this.props.onSortableContainerResized}
                                        onSortableContainerDeleted={this.props.onSortableContainerDeleted}
                                        onSortableContainerReordered={this.props.onSortableContainerReordered}
                                        onRichMarksModalToggled={this.props.onRichMarksModalToggled}
                                        onBoxDropped={this.props.onBoxDropped}
                                        onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                        onTextEditorToggled={this.props.onTextEditorToggled}
                                        pageType={itemSelected.type || 0}/>;

                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <EditorShortcuts
                    box={this.props.boxes[this.props.boxSelected]}
                    containedViewSelected={this.props.containedViewSelected}
                    isContained={this.props.fromCV}
                    onTextEditorToggled={this.props.onTextEditorToggled}
                    onBoxResized={this.props.onBoxResized}
                    onBoxDeleted={this.props.onBoxDeleted}
                    lastActionDispatched={this.props.lastActionDispatched}
                    pointerEventsCallback={this.props.toolbars[this.props.boxSelected] && this.props.toolbars[this.props.boxSelected].config && this.props.toolbars[this.props.boxSelected].config.name && Ediphy.Plugins.get(this.props.toolbars[this.props.boxSelected].config.name) ? Ediphy.Plugins.get(this.props.toolbars[this.props.boxSelected].config.name).pointerEventsCallback : null}
                    onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                    toolbar={this.props.toolbars[this.props.boxSelected]}/>
            </Col>
        );
    }
/*
    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this)).unset();
    }

    componentDidMount() {

        interact(ReactDOM.findDOMNode(this)).dropzone({
            accept: '.floatingEditorBox',
            overlap: 'pointer',
            ondropactivate: function (event) {
                event.target.classList.add('drop-active');
            },
            ondragenter: function (event) {
                event.target.classList.add("drop-target");
            },
            ondragleave: function (event) {
                event.target.classList.remove("drop-target");
            },
            ondrop: function (event) {
                let position = {
                    x: (event.dragEvent.clientX - event.target.getBoundingClientRect().left - document.getElementById('maincontent').offsetLeft)*100/event.target.parentElement.offsetWidth + "%",
                    y: (event.dragEvent.clientY - event.target.getBoundingClientRect().top + document.getElementById('maincontent').scrollTop) + 'px',
                    type: 'absolute'
                };
                let initialParams = {
                    parent: this.props.fromCV ? this.props.containedViewSelected.id:this.props.navItemSelected.id,
                    container: 0,
                    position: position
                };
                Ediphy.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams, ADD_BOX);
                event.dragEvent.stopPropagation();
            }.bind(this),
            ondropdeactivate: function (event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            }
        });
    }
*/
}

EditorCanvasDoc.propTypes = {
    /**
     * Si se renderiza el componente desde una vista contenida (true) o una normal (false)
     */
    fromCV: PropTypes.bool,
    /**
     * Indicador de si se muestra el canvas (tiene que haber un navItem seleccionado)
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
     * Selecciona una vista contenida
     */
    onContainedViewSelected: PropTypes.func.isRequired,
    /**
     * Hace aparecer/desaparecer el CKEditor
     */
    onTextEditorToggled: PropTypes.func.isRequired,
};
