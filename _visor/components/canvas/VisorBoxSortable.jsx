import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisorBox from './VisorBox';

export default class VisorBoxSortable extends Component {
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
                                                        return (<VisorBox id={idBox}
                                                            key={ind}
                                                            currentView={this.props.currentView}
                                                            show={this.props.show}
                                                            boxes={this.props.boxes}
                                                            exercises={(this.props.exercises && this.props.exercises.exercises) ? this.props.exercises.exercises[idBox] : undefined}
                                                            changeCurrentView={(element)=>{this.props.changeCurrentView(element);}}
                                                            fromScorm={this.props.fromScorm}
                                                            toolbars={this.props.toolbars}
                                                            marks={this.props.marks}
                                                            onMarkClicked={this.props.onMarkClicked}
                                                            setAnswer={this.props.setAnswer}
                                                            richElementsState={this.props.richElementsState}
                                                            themeColors = {this.props.themeColors}
                                                        />);

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

VisorBoxSortable.propTypes = {
    /**
     * Show the current view
     */
    show: PropTypes.bool,
    /**
     * Identificador de la caja
     */
    id: PropTypes.string.isRequired,
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Cambia la vista actual
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
     * Diccionario que contiene todas las toolbars
     */
    toolbars: PropTypes.object,
    /**
     * Estado del plugin enriquecido en la transición
     */
    richElementsState: PropTypes.object,
    /**
   * Whether the app is in SCORM mode or not
   */
    fromScorm: PropTypes.bool,
    /**
   * Object containing all the exercises in the course
   */
    exercises: PropTypes.object.isRequired,
    /**
   * Function for submitting a page Quiz
   */
    setAnswer: PropTypes.func.isRequired,
    /**
   * Vista actual
   */
    currentView: PropTypes.any,
    /**
    * All marks
    */
    marks: PropTypes.object,
    /**
     * Function that triggers a mark
     */
    onMarkClicked: PropTypes.func,
    /**
     * Object containing current theme colors
     */
    themeColors: PropTypes.object,
};
