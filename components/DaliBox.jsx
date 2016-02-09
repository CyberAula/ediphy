import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Input} from 'react-bootstrap';
import interact from 'interact.js';
import {BOX_TYPES, ID_PREFIX_SORTABLE_CONTAINER} from '../constants';

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
            <div style={style} {...attrs} dangerouslySetInnerHTML={{__html: box.content}}></div>
        );
        let overlay = (
            <div
                style={{visibility: ((this.props.isSelected && box.type !== BOX_TYPES.SORTABLE) ? 'visible' : 'hidden')}}>
                <div
                    style={{position: 'absolute', width: '100%', height: '100%', border: (borderSize + "px dashed black"), boxSizing: 'border-box'}}>
                   
                     <button onClick={e => {myEventHandler(e); this.props.onBoxDeleted(this.props.id, this.props.box.parent)}} style={{backgroundColor:'transparent', right: 0, position:'absolute' , border: '0'}}>  <i className="fa fa-trash-o"></i></button>

                    </div>
                <div
                    style={{position: 'absolute', left:  -cornerSize/2, top: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
                <div
                    style={{position: 'absolute', right: -cornerSize/2, top: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
                <div
                    style={{position: 'absolute', left:  -cornerSize/2, bottom: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
                <div
                    style={{position: 'absolute', right: -cornerSize/2, bottom: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
            </div>);

        let position = 'absolute';
        if(box.parent.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1){
            position = 'relative';
            box.position.y = 0;
        }

        return (<div onClick={e => {
                        this.props.onBoxSelected(this.props.id)}}
                     style={{position: position,
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
                      }}/>
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
                    cancel:'iframe',
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

                        if(event.restrict){
                            this.props.onBoxMoved(this.props.id, parseInt(target.style.left), parseInt(target.style.top));
                        }
                    },
                    onend: (event) => {
                        //this.props.onBoxMoved(this.props.id, parseInt(event.target.style.left), parseInt(event.target.style.top));
                    }
                })
                .resizable({
                    enabled: this.props.box.resizable,
                    restrict: {
                      restriction: 'parent',
                        endOnly: true
                    },
                    edges: {left: true, right: true, bottom: true, top: true},
                    container:'parent',
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
                    },
                    onend: (event) => {
                        this.props.onBoxResized(this.props.id, parseInt(event.target.style.width), parseInt(event.target.style.height));
                    }
                });
        }
    }
}

function   myEventHandler(event){
    if (event.stopPropagation){
       event.stopPropagation();
   }
   else if(window.event){
      window.event.cancelBubble=true;
   }
}