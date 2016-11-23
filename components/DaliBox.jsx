import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Input,Button, Tooltip, OverlayTrigger} from 'react-bootstrap';
import interact from 'interact.js';
import PluginPlaceholder from '../components/PluginPlaceholder';
import {ID_PREFIX_BOX, ID_PREFIX_PAGE, ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_SORTABLE_CONTAINER, ID_PREFIX_CONTAINED_VIEW} from '../constants';
import {ADD_BOX, UPDATE_BOX, RESIZE_BOX, IMPORT_STATE, EDIT_PLUGIN_TEXT} from '../actions';
import Dali from './../core/main';

export default class DaliBox extends Component {
    constructor(props) {
        super(props);
        this.borderSize = 2;
    }

    render() {
        let cornerSize = 15;
        let box = this.props.boxes[this.props.id];
        let toolbar = this.props.toolbars[this.props.id];
        let vis = this.props.boxSelected === this.props.id;
        let style = {
            visibility: (toolbar.showTextEditor ? 'hidden' : 'visible')
        };

        let textareaStyle = {
            position: 'absolute',
            resize: 'none',
            top: '0%',
            color: 'black',
            backgroundColor: 'white',
            padding: 15,
            width: '100%',
            height: (toolbar.showTextEditor ? '' : '100%'),
            border: 'dashed black 1px',
            zIndex: 99999,
            visibility: (toolbar.showTextEditor ? 'visible' : 'hidden')
        };
        let attrs = {};

        for (let tabKey in toolbar.controls) {
            for (let accordionKey in toolbar.controls[tabKey].accordions) {
                let button;
                for (let buttonKey in toolbar.controls[tabKey].accordions[accordionKey].buttons) {
                    button = toolbar.controls[tabKey].accordions[accordionKey].buttons[buttonKey];
                    if (button.autoManaged) {
                        if (!button.isAttribute) {
                            if (buttonKey !== 'width' && buttonKey !== 'height') {
                                style[buttonKey] = button.value;
                                /*if (button.units) {
                                 style[buttonKey] += button.units;
                                 }*/
                            }
                        } else {
                            attrs['data-' + buttonKey] = button.value;
                        }
                    }
                    if (buttonKey === 'fontSize') {
                        textareaStyle.fontSize = button.value;
                        if (button.units) {
                            textareaStyle.fontSize += button.units;
                        }
                    } else if (buttonKey === 'color') {
                        textareaStyle.color = button.value;
                    }
                }
                if (toolbar.controls[tabKey].accordions[accordionKey].accordions) {
                    for (let accordionKey2 in toolbar.controls[tabKey].accordions[accordionKey].accordions) {
                        for (let buttonKey in toolbar.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons) {
                            button = toolbar.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons[buttonKey];
                            if (button.autoManaged) {
                                if (!button.isAttribute) {
                                    if (buttonKey !== 'width' && buttonKey !== 'height') {
                                        style[buttonKey] = button.value;
                                        /*if (button.units) {
                                         style[buttonKey] += button.units;
                                         }*/
                                    }
                                } else {
                                    attrs['data-' + buttonKey] = button.value;
                                }
                            }
                            if (buttonKey === 'fontSize') {
                                textareaStyle.fontSize = button.value;
                                if (button.units) {
                                    textareaStyle.fontSize += button.units;
                                }
                            } else if (buttonKey === 'color') {
                                textareaStyle.color = button.value;
                            }
                        }
                    }
                }
            }
        }

        let content = toolbar.state.__text && !toolbar.config.extraTextConfig ? (
            /* jshint ignore:start */
            <div className="boxStyle" style={style} {...attrs} ref={"content"}
                 dangerouslySetInnerHTML={{__html: decodeURI(toolbar.state.__text)}}></div>
            /* jshint ignore:end */
        ) : toolbar.config.flavor === "react" ? (
            /* jshint ignore:start */
            <div className="boxStyle" style={style} {...attrs} ref={"content"}>
                {box.content}
            </div>
            /* jshint ignore:end */
        ) : (
            /* jshint ignore:start */
            <div className="boxStyle" style={style} {...attrs} ref={"content"}>
                {this.renderChildren(box.content)}
            </div>
            /* jshint ignore:end */
        );
        let border = (
            /* jshint ignore:start */
            <div style={{visibility: (vis ? 'visible' : 'hidden')}}>
                <div style={{
                    position: 'absolute',
                    top: -(this.borderSize),
                    left: -(this.borderSize),
                    width: '100%',
                    height: '100%',
                    boxSizing: 'content-box'
                }}>
                </div>
                <div style={{display: box.resizable ? 'initial' : 'none'}}>
                    <div className="helpersResizable"
                         style={{ left:  -cornerSize/2, top: -cornerSize/2, width: cornerSize, height: cornerSize, cursor: (!(box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1) ? 'nw-resize' : 'move')}}></div>
                    <div className="helpersResizable"
                         style={{ right: -cornerSize/2, top: -cornerSize/2, width: cornerSize, height: cornerSize, cursor: (!(box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1) ? 'ne-resize' : 'move')}}></div>
                    <div className="helpersResizable"
                         style={{ left:  -cornerSize/2, bottom: -cornerSize/2, width: cornerSize, height: cornerSize, cursor: (!(box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1) ? 'sw-resize' : 'move')}}></div>
                    <div className="helpersResizable"
                         style={{ right: -cornerSize/2, bottom: -cornerSize/2, width: cornerSize, height: cornerSize, cursor: (!(box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1) ? 'se-resize' : 'move')}}></div>
                </div>
            </div>
            /* jshint ignore:end */
        );


        let classes = "wholebox";
        if (box.container) {
            classes += " dnd" + box.container;
        }
        if (this.props.id === this.props.boxSelected) {
            classes += " selectedBox";
        }
        if (box.height === 'auto') {
            classes += " automaticallySizedBox";
        }

        let showOverlay;
        if (this.props.boxLevelSelected > box.level && box.children.length === 0) {
            showOverlay = "visible";
        } else if (this.props.boxLevelSelected === box.level && box.level !== 0 && !this.isAncestorOrSibling(this.props.boxSelected, this.props.id)) {
            showOverlay = "visible";
        } else {
            showOverlay = "hidden";
        }
        return (
            /* jshint ignore:start */
            <div className={classes} id={'box-'+this.props.id}
                 onClick={e => {
                    if(this.props.boxSelected === this.props.id){
                        e.stopPropagation();
                        return;
                    }
                    if(this.props.boxSelected !== -1 && box.level === 0 && !this.sameLastParent(box, this.props.boxes[this.props.boxSelected])){
                        this.props.onBoxSelected(this.props.id);
                    } else if(this.props.boxLevelSelected === box.level){
                        if(this.props.boxLevelSelected > 0){
                            this.props.onBoxSelected(this.props.id);
                        }else{
                            this.props.onBoxSelected(this.props.id);
                        }
                    }
                    if(box.parent.indexOf(ID_PREFIX_PAGE) !== -1 ||
                        box.parent.indexOf(ID_PREFIX_SECTION) !== -1 ||
                        (box.container.length && box.container.indexOf(ID_PREFIX_CONTAINED_VIEW) !== -1) ||
                        box.parent.indexOf(ID_PREFIX_SORTABLE_BOX) !== -1){
                    }
                    e.stopPropagation();
                 }}
                 onDoubleClick={(e)=> {
                     if(this.props.boxLevelSelected === box.level && box.children.length !== 0){
                        this.props.onBoxLevelIncreased();
                     }
                      else if(toolbar.config && toolbar.config.needsTextEdition && this.props.id == this.props.boxSelected){
                        this.props.onTextEditorToggled(this.props.id, true);
                        this.refs.textarea.focus();
                    }
                 }}
                 style={{
                    position: box.position.type,
                    left: box.position.x ? box.position.x : "",
                    top: box.position.y ? box.position.y : "",
                    width: box.width ,
                    height: box.height,
                    verticalAlign: toolbar.controls.main.accordions.__sortable.buttons.__verticalAlign.value ?
                        toolbar.controls.main.accordions.__sortable.buttons.__verticalAlign.value :
                        'middle' ,
                    touchAction: 'none',
                    msTouchAction: 'none',
                    cursor: vis ? 'inherit': 'default' //esto evita que aparezcan los cursores de move y resize cuando la caja no está seleccionada
                }}>
                {border}
                {content}
                {toolbar.state.__text ?
                    <div contentEditable={true} id={box.id} ref={"textarea"} className="textAreaStyle"
                         style={textareaStyle}></div> : ""}
                <div className="showOverlay" style={{ visibility: showOverlay }}></div>
            </div>
            /* jshint ignore:end */
        );
    }

    sameLastParent(clickedBox, currentBox) {
        if (currentBox.parent.indexOf(ID_PREFIX_BOX) === -1) {
            return currentBox === clickedBox;
        } else {
            return this.sameLastParent(clickedBox, this.props.boxes[currentBox.parent]);
        }
    }

    isAncestorOrSibling(searchingId, actualId) {
        if (searchingId === actualId) {
            return true;
        }
        let parentId = this.props.boxes[actualId].parent;
        if (parentId === searchingId) {
            return true;
        }
        if (parentId.indexOf(ID_PREFIX_PAGE) !== -1 || parentId.indexOf(ID_PREFIX_SECTION) !== -1) {
            return false;
        }

        if (parentId.indexOf(ID_PREFIX_SORTABLE_BOX) === -1) {
            let parentContainers = this.props.boxes[parentId].children;
            if (parentContainers.length !== 0) {
                for (let i = 0; i < parentContainers.length; i++) {
                    let containerChildren = this.props.boxes[parentId].sortableContainers[parentContainers[i]].children;
                    for (let j = 0; j < containerChildren.length; j++) {
                        if (containerChildren[j] === searchingId) {
                            return true;
                        }
                    }
                }
            }
        }

        return this.isAncestorOrSibling(searchingId, parentId);
    }

    renderChildren(markup, key) {
        let component;
        let props = {};
        let children;
        switch (markup.node) {
            case 'element':
                if (markup.attr) {
                    props = markup.attr;
                }
                props.key = key;
                if (markup.tag === 'plugin') {
                    component = PluginPlaceholder;
                    let resizable = markup.attr.hasOwnProperty("plugin-data-resizable");
                    props = Object.assign({}, props, {
                        pluginContainer: markup.attr["plugin-data-id"],
                        resizable: resizable,
                        parentBox: this.props.boxes[this.props.id],
                        boxes: this.props.boxes,
                        boxSelected: this.props.boxSelected,
                        boxLevelSelected: this.props.boxLevelSelected,
                        toolbars: this.props.toolbars,
                        lastActionDispatched: this.props.lastActionDispatched,
                        onBoxSelected: this.props.onBoxSelected,
                        onBoxLevelIncreased: this.props.onBoxLevelIncreased,
                        containedViewSelected: this.props.containedViewSelected,
                        onBoxMoved: this.props.onBoxMoved,
                        onBoxResized: this.props.onBoxResized,
                        onSortableContainerResized: this.props.onSortableContainerResized,
                        onBoxDeleted: this.props.onBoxDeleted,
                        onBoxDropped: this.props.onBoxDropped,
                        onVerticallyAlignBox: this.props.onVerticallyAlignBox,
                        onBoxModalToggled: this.props.onBoxModalToggled,
                        onBoxesInsideSortableReorder: this.props.onBoxesInsideSortableReorder,
                        onTextEditorToggled: this.props.onTextEditorToggled
                    });
                } else {
                    component = markup.tag;
                }
                break;
            case 'text':
                component = "span";
                props = {key: key};
                children = [decodeURI(markup.text)];
                break;
            case 'root':
                component = "div";
                props = {style: {width: '100%', height: '100%'}};
                break;
        }

        Object.keys(props).forEach(prop => {
            if (prop.startsWith("on")) {
                let value = props[prop];
                if (typeof value === "string") {
                    props[prop] = function () {
                    };
                }
            }
        });

        if (markup.child) {
            children = [];
            markup.child.forEach((child, index) => {
                children.push(child.node === "text" ? child.text : this.renderChildren(child, index));
            });
        }
        return React.createElement(component, props, children);
    }

    blurTextarea() {
        this.props.onTextEditorToggled(this.props.id, false);
        let toolbar = this.props.toolbars[this.props.id];
        let data = CKEDITOR.instances[this.props.id].getData();
        Dali.Plugins.get(toolbar.config.name).forceUpdate(Object.assign({}, toolbar.state, {
            __text: toolbar.config.extraTextConfig ? data : encodeURI(data)
        }), this.props.id, EDIT_PLUGIN_TEXT);
    }

    componentWillUpdate(nextProps, nextState) {
        if ((this.props.boxSelected === this.props.id) && (nextProps.boxSelected !== this.props.id) && this.props.toolbars[this.props.id].showTextEditor) {
            CKEDITOR.instances[this.props.id].focusManager.blur(true);
            this.blurTextarea();
        }
    }

    checkAspectRatioValue() {
        let toolbar = this.props.toolbars[this.props.id];
        let box = this.props.boxes[this.props.id];
        if (box && box.height && box.height === 'auto') {
            return true;
        }
        if (toolbar.config.aspectRatioButtonConfig) {
            let arb = toolbar.config.aspectRatioButtonConfig;
            if (arb.location.length === 2) {
                let comp = toolbar.controls[arb.location[0]].accordions[arb.location[1]].buttons.__aspectRatio;
                if (comp) {
                    return (comp.value === "checked");
                } else {
                    return false;
                }

            } else {
                let comp = toolbar.controls[arb.location[0]].accordions[arb.location[1]].accordions[arb.location[2]].buttons.__aspectRatio;
                if (comp) {
                    return (comp.value === "checked");
                } else {
                    return false;
                }
            }
        }

        return false;
    }

    componentDidUpdate(prevProps, prevState) {
        let toolbar = this.props.toolbars[this.props.id];
        let box = this.props.boxes[this.props.id];
        let node = ReactDOM.findDOMNode(this);

        if (toolbar.showTextEditor) {
            this.refs.textarea.focus();

        }
        if (prevProps.toolbars[this.props.id] && (toolbar.showTextEditor !== prevProps.toolbars[this.props.id].showTextEditor) && box.draggable) {
            interact(node).draggable({enabled: !toolbar.showTextEditor});
        }

        if (box.resizable) {
            interact(node).resizable({preserveAspectRatio: this.checkAspectRatioValue()});
        }

        if ((box.level > this.props.boxLevelSelected) && this.props.boxLevelSelected !== -1) {
            interact(node).draggable({enabled: false});
        } else {
            interact(node).draggable({enabled: box.draggable});
        }

        let action = this.props.lastActionDispatched;
        if ((action.type === ADD_BOX || action.type === UPDATE_BOX || action.type === RESIZE_BOX || action.type === IMPORT_STATE) &&
            ((action.payload.id || action.payload.ids.id) === this.props.id)) {
            Dali.Plugins.get(toolbar.config.name).afterRender(this.refs.content, toolbar.state);
        }
    }

    componentDidMount() {
        let toolbar = this.props.toolbars[this.props.id];
        let box = this.props.boxes[this.props.id];
        if (toolbar.config && toolbar.config.needsTextEdition) {
            CKEDITOR.disableAutoInline = true;
            for (let key in toolbar.config.extraTextConfig) {
                CKEDITOR.config[key] += toolbar.config.extraTextConfig[key] + ",";
            }
            let editor = CKEDITOR.inline(this.refs.textarea);
            if (toolbar.state.__text) {
                editor.setData(decodeURI(toolbar.state.__text));
            }
        }

        Dali.Plugins.get(toolbar.config.name).afterRender(this.refs.content, toolbar.state);
        let dragRestrictionSelector = (box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1) ? ".daliBoxSortableContainer, .drg" + box.container : "parent";
        interact(ReactDOM.findDOMNode(this))
            .draggable({
                enabled: box.draggable,
                restrict: {
                    restriction: dragRestrictionSelector,
                    elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                },
                autoScroll: true,
                onstart: (event) => {
                    // If contained in smth different from ContainedCanvas (sortableContainer || PluginPlaceHolder), clone the node and hide the original
                    if (box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1) {
                        let original = event.target;
                        let parent = original;
                        //Find real parent to append clone
                        let iterate = true;
                        while (iterate) {
                            parent = parent.parentNode;
                            if (parent.className && (parent.className.indexOf("daliBoxSortableContainer") !== -1 || parent.className.indexOf("drg" + box.container) !== -1)) {
                                iterate = false;
                            }
                        }
                        //Clone, assign values and hide original
                        let clone = original.cloneNode(true);
                        let originalRect = original.getBoundingClientRect();
                        let parentRect = parent.getBoundingClientRect();
                        let x = originalRect.left - parentRect.left;
                        let y = originalRect.top - parentRect.top;
                        clone.setAttribute("id", "clone");
                        clone.setAttribute('data-x', x);
                        clone.setAttribute('data-y', y);
                        clone.style.left = 0 + 'px';
                        clone.style.top = 0 + 'px';
                        original.setAttribute('data-x', x);
                        original.setAttribute('data-y', y);
                        clone.style.position = 'absolute';
                        parent.appendChild(clone);
                        clone.style.webkitTransform = clone.style.transform = 'translate(' + (x) + 'px, ' + (y) + 'px)';
                        clone.style.height = originalRect.height + "px";
                        clone.style.width = originalRect.width + "px";
                        clone.style.border = "1px dashed #555";
                        original.style.opacity = 0;
                    }
                },
                onmove: (event) => {
                    if (this.props.boxSelected !== this.props.id) {
                        this.props.onBoxSelected(this.props.id);
                    }

                    // Hide DaliShortcuts
                    let bar = this.props.containedViewSelected === 0 ?
                        document.getElementById('daliBoxIcons') :
                        document.getElementById('contained_daliBoxIcons');
                    bar.classList.add('hidden');

                    // Level has to be the same to drag a box, unless a sortableContainer is selected, then it should allow level 0 boxes
                    if ((box.level - this.props.boxLevelSelected) === 0 || (box.level === 0 && this.props.boxLevelSelected === -1)) {
                        // If box not in a sortableContainer or PluginPlaceHolder, just drag
                        if (!(box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1)) {
                            let target = event.target;

                            target.style.left = (parseInt(target.style.left) || 0) + event.dx + 'px';
                            target.style.top = (parseInt(target.style.top) || 0) + event.dy + 'px';
                            target.style.zIndex = '9999';
                            // Else, drag the clone and update values in attributes in both elements
                        } else {
                            let target = document.getElementById('clone');
                            let original = document.getElementById('box-' + this.props.id);
                            let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                            let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                            target.style.webkitTransform =
                                target.style.transform =
                                    'translate(' + (x) + 'px, ' + (y) + 'px)';
                            target.style.zIndex = '9999';

                            target.setAttribute('data-x', x);
                            target.setAttribute('data-y', y);
                            original.setAttribute('data-x', x);
                            original.setAttribute('data-y', y);
                        }
                    }
                },
                onend: (event) => {
                    if (this.props.boxSelected !== this.props.id) {
                        return;
                    }

                    let target = event.target;
                    if (!target.parentElement) {
                        return;
                    }

                    // Get position and if contained in sortableContainer || PluginPlaceHolder, convert to %
                    let pos = this.props.boxes[this.props.id].position.type;
                    let actualLeft = pos === 'relative' ? target.style.left : target.getAttribute('data-x');
                    let actualTop = pos === 'relative' ? target.style.top : target.getAttribute('data-y');
                    let left = Math.max(Math.min(Math.floor(parseInt(actualLeft) / target.parentElement.offsetWidth * 100), 100), 0) + '%';
                    let top = Math.max(Math.min(Math.floor(parseInt(actualTop) / target.parentElement.offsetHeight * 100), 100), 0) + '%';
                    target.style.left = box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1 ? left : target.style.left;
                    target.style.top = box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1 ? top : target.style.top;
                    target.style.zIndex = 'initial';

                    // Delete clone and unhide original
                    if (box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1) {
                        let clone = document.getElementById('clone');
                        if (clone) {
                            clone.parentElement.removeChild(clone);
                        }
                        target.style.opacity = 1;
                    }

                    this.props.onBoxMoved(
                        this.props.id,
                        box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1 ? left : Math.max(parseInt(target.style.left), 0) + 'px',
                        box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1 ? top : Math.max(parseInt(target.style.top), 0) + 'px',
                        this.props.boxes[this.props.id].position.type
                    );

                    // Stuff to reorder boxes when position is absolute
                    // TODO: learn how it works
                    let releaseClick = document.elementFromPoint(event.clientX, event.clientY);
                    if (releaseClick) {
                        let release = releaseClick.getAttribute('id') || "noid";
                        let counter = 5;
                        while (release && release.indexOf('box-bo') === -1 && counter > 0 && releaseClick.parentNode) {
                            releaseClick = releaseClick.parentNode;
                            if (releaseClick) {
                                release = releaseClick.getAttribute('id') || "noid";
                            } else {
                                counter = 0;
                                break;
                            }
                            counter--;
                        }
                        if (counter > 0 && release && release.indexOf('box-bo') !== -1) {
                            let partialID = release.split('box-');
                            if (partialID && partialID.length > 0) {
                                let hoverID = partialID[1];
                                let box = this.props.boxes[this.props.id];
                                if (box && box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1) {
                                    let children = this.props.boxes[box.parent].sortableContainers[box.container].children;
                                    if (children.indexOf(hoverID) !== -1) {
                                        let newOrder = Object.assign([], children);
                                        newOrder.splice(newOrder.indexOf(hoverID), 0, newOrder.splice(newOrder.indexOf(box.id), 1)[0]);
                                        this.props.onBoxesInsideSortableReorder(box.parent, box.container, newOrder);
                                    }
                                }
                            }

                        }
                    }

                    // Unhide DaliShortcuts

                    let bar = this.props.containedViewSelected === 0 ?
                        document.getElementById('daliBoxIcons') :
                        document.getElementById('contained_daliBoxIcons');
                    bar.classList.remove('hidden');

                    event.stopPropagation();
                }
            })
            .ignoreFrom('input, textarea, .textAreaStyle,  a')
            .resizable({
                preserveAspectRatio: this.checkAspectRatioValue(),
                enabled: (box.resizable),
                restrict: {
                    restriction: "parent",
                    elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                },
                edges: {left: true, right: true, bottom: true, top: true},
                onstart: (event) => {
                    // Hide DaliShortcuts
                    let bar = this.props.containedViewSelected === 0 ?
                        document.getElementById('daliBoxIcons') :
                        document.getElementById('contained_daliBoxIcons');
                    bar.classList.add('hidden');

                    //Append textbox with actual size
                    let sb = document.getElementsByClassName('selectedBox');
                    if (sb && ('box-' + this.props.boxSelected) === sb[0].getAttribute('id')) {
                        var span = document.createElement("span");
                        span.setAttribute("id", "sizing");
                        var t = document.createTextNode(" ");
                        sb[0].appendChild(span);

                    }
                },
                onmove: (event) => {
                    if (this.props.boxSelected !== this.props.id) {
                        return;
                    }

                    let target = event.target;
                    let x = (parseFloat(target.getAttribute('data-x')) || 0);
                    let y = (parseFloat(target.getAttribute('data-y')) || 0);

                    // update the element's style
                    target.style.width = event.rect.width + 'px';
                    target.style.height = event.rect.height + 'px';

                    // translate when resizing from top or left edges
                    x += event.deltaRect.left;
                    y += event.deltaRect.top;

                    target.style.webkitTransform = target.style.transform =
                        'translate(' + x + 'px,' + y + 'px)';

                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);

                    // Update size in textbox
                    let span = document.getElementById('sizing');
                    if (span) {
                        span.innerHTML = parseInt(target.style.width) + " × " + parseInt(target.style.height);
                    }
                },
                onend: (event) => {
                    if (this.props.boxSelected !== this.props.id) {
                        return;
                    }
                    // If contained in sortableContainer || PluginPlaceHolder, convert to %
                    let target = event.target;
                    let width = Math.min(Math.floor(parseInt(target.style.width) / target.parentElement.offsetWidth * 100), 100) + '%';
                    let height = Math.min(Math.floor(parseInt(target.style.height) / target.parentElement.offsetHeight * 100), 100) + '%';
                    this.props.onBoxResized(
                        this.props.id,
                        box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1 ? width : parseInt(target.style.width),
                        box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1 ? height : parseInt(target.style.height));

                    if(box.position.x !== target.style.left || box.position.y !== target.style.top) {
                        this.props.onBoxMoved(this.props.id, target.style.left, target.style.top, this.props.boxes[this.props.id].position.type);
                    }

                    // Unhide DaliShorcuts and remove size textbox
                    let bar = this.props.containedViewSelected === 0 ?
                        document.getElementById('daliBoxIcons') :
                        document.getElementById('contained_daliBoxIcons');
                    bar.classList.remove('hidden');
                    let span = document.getElementById('sizing');
                    if (span) {
                        span.parentElement.removeChild(span);
                    }

                    event.stopPropagation();
                }
            });
    }

    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this)).unset();
        if (CKEDITOR.instances[this.props.id]) {
            if (CKEDITOR.instances[this.props.id].focusManager.hasFocus) {
                this.blurTextarea();
            }
            CKEDITOR.instances[this.props.id].destroy();
        }
    }
}

