import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Input,Button} from 'react-bootstrap';
import interact from 'interact.js';
import PluginPlaceholder from '../components/PluginPlaceholder';
import {BOX_TYPES, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_SORTABLE_CONTAINER} from '../constants';

export default class DaliBox extends Component {

   
    render() {
        let borderSize = 2;
        let cornerSize = 15;

        let box = this.props.boxes[this.props.id];
        let toolbar = this.props.toolbars[this.props.id];
        let vis = ((this.props.boxSelected === this.props.id) && box.type !== BOX_TYPES.SORTABLE)
        let style = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            wordWrap: 'break-word',
            visibility: (toolbar.showTextEditor ? 'hidden' : 'visible')};

        let textareaStyle = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            resize: 'none',
            visibility: (toolbar.showTextEditor ? 'visible' : 'hidden')}
        let attrs = {};
       
        if(toolbar.buttons) {
            toolbar.buttons.map((item, index) => {
                if (item.autoManaged) {
                    if (!item.isAttribute) {
                        if(item.name !== 'width') {
                            style[item.name] = item.value;
                            if (item.units)
                                style[item.name] += item.units;
                        }
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
            <div  style={style} {...attrs} dangerouslySetInnerHTML={{__html: box.content}}>
            </div>
        );
        let border = (
            <div style={{visibility: (vis ? 'visible' : 'hidden')}}>
                <div style={{
                    position: 'absolute',
                    top: -(borderSize),
                    left: -(borderSize),
                    width: '100%',
                    height: '100%',
                    border: (borderSize + "px dashed black"),
                    boxSizing: 'content-box'
                }}>
                

                    </div>
                <div style={{position: 'absolute', left:  -cornerSize/2, top: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray', cursor: (box.container === 0 ? 'nw-resize' : 'move')}}></div>
                <div style={{position: 'absolute', right: -cornerSize/2, top: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray', cursor: (box.container === 0 ? 'nw-resize' : 'move')}}></div>
                <div style={{position: 'absolute', left:  -cornerSize/2, bottom: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray', cursor: (box.container === 0 ? 'nw-resize' : 'move')}}></div>
                <div style={{position: 'absolute', right: -cornerSize/2, bottom: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray', cursor: (box.container === 0 ? 'nw-resize' : 'move')}}></div>
            </div>);

        let classes = "wholebox";
        if(box.container){
            classes += " dnd" + box.container;
        }
        return (<div className={classes}
                     onClick={e => {
                        if(this.props.boxLevelSelected === box.level){
                            this.props.onBoxSelected(this.props.id);
                        }
                        e.stopPropagation();
                     }}
                     onDoubleClick={(e)=>{
                        if(box.children.length !== 0){
                            this.props.onBoxLevelIncreased();
                            this.props.onBoxSelected(this.props.id);
                        }
                        e.stopPropagation();
                        /*
                        if(toolbar.config && toolbar.config.needsTextEdition){
                            this.props.onTextEditorToggled(this.props.id, true);
                            this.refs.textarea.focus();
                        }*/}
                     }
                     style={{position: 'absolute',
                            left: box.position.x,
                            top: box.position.y,
                            width: box.width ,
                            height: box.height,
                            maxWidth: '100%',
                            maxHeight: '100%',
                            touchAction: 'none',
                            msTouchAction: 'none',
                            cursor: vis ? 'inherit': 'default' //esto evita que aparezcan los cursores de move y resize cuando la caja no está seleccionada
                        }}>
            {border}
            {content}
            <div contentEditable={true} ref={"textarea"} style={textareaStyle} />
        </div>);
    }

    blurTextarea(){
        this.props.onTextEditorToggled(this.props.id, false);
        Dali.Plugins.get(this.props.toolbars[this.props.id].config.name).updateTextChanges(this.refs.textarea.innerHTML, this.props.id);
    }

    isDescendant(searchingId, actualId){
        if(searchingId === actualId){
            return true;
        }
        let box = this.props.boxes[actualId];

        for(let i = 0; i < box.children.length; i++){
            for(let j = 0; j < box.sortableContainers[box.children[i]].children.length; j++){
                if(this.isDescendant(searchingId, box.sortableContainers[box.children[i]].children[j])){
                    return true;
                }
            }
        }

        return false;
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.boxes[nextProps.id] !== this.props.boxes[this.props.id] ||
            nextProps.toolbars[nextProps.id] !== this.props.toolbars[this.props.id] ||
            (this.props.boxSelected == this.props.id && nextProps.boxSelected !== this.props.id) ||
            (this.props.boxSelected !== this.props.id && nextProps.boxSelected === this.props.id) ||
            (this.props.boxLevelSelected !== nextProps.boxLevelSelected) ||
            this.isDescendant(this.props.boxSelected, this.props.id) ||
            this.isDescendant(nextProps.boxSelected, this.props.id)
        ){
            let pluginsContained = ReactDOM.findDOMNode(this).getElementsByTagName("plugin");
            for (let i = 0; i < pluginsContained.length; i++) {
                ReactDOM.render(<PluginPlaceholder key={i}
                                                   pluginContainer={pluginsContained[i].attributes["plugin-data-id"].value}
                                                   parentBox={nextProps.boxes[this.props.id]}
                                                   boxes={nextProps.boxes}
                                                   boxSelected={nextProps.boxSelected}
                                                   boxLevelSelected={nextProps.boxLevelSelected}
                                                   toolbars={nextProps.toolbars}
                                                   onBoxSelected={this.props.onBoxSelected}
                                                   onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                                   onBoxMoved={this.props.onBoxMoved}
                                                   onBoxResized={this.props.onBoxResized}
                                                   onBoxDeleted={this.props.onBoxDeleted}
                                                   onBoxDropped={this.props.onBoxDropped}
                                                   onBoxModalToggled={this.props.onBoxModalToggled}
                                                   onTextEditorToggled={this.props.onTextEditorToggled}
                />, pluginsContained[i]);
            }
            return true;
        }
        return false;
    }

    componentWillUpdate(nextProps, nextState){
        if((this.props.boxSelected === this.props.id) && (nextProps.boxSelected !== this.props.id) && this.props.toolbars[this.props.id].showTextEditor){
            CKEDITOR.currentInstance.focusManager.blur(true);
        }
    }

    checkAspectRatio(buttons){
        let block = true
        buttons.map((item, index) => {
            if(item.type=="checkbox") {
                if(item.value=="unchecked"){
                    block = true
                } else {
                    block = false
                }
            }
        });
        return block
    }

    componentDidUpdate(prevProps, prevState){
        let toolbar = this.props.toolbars[this.props.id];
        if(toolbar.showTextEditor){
            this.refs.textarea.focus();
        }
        if((toolbar.showTextEditor !== prevProps.toolbars[this.props.id].showTextEditor) && this.props.boxes[this.props.id].draggable){
            interact(ReactDOM.findDOMNode(this)).draggable(!toolbar.showTextEditor);
        }

        if(this.refs.textarea.innerHTML === "<p><br></p>"){
            this.refs.textarea.innerHTML = this.props.boxes[this.props.id].content;
        }
        let block = this.checkAspectRatio(toolbar.buttons)
        interact(ReactDOM.findDOMNode(this)).resizable({ preserveAspectRatio: !block }) 
    }



    componentDidMount() {
        let toolbar = this.props.toolbars[this.props.id];
        let box = this.props.boxes[this.props.id];
        let block = false;
  
        if(toolbar.config && toolbar.config.needsTextEdition) {
            CKEDITOR.disableAutoInline = true;
            let editor = CKEDITOR.inline(this.refs.textarea);
            editor.on("blur", function (e) {
                this.blurTextarea();
            }.bind(this));
        }

        let pluginsContained = ReactDOM.findDOMNode(this).getElementsByTagName("plugin");
        for(let i = 0; i < pluginsContained.length; i++){
            let pluginContainerId;
            if(!pluginsContained[i].hasAttribute("plugin-data-id")) {
                pluginContainerId = ID_PREFIX_SORTABLE_CONTAINER + Date.now();
                pluginsContained[i].setAttribute("plugin-data-id", pluginContainerId);
            }else{
                pluginContainerId = pluginsContained[i].attributes["plugin-data-id"].value
            }
            ReactDOM.render(<PluginPlaceholder key={i}
                                               pluginContainer={pluginContainerId}
                                               parentBox={box}
                                               boxes={this.props.boxes}
                                               boxSelected={this.props.boxSelected}
                                               boxLevelSelected={this.props.boxLevelSelected}
                                               toolbars={this.props.toolbars}
                                               onBoxSelected={this.props.onBoxSelected}
                                               onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                               onBoxMoved={this.props.onBoxMoved}
                                               onBoxResized={this.props.onBoxResized}
                                               onBoxDeleted={this.props.onBoxDeleted}
                                               onBoxModalToggled={this.props.onBoxModalToggled}
                                               onTextEditorToggled={this.props.onTextEditorToggled}
            />, pluginsContained[i]);
        }
        
        let dragRestrictionSelector = (box.container !== 0) ? ".daliBoxSortableContainer, .drg" + box.container : "parent";
        interact(ReactDOM.findDOMNode(this))
            .draggable({
                enabled: (box.draggable),
                restrict: {
                    restriction: dragRestrictionSelector,
                    elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                },
                autoScroll: true,
                onmove: (event) => {
                    if (this.props.boxSelected !== this.props.id) {
                        return;
                    }
                    var target = event.target;
                    target.style.left = (parseInt(target.style.left) || 0) + event.dx + 'px';
                    target.style.top = (parseInt(target.style.top) || 0) + event.dy + 'px';
                    target.style.zIndex = 999999;
                },
                onend: (event) => {

                    if(this.props.boxSelected !== this.props.id) {
                        return;
                    }

                    var target = event.target;
                    if(!target.parentElement){
                        return;
                    }
                    let left = Math.max(Math.min(Math.floor(parseInt(target.style.left) / target.parentElement.offsetWidth * 100), 100), 0) + '%';
                    let top = Math.max(Math.min(Math.floor(parseInt(target.style.top) / target.parentElement.offsetHeight * 100), 100), 0) + '%';

                    target.style.left = box.container !== 0 ? left : target.style.left;
                    target.style.top = box.container !== 0 ? top : target.style.top;
                    target.style.zIndex = 'initial';

                    this.props.onBoxMoved(
                        this.props.id,
                        box.container !== 0 ? left : Math.max(parseInt(target.style.left), 0),
                        box.container !== 0 ? top : Math.max(parseInt(target.style.top), 0));
                    event.stopPropagation();
                }
            })
            .ignoreFrom('input, textarea, a')
            .resizable({
                 preserveAspectRatio: this.checkAspectRatio(this.props.toolbars[this.props.id].buttons),
                enabled: (box.resizable),
                restrict: {
                    restriction: "parent",
                    //endOnly: true,
                    elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                },
                edges: {left: true, right: true, bottom: true, top: true},

                onmove: (event) => {

                    if (this.props.boxSelected !== this.props.id) {
                        return;
                    }
                    /*BOX-RESIZE*/
                    let target = event.target;
                    if(event.edges.bottom){ //Abajo
                        target.style.top = (parseInt(target.style.top) || 0);
                    }
                    if(event.edges.left){ //Izquierda
                        target.style.left = (parseInt(target.style.left) || 0) + event.dx + 'px';
                    }
                    if(event.edges.right){ //Derecha
                        target.style.left = (parseInt(target.style.left) || 0);
                    }
                    if(event.edges.top){ //Arriba
                        target.style.top = (parseInt(target.style.top) || 0) + event.dy + 'px';
                    }

                    target.style.width  = event.rect.width  + 'px';
                    target.style.height = event.rect.height + 'px';

                    /*
                    if(event.restrict){
                        if (event.edges.top && event.restrict.dy < 0) {
                            target.style.height = parseInt(target.style.height) + event.restrict.dy + 'px';
                        }
                        if (event.edges.bottom && event.restrict.dy > 0) {
                            target.style.height = parseInt(target.style.height) - event.restrict.dy + 'px';
                        }
                        if(event.edges.left && event.restrict.dx < 0){
                            target.style.width = parseInt(target.style.width) + event.restrict.dx + 'px';
                        }
                        if(event.edges.right && event.restrict.dx > 0){
                            target.style.width = parseInt(target.style.width) - event.restrict.dx + 'px';
                        }
                    }
                    */
                },
                onend: (event) => {
                    if (this.props.boxSelected !== this.props.id) {
                        return;
                    }

                    let target = event.target;
                    let width = Math.min(Math.floor(parseInt(target.style.width) / target.parentElement.offsetWidth * 100), 100) + '%';
                    let height = Math.min(Math.floor(parseInt(target.style.height) / target.parentElement.offsetHeight * 100), 100) + '%';
                    this.props.onBoxResized(
                        this.props.id,
                        box.container !== 0 ? width : parseInt(target.style.width),
                        box.container !== 0 ? height : parseInt(target.style.height));
                    this.props.onBoxMoved(this.props.id, parseInt(target.style.left), parseInt(target.style.top));
                    event.stopPropagation();
                }
            });
    }

    componentWillUnmount(){
        interact(ReactDOM.findDOMNode(this)).unset();
        let pluginsContained = ReactDOM.findDOMNode(this).getElementsByTagName("plugin");
        for(var i = 0; i < pluginsContained.length; i++){
            ReactDOM.unmountComponentAtNode(pluginsContained[i]);
        }
    }
}
