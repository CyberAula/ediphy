import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import interact from 'interactjs';
import EditorBox from '../editor_box/EditorBox';
import { RESIZE_SORTABLE_CONTAINER, ADD_BOX } from '../../../../common/actions';
import { isAncestorOrSibling } from '../../../../common/utils';
import Ediphy from '../../../../core/editor/main';

import './_pluginPlaceHolder.scss';

/**
 * @deprecated
 */
export default class PluginPlaceholder extends Component {
    render() {
        let container = this.props.parentBox.sortableContainers[this.props.pluginContainer];
        let className = "drg" + this.props.pluginContainer;
        if(this.props.boxLevelSelected - this.props.parentBox.level === 1 &&
           isAncestorOrSibling(this.props.parentBox.id, this.props.boxSelected, this.props.boxes)) {
            className += " childBoxSelected";
        }
        return (
            <div style={
                Object.assign({}, {
                    width: "100%",
                    height: container.height === 'auto' ? container.height : container.height + 'px',
                    minHeight: '35px',
                    textAlign: 'center',
                    lineHeight: '100%',
                    boxSizing: 'border-box',
                    position: 'relative',
                    display: 'table',
                }, container.style)
            }
            id={this.props.pluginContainer}
            className={className}>
                {container.colDistribution.map((col, i) => {
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
                                                ".rib, .dnd" + this.props.pluginContainer,
                                                {
                                                    i: i,
                                                    j: j,
                                                }
                                            );
                                        }
                                    }}>
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
                                                onBoxSelected={this.props.onBoxSelected}
                                                onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                                onBoxMoved={this.props.onBoxMoved}
                                                onBoxResized={this.props.onBoxResized}
                                                onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                                onSortableContainerResized={this.props.onSortableContainerResized}
                                                onBoxDeleted={this.props.onBoxDeleted}
                                                onBoxDropped={this.props.onBoxDropped}
                                                onBoxModalToggled={this.props.onBoxModalToggled}
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
                })}
            </div>
        );
    }

    configureDropZone(node, selector, extraParams) {
        interact(node).dropzone({
            accept: selector,
            overlap: 'pointer',
            ondropactivate: function(e) {
                e.target.classList.add('drop-active');
            },
            ondragenter: function(e) {
                e.target.classList.add("drop-target");
            },
            ondragleave: function(e) {
                e.target.classList.remove("drop-target");
            },
            ondrop: function(e) {
                // If element dragged is coming from PluginRibbon, create a new EditorBox
                if (e.relatedTarget.className.indexOf("rib") !== -1) {
                    let initialParams = {
                        parent: this.props.parentBox.id,
                        container: this.props.pluginContainer,
                        col: extraParams.i,
                        row: extraParams.j,
                    };
                    Ediphy.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().callback(initialParams, ADD_BOX);
                } else {
                    let boxDragged = this.props.boxes[this.props.boxSelected];
                    // If box being dragged is dropped in a different column or row, change it's value
                    if (boxDragged && (boxDragged.col !== extraParams.i || boxDragged.row !== extraParams.j)) {
                        this.props.onBoxDropped(this.props.boxSelected, extraParams.j, extraParams.i);

                        let clone = document.getElementById('clone');
                        clone.parentElement.removeChild(clone);
                    }
                }
            }.bind(this),
            ondropdeactivate: function(e) {
                e.target.classList.remove('drop-active');
                e.target.classList.remove("drop-target");
            },
        });
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
                    this.props.onSortableContainerResized(this.props.pluginContainer, this.props.parentBox.id, parseInt(event.target.style.height, 10));
                    let toolbar = this.props.toolbars[this.props.parentBox.id];
                    Ediphy.Plugins.get(toolbar.config.name).forceUpdate(toolbar.state, this.props.parentBox.id, RESIZE_SORTABLE_CONTAINER);
                },
            });
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
    parentBox: PropTypes.string.isRequired,
    /**
     * Diccionario que contiene todas las cajas creadas, accesibles por su *id*
     */
    boxes: PropTypes.object.isRequired,
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
    toolbars: PropTypes.object.isRequired,
    /**
     * Última acción de Redux realizada
     */
    lastActionDispatched: PropTypes.any,
    /**
     * Selecciona una caja
     */
    onBoxSelected: PropTypes.func.isRequired,
    /**
     * Aumenta de nivel de profundidad de selección (plugins dentro de plugins)
     */
    onBoxLevelIncreased: PropTypes.func.isRequired,
    /**
     * Vista contenida seleccionanda
     */
    containedViewSelected: PropTypes.any,
    /**
     * Mueve una caja
     */
    onBoxMoved: PropTypes.func.isRequired,
    /**
     * Redimensiona una caja
     */
    onBoxResized: PropTypes.func.isRequired,
    /**
     * Redimensiona contenedor sortable
     */
    onSortableContainerResized: PropTypes.func.isRequired,
    /**
     * Elimina caja
     */
    onBoxDeleted: PropTypes.func.isRequired,
    /**
     * Suelta caja
     */
    onBoxDropped: PropTypes.func.isRequired,
    /**
     * Alinea verticalmente una caja
     */
    onVerticallyAlignBox: PropTypes.func.isRequired,
    /**
     * Reordena las cajas de un contenedor
     */
    onBoxesInsideSortableReorder: PropTypes.func.isRequired,
    /**
     * Activa/Desactiva la edición de texto
     */
    onTextEditorToggled: PropTypes.func.isRequired,
};
