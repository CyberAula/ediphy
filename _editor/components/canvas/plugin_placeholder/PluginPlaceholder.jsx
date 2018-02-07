import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import interact from 'interactjs';
import Alert from './../../common/alert/Alert';
import EditorBox from '../editor_box/EditorBox';
import { RESIZE_SORTABLE_CONTAINER, ADD_BOX } from '../../../../common/actions';
import { isAncestorOrSibling, isBox, isSortableContainer } from '../../../../common/utils';
import Ediphy from '../../../../core/editor/main';
import i18n from 'i18next';
import './_pluginPlaceHolder.scss';
import { ID_PREFIX_SORTABLE_CONTAINER } from '../../../../common/constants';
import { instanceExists, releaseClick } from '../../../../common/common_tools';

/**
 * @deprecated
 */
export default class PluginPlaceholder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: null,
        };
    }
    render() {
        let container = this.props.parentBox.sortableContainers[this.idConvert(this.props.pluginContainer)] || {};
        let className = "drg" + this.idConvert(this.props.pluginContainer);
        /* if(this.props.boxLevelSelected - this.props.parentBox.level === 1 &&
           isAncestorOrSibling(this.props.parentBox.id, this.props.boxSelected, this.props.boxes)) {
            className += " childBoxSelected";
        }*/
        container.style = container.style || {};
        return (
            <div style={
                Object.assign({}, {
                    width: "100%",
                    height: container.height ? (container.height === 'auto' ? container.height : container.height + 'px') : "",
                    minHeight: '35px',
                    textAlign: 'center',
                    lineHeight: '100%',
                    boxSizing: 'border-box',
                    position: 'relative',
                    display: 'table',
                }, container.style)
            }
            id={this.idConvert(this.props.pluginContainer)}
            className={className}>
                {container.colDistribution ? container.colDistribution.map((col, i) => {
                    if (container.cols[i]) {
                        return (<div key={i}
                            style={{ width: col + "%", height: '100%', display: "table-cell", verticalAlign: "top" }}>
                            {container.cols[i].map((row, j) => {
                                return (<div key={j}
                                    style={{ width: "100%", height: row + "%", position: 'relative' }}
                                    ref={e => {
                                        if(e !== null) {
                                            this.configureDropZone(
                                                ReactDOM.findDOMNode(e),
                                                ".rib, .dnd" /* + this.idConvert(this.props.pluginContainer)*/,
                                                {
                                                    i: i,
                                                    j: j,
                                                }
                                            );
                                        }
                                    }}>
                                    {this.state.alert}
                                    {container.children.map((idBox, index) => {
                                        if (this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                            return (<EditorBox id={idBox}
                                                key={index}
                                                boxes={this.props.boxes}
                                                boxSelected={this.props.boxSelected}
                                                boxLevelSelected={this.props.boxLevelSelected}
                                                containedViewSelected={this.props.containedViewSelected}
                                                toolbars={this.props.toolbars}
                                                lastActionDispatched={this.props.lastActionDispatched}
                                                markCreatorId={this.props.markCreatorId}
                                                onRichMarksModalToggled={this.props.onRichMarksModalToggled}
                                                addMarkShortcut={this.props.addMarkShortcut}
                                                deleteMarkCreator={this.props.deleteMarkCreator}
                                                onBoxSelected={this.props.onBoxSelected}
                                                onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                                onBoxMoved={this.props.onBoxMoved}
                                                onBoxResized={this.props.onBoxResized}
                                                onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                                onSortableContainerResized={this.props.onSortableContainerResized}
                                                onBoxAdded={this.props.onBoxAdded}
                                                pageType={this.props.pageType}
                                                containedViews={this.props.containedViews}
                                                onBoxDropped={this.props.onBoxDropped}
                                                onBoxModalToggled={this.props.onBoxModalToggled}
                                                onRichMarkUpdated={this.props.onRichMarkUpdated}
                                                onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                                onTextEditorToggled={this.props.onTextEditorToggled}/>);
                                        } else if (index === container.children.length - 1) {
                                            return (<span><br/><br/></span>);
                                        }
                                        return null;
                                    })}
                                    {container.children.length === 0 ? (<span><br/><br/></span>) : ""}
                                </div>);
                            })}
                        </div>);
                    }
                    return null;
                }) : <div/>}
            </div>
        );
    }

    configureDropZone(node, selector, extraParams) {
        let alert = (msg)=>{return (<Alert className="pageModal"
            show
            hasHeader
            backdrop={false}
            title={ <span><i className="material-icons" style={{ fontSize: '14px', marginRight: '5px', color: 'yellow' }}>warning</i>{ i18n.t("messages.alert") }</span> }
            closeButton onClose={()=>{this.setState({ alert: null });}}>
            <span> {msg} </span>
        </Alert>);};
        interact(node).dropzone({
            accept: selector,
            overlap: 'pointer',
            ondropactivate: (e) => {
                if ((this.props.parentBox.id !== this.props.boxSelected && this.props.toolbars[this.props.boxSelected ] && !Ediphy.Plugins.get(this.props.toolbars[this.props.boxSelected ].config.name).getConfig().isComplex) ||
                    (e.relatedTarget.className.indexOf("rib") !== -1 && !Ediphy.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().isComplex)) {
                    e.target.classList.add('drop-active');
                }
            },
            ondragenter: function(e) {
                e.target.classList.add("drop-target");
            },
            ondragleave: function(e) {
                e.target.classList.remove("drop-target");
            },
            ondrop: function(e) {
                let clone = document.getElementById('clone');
                if (clone) {
                    clone.parentNode.removeChild(clone);
                }
                // If element dragged is coming from PluginRibbon, create a new EditorBox
                let draggingFromRibbon = e.relatedTarget.className.indexOf("rib") !== -1;
                let name = (draggingFromRibbon) ? e.relatedTarget.getAttribute("name") : this.props.toolbars[this.props.boxSelected].config.name;
                let parent = forbidden ? this.props.parentBox.parent : this.props.parentBox.id;
                let container = forbidden ? this.props.parentBox.container : this.idConvert(this.props.pluginContainer);
                let config = Ediphy.Plugins.get(name).getConfig();
                let forbidden = isBox(parent) && config.isComplex; // && (parent !== this.props.boxSelected);
                let newInd = this.getIndex(this.props.boxes, parent, container, e.dragEvent.clientX, e.dragEvent.clientY);

                let initialParams = {
                    parent: forbidden ? this.props.parentBox.parent : parent,
                    container: forbidden ? this.props.parentBox.container : container,
                    col: forbidden ? 0 : extraParams.i,
                    row: forbidden ? 0 : extraParams.j,
                    index: newInd,
                };
                if (draggingFromRibbon) {
                    if (config.limitToOneInstance && instanceExists(config.name)) {
                        this.setState({ alert: alert(i18n.t('messages.instance_limit')) });
                        return;
                    }
                    config.callback(initialParams, ADD_BOX);

                } else {

                    let boxDragged = this.props.boxes[this.props.boxSelected];
                    // If box being dragged is dropped in a different column or row, change its value
                    if (this.props.parentBox.id !== this.props.boxSelected) {
                        if (!forbidden) {
                            initialParams.position = { type: 'relative', x: 0, y: 0 };
                            this.props.onBoxDropped(boxDragged.id, initialParams.row, initialParams.col, initialParams.parent,
                                initialParams.container, boxDragged.parent, boxDragged.container, initialParams.position, newInd);
                        }
                        return;
                    }
                }

            }.bind(this),
            ondropdeactivate: function(e) {
                e.target.classList.remove('drop-active');
                e.target.classList.remove("drop-target");
            },
        });
    }
    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this)).unset();
        interact(".editorBoxSortableContainer").unset();

    }
    componentDidMount() {
        interact(ReactDOM.findDOMNode(this))
            .resizable({
                enabled: this.props.resizable,
                edges: { left: false, right: false, bottom: true, top: false },
                onmove: (event) => {
                    event.target.style.height = event.rect.height + 'px';
                },
                onend: (event) => {
                    this.props.onSortableContainerResized(this.idConvert(this.props.pluginContainer), this.props.parentBox.id, parseInt(event.target.style.height, 10));
                    let toolbar = this.props.toolbars[this.props.parentBox.id];
                    Ediphy.Plugins.get(toolbar.config.name).forceUpdate(toolbar.state, this.props.parentBox.id, RESIZE_SORTABLE_CONTAINER);
                },
            });
    }

    getIndex(boxes, parent, container, x, y) {

        let rc = document.elementFromPoint(x, y);
        let children = boxes[parent].sortableContainers[container].children;
        let bid = releaseClick(rc, 'box-');
        let newInd = children.indexOf(rc);
        return newInd === 0 ? 1 : ((newInd === -1 || newInd >= children.length) ? (children.length) : newInd);

    }
    idConvert(id) {
        if (isSortableContainer(id)) {
            return id;
        }
        return ID_PREFIX_SORTABLE_CONTAINER + id;

    }
}

PluginPlaceholder.propTypes = {
    /**
     * Nombre del contenedor de plugins
     */
    pluginContainer: PropTypes.string.isRequired,
    /**
     * Indicador de si se puede redimensionar el contenedor
     */
    resizable: PropTypes.bool,
    /**
     * Identificador único de la caja padre
     */
    parentBox: PropTypes.any,
    /**
     * Diccionario que contiene todas las cajas creadas, accesibles por su *id*
     */
    boxes: PropTypes.object,
    /**
     * Caja seleccionada
     */
    boxSelected: PropTypes.any,
    /**
     * Nivel de caja seleccionado
     */
    boxLevelSelected: PropTypes.any,
    /**
     * Diccionario que contiene todas las toolbars, accesibles por el *id* de su caja o vista
     */
    toolbars: PropTypes.object,
    /**
     * Última acción de Redux realizada
     */
    lastActionDispatched: PropTypes.any,
    /**
     * Selecciona una caja
     */
    onBoxSelected: PropTypes.func,
    /**
     * Aumenta de nivel de profundidad de selección (plugins dentro de plugins)
     */
    onBoxLevelIncreased: PropTypes.func,
    /**
     * Vista contenida seleccionanda
     */
    containedViewSelected: PropTypes.any,
    /**
     * Mueve una caja
     */
    onBoxMoved: PropTypes.func,
    /**
     * Redimensiona una caja
     */
    onBoxResized: PropTypes.func,
    /**
     * Redimensiona contenedor sortable
     */
    onSortableContainerResized: PropTypes.func,
    /**
     * Suelta caja
     */
    onBoxDropped: PropTypes.func,
    /**
     * Alinea verticalmente una caja
     */
    onVerticallyAlignBox: PropTypes.func,
    /**
     * Reordena las cajas de un contenedor
     */
    onBoxesInsideSortableReorder: PropTypes.func,
    /**
     * Activa/Desactiva la edición de texto
     */
    onTextEditorToggled: PropTypes.func,
    /**
      * Identificador de la caja en la que se va a crear una marca
      */
    markCreatorId: PropTypes.any,
    /**
      * Añade una marca a la caja
      */
    addMarkShortcut: PropTypes.func,
    /**
       * Función que oculta el overlay de creación de marcas
       */
    deleteMarkCreator: PropTypes.func,
    /**
      * Añade una caja
      */
    onBoxAdded: PropTypes.func,
    /**
       * Indica el tipo de página en el que se encuentra la caja
       */
    pageType: PropTypes.string,
    /**
   * Diccionario que contiene todas las vistas contenidas, accesibles por su *id*
   */
    containedViews: PropTypes.object,
};
