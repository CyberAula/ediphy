import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Input,Button} from 'react-bootstrap';
import interact from 'interact.js';
import {BOX_TYPES, ID_PREFIX_SORTABLE_BOX} from '../constants';

export default class DaliBox extends Component {
    render() {
        let borderSize = 2;
        let cornerSize = 15;

        let box = this.props.box;

        let style = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            wordWrap: 'break-word',
            visibility: (this.props.toolbar.showTextEditor ? 'hidden' : 'visible')};

        let textareaStyle = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            border: (borderSize + "px dashed black"),
            boxSizing: 'border-box',
            resize: 'none',
            overflowY: 'hidden',
            visibility: (this.props.toolbar.showTextEditor ? 'visible' : 'hidden')}
        let attrs = {};

        if(this.props.toolbar.buttons) {
            this.props.toolbar.buttons.map((item, index) => {
                if (item.autoManaged) {
                    if (!item.isAttribute) {
                        style[item.name] = item.value;
                        if (item.units)
                            style[item.name] += item.units;
                    } else {
                        attrs['data-' + item.name] = item.value;
                    }
                }
                if(item.name === 'fontSize'){
                    textareaStyle['fontSize'] = item.value;
                    if (item.units)
                        textareaStyle['fontSize'] += item.units;
                }else if(item.name === 'color'){
                    textareaStyle['color'] = item.value;
                }
            });
        }
        let content = (
            <div style={style} {...attrs} dangerouslySetInnerHTML={{__html: box.content}}>
            </div>
        );
        let overlay = (
            <div style={{visibility: ((this.props.isSelected && box.type !== BOX_TYPES.SORTABLE) ? 'visible' : 'hidden')}}>
                <div style={{position: 'absolute', width: '100%', height: '100%', border: (borderSize + "px dashed black"), boxSizing: 'border-box'}}>
                   
                     <Button className="trashbutton" 
                             onClick={e => {
                                this.props.onBoxDeleted(this.props.id, this.props.box.parent);
                                e.stopPropagation();
                             }}>
                        <i className="fa fa-trash-o"></i>
                      </Button>

                    </div>
                <div style={{position: 'absolute', left:  -cornerSize/2, top: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
                <div style={{position: 'absolute', right: -cornerSize/2, top: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
                <div style={{position: 'absolute', left:  -cornerSize/2, bottom: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
                <div style={{position: 'absolute', right: -cornerSize/2, bottom: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
            </div>);

        return (<div onClick={e => { e.stopPropagation()
                        this.props.onBoxSelected(this.props.id)}}
                               onDoubleClick={(e)=>{ 
                               this.props.onTextEditorToggled(this.props.id, true);
                               this.refs.textarea.focus();
                           }}  
                     style={{position: 'absolute',
                            left: box.position.x,
                            top: box.position.y,
                            width: box.width,
                            height: box.height,
                            touchAction: 'none',
                            msTouchAction: 'none'}}>
            {content}
            {overlay}
            <textarea ref={"textarea"} style={textareaStyle}
                
                      onBlur={() => {
                        this.blurTextarea();
                      }}
                     />
        </div>);
    }

    blurTextarea(){
        this.props.onTextEditorToggled(this.props.id, false);
        Dali.Plugins.get(this.props.toolbar.config.name).updateTextChanges(this.refs.textarea.value, this.props.id);
    }

    componentWillUpdate(nextProps, nextState){
        if(this.props.isSelected && !nextProps.isSelected && this.props.toolbar.showTextEditor){
            this.blurTextarea();
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.toolbar.showTextEditor){
            this.refs.textarea.focus();
        }
    }

    componentDidMount() {
        if (this.props.box.type !== BOX_TYPES.SORTABLE) {
            interact(ReactDOM.findDOMNode(this))
                .draggable({
                    enabled: this.props.box.draggable,
                    restrict: {
                        restriction: "parent",
                        endOnly: true,
                        elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                    },
                    autoScroll: true,
                    onmove: (event) => {
                        var target = event.target;

                        target.style.left = (parseInt(target.style.left) || 0) + event.dx + 'px';
                        target.style.top = (parseInt(target.style.top) || 0) + event.dy + 'px';
                        if(event.restrict && event.restrict.dy < 0) {
                            target.style.top = (parseInt(target.style.top) || 0) - event.restrict.dy + 'px';
                        }


                    },
                    onend: (event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        this.props.onBoxMoved(this.props.id, parseInt(event.target.style.left), parseInt(event.target.style.top));
                    }
                })
                .ignoreFrom('input, textarea, a')
                .resizable({
                    enabled: this.props.box.resizable,
                    restrict: {
                        restriction: "parent",
                        endOnly: true,
                        elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                    },
                    edges: {left: true, right: true, bottom: true, top: true},
                    onmove: (event) => {
                        /*BOX-RESIZE*/
                        var target = event.target;
                        
                            if(event.edges.bottom){
                                //Abajo
                                target.style.top = (parseInt(target.style.top) || 0);
                            }
                            if(event.edges.left){
                                //Izquierda
                                target.style.left = (parseInt(target.style.left) || 0) + event.dx + 'px';    
                            }
                            if(event.edges.right){
                                //Derecha
                                target.style.left = (parseInt(target.style.left) || 0);
                            }
                            if(event.edges.top){
                               //Arriba
                                target.style.top = (parseInt(target.style.top) || 0) + event.dy + 'px';
                              
                            }
                               
                        target.style.width = event.rect.width + 'px';
                        target.style.height = event.rect.height + 'px';
                        console.log(event.restrict)
                        if(event.restrict){
                             if(event.edges.top){
                                target.style.height = parseInt(target.style.height) + event.restrict.dy + 'px';
                                }else{
                                    target.style.height = parseInt(target.style.height) - event.restrict.dy + 'px';
                                }
                              
                            if(event.restrict.dx ){
                                if(event.edges.left){
                                   target.style.width = parseInt(target.style.width) + event.restrict.dx + 'px';
                                   }else{
                                       target.style.width = parseInt(target.style.width) - event.restrict.dx + 'px';
                                   }
                               
                          

                            }

                        }
                    },
                    onend: (event) => {
                        event.stopPropagation()
                        event.preventDefault()
                        this.props.onBoxResized(this.props.id, parseInt(event.target.style.width), parseInt(event.target.style.height));
                    }
                });
        }
    }
}
