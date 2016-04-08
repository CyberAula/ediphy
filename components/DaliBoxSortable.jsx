import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import interact from 'interact.js';
import DaliBox from '../components/DaliBox';
import {ID_PREFIX_SORTABLE_CONTAINER} from '../constants';

export default class DaliBoxSortable extends Component{
    render(){
        let box = this.props.boxes[this.props.id];
        return(
        <div onClick={e => {
            e.stopPropagation();
            this.props.onBoxSelected(this.props.id)}}>
            <div ref="sortableContainer"
                 style={{position: 'relative'}}>
                {box.children.map((idContainer, index)=>{
                    return (<div key={index}
                                 className="daliBoxSortableContainer"
                                 data-id={idContainer}
                                 style={{
                                    width: '100%',
                                    minHeight: 150,
                                    border: '1px solid #999',
                                    boxSizing: 'border-box',
                                    position: 'relative'}}>
                            {box.sortableContainers[idContainer].children.map((idBox, index) => {
                                return (<DaliBox id={idBox}
                                                 key={index}
                                                 boxes={this.props.boxes}
                                                 boxSelected={this.props.boxSelected}
                                                 toolbars={this.props.toolbars}
                                                 onBoxSelected={this.props.onBoxSelected}
                                                 onBoxMoved={this.props.onBoxMoved}
                                                 onBoxResized={this.props.onBoxResized}
                                                 onBoxDeleted={this.props.onBoxDeleted}
                                                 onBoxDropped={this.props.onBoxDropped}
                                                 onBoxModalToggled={this.props.onBoxModalToggled}
                                                 onTextEditorToggled={this.props.onTextEditorToggled} />);
                            })}
                        <div style={{position: 'absolute', bottom: 0}}>
                            <i style={{verticalAlign: 'middle'}} className="fa fa-bars fa-2x drag-handle"></i>
                            {/*<Button onClick={e => this.props.onBoxModalToggled(this.props.id, false, idContainer)}>
                                <i className="fa fa-plus"></i>
                            </Button>*/}
                        </div>
                    </div>);
                })}
            </div>
            <div style={{textAlign:'center', minHeight: 100}}>
                {     /*
           <Button style={{display: 'inline-block', margin: 'auto'}} onClick={e => this.props.onBoxModalToggled(this.props.id, true)}>
                <i className="fa fa-plus-circle fa-3x"></i>
            </Button>

           /* <Button style={{display: 'inline-block', margin: 'auto'}} onClick={e => this.props.onBoxDeleted(this.props.id, this.props.box.parent)}>
                <i className="fa fa-trash-o fa-3x"></i>
            </Button>*/}
            </div>
        </div>
        );
    }

    componentDidMount(){
        interact(".daliBoxSortableContainer").dropzone({
            accept: '.rib',
            overlap: 'center',
            ondropactivate: function (event) {
                event.target.classList.add('drop-active');
            },
            ondrop: function (event) {
                //addBox
                let initialParams = {
                    parent: this.props.id,
                    container: event.target.getAttribute("data-id")
                };
                Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams);
                event.dragEvent.stopPropagation();
            }.bind(this),
            ondropdeactivate: function (event) {
                event.target.classList.remove('drop-active');
            }
        });

        interact(ReactDOM.findDOMNode(this)).dropzone({
            accept: '.rib',
            overlap: 'center',
            ondropactivate: function (event) {
                event.target.classList.add('drop-active');
            },
            ondrop: function (event) {
                //addBox
                console.log(this.props.id);
                let initialParams = {
                    parent: this.props.id,
                    container: ID_PREFIX_SORTABLE_CONTAINER + Date.now()
                };
                Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams);
                event.dragEvent.stopPropagation();
            }.bind(this),
            ondropdeactivate: function (event) {
                event.target.classList.remove('drop-active');
            }
        });

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