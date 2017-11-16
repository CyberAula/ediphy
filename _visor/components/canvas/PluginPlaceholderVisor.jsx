import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BoxVisor from './BoxVisor';
import { isAncestorOrSibling } from '../../../common/utils';

export default class PluginPlaceholderVisor extends Component {
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
                                >
                                    {container.children.map((idBox, index) => {
                                        if (this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                            return (<BoxVisor id={idBox}
                                                key={index}
                                                boxes={this.props.boxes}
                                                changeCurrentView={this.props.changeCurrentView}
                                                currentViewSelected={this.props.currentViewSelected}
                                                toolbars={this.props.toolbars}
                                                richElementsState={this.props.richElementsState}/>);

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

}

PluginPlaceholderVisor.propTypes = {
    /**
     * Identificador del contenedor de plugins
     */
    pluginContainer: PropTypes.string.isRequired,
    /**
     * Indica si se puede redimensionar el contenedor
     */
    resizable: PropTypes.bool,
    /**
     * Identificador de la caja
     */
    parentBox: PropTypes.object.isRequired,
    /**
     * Diccionario que contiene todas las cajas
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Cambia la vista actual
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
     * Vista actual
     */
    currentView: PropTypes.any,
    /**
     * Diccionario que contiene todas las toolbars
     */
    toolbars: PropTypes.object,
    /**
     * Estado del plugin enriquecido en la transición
     */
    richElementsState: PropTypes.object,
};
