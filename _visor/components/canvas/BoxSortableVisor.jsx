import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BoxVisor from './BoxVisor';

export default class BoxSortableVisor extends Component {
    render() {
        let box = this.props.boxes[this.props.id];
        return (
            <div ref="sortableContainer"
                style={{ position: 'relative' }}>
                {box.children.map((idContainer, index)=> {
                    let container = box.sortableContainers[idContainer];
                    return (<div key={index}
                        className={"editorBoxSortableContainer pos_relative " + container.style.className}
                        id={idContainer}
                        style={
                            Object.assign({}, {
                                height: container.height === 'auto' ? container.height : container.height + 'px',
                            }, container.style)
                        }>
                        <div className="disp_table width100 height100">
                            {container.colDistribution.map((col, i) => {
                                if (container.cols[i]) {
                                    return (<div key={i}
                                        className="colDist-i height100 disp_table_cell vert_al_top"
                                        style={{ width: col + "%" }}>
                                        {container.cols[i].map((row, j) => {
                                            return (<div key={j}
                                                className="colDist-j width100 pos_relative"
                                                style={{ height: row + "%" }}>
                                                {container.children.map((idBox, ind) => {
                                                    if (this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                                        return (<BoxVisor id={idBox}
                                                            key={ind}
                                                            boxes={this.props.boxes}
                                                            changeCurrentView={(element)=>{this.props.changeCurrentView(element);}}
                                                            currentViewSelected={this.props.currentViewSelected}
                                                            toolbars={this.props.toolbars}
                                                            richElementsState={this.props.richElementsState}/>);

                                                    } else if (ind === container.children.length - 1) {
                                                        return (<span key={ind}><br/><br/></span>);
                                                    }
                                                    return null;
                                                })}
                                            </div>);
                                        })}
                                    </div>);
                                }
                                return null;
                            })}
                        </div>
                    </div>);
                })}
            </div>
        );
    }
}

BoxSortableVisor.propTypes = {
    /**
     * Identificador de la caja
     */
    id: PropTypes.string.isRequired,
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
