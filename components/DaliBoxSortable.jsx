import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import DaliBox from '../components/DaliBox';

export default class DaliBoxSortable extends Component{
    render(){
        return(
        <div>
            <div ref="sortableContainer" style={{position: 'relative'}}>
                {this.props.box.children.map((idContainer, index)=>{
                    return (<div key={index} style={{
                        width: '100%',
                        height: this.props.box.sortableContainers[idContainer].height,
                        border: '1px solid #999',
                        boxSizing: 'border-box',
                        position: 'relative'}}>
                            {this.props.box.sortableContainers[idContainer].children.map((idBox, index) => {
                                let box = this.props.boxes[idBox];
                                let isSelected = (idBox === this.props.boxSelected);

                                return (<DaliBox box={box}
                                                 id={idBox}
                                                 key={index}
                                                 isSelected={isSelected}
                                                 toolbar={this.props.toolbars[idBox]}
                                                 boxes={this.props.boxes}
                                                 boxSelected={this.props.boxSelected}
                                                 toolbars={this.props.toolbars}
                                                 onBoxSelected={this.props.onBoxSelected}
                                                 onBoxMoved={this.props.onBoxMoved}
                                                 onBoxResized={this.props.onBoxResized}
                                                 onBoxDeleted={this.props.onBoxDeleted}
                                                 onBoxModalToggled={this.props.onBoxModalToggled}
                                                 onTextEditorToggled={this.props.onTextEditorToggled} />);
                            })}
                        <div style={{position: 'absolute', bottom: 0}}>
                            <i style={{verticalAlign: 'middle'}} className="fa fa-bars fa-2x drag-handle"></i>
                            <Button onClick={e => this.props.onBoxModalToggled(this.props.id, false, idContainer)}>
                                <i className="fa fa-plus"></i>
                            </Button>
                        </div>
                    </div>);
                })}
            </div>
            <div style={{textAlign:'center'}}><span>
           <Button style={{display: 'inline-block', margin: 'auto'}} onClick={e => this.props.onBoxModalToggled(this.props.id, true)}>
                <i className="fa fa-plus-circle fa-3x"></i>
            </Button>
           {/* <Button style={{display: 'inline-block', margin: 'auto'}} onClick={e => this.props.onBoxDeleted(this.props.id, this.props.box.parent)}>
                <i className="fa fa-trash-o fa-3x"></i>
            </Button>*/}
            </span></div>
        </div>
        );
    }

    componentDidMount(){
        let list = jQuery(this.refs.sortableContainer);
        list.sortable({ handle: '.drag-handle' ,
            stop: (event, ui) => {
                const reorderedIndexes = list.sortable('toArray', {attribute: 'data-reactid'}) // Obtiene la nueva disposición de los elementos
                const indexes = reorderedIndexes.map(el => el.split('$')[2]) //Coge solo la parte que indica el orden
                list.sortable('cancel') //Evita que se reordenen para que gestione la llamada Redux
                this.props.onBoxReorder(indexes, this.props.id) // Cambia el estado pasando como parámetro el id del sortable y el nuevo orden de los elementos. Ahora el orden también se puede UNDO y REDO
        }});
    }

}