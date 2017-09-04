import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import MarkCreator from '../../rich_plugins/mark_creator/MarkCreator';
import interact from 'interact.js';
import PluginPlaceholder from '../plugin_placeholder/PluginPlaceholder';
import { ADD_BOX, UPDATE_BOX, RESIZE_BOX, EDIT_PLUGIN_TEXT, IMPORT_STATE } from '../../../../common/actions';
import Dali from './../../../../core/main';
import i18n from 'i18next';
import { isSortableBox, isSortableContainer, isAncestorOrSibling, isContainedView } from '../../../../common/utils';

require('./_daliBox.scss');

/**
 * Dali Box component.
 * @desc It is the main and more complex component by far. It is the one in charge of painting a plugin's template and therefore it has many parts conditioned to the type of plugin.
 */
export default class DaliBox extends Component {
    /**
     * Constructor
     * @param props React component props
     */
    constructor(props) {
        super(props);
        /**
         * Box border size
         * @type {number}
         */
        this.borderSize = 2;
    }

    /**
     * Renders React Component
     * @returns {code} React rendered component
     */
    render() {

        let cornerSize = 15;
        let box = this.props.boxes[this.props.id];

        let toolbar = this.props.toolbars[this.props.id];
        let vis = this.props.boxSelected === this.props.id;
        let style = {
            visibility: (toolbar.showTextEditor ? 'hidden' : 'visible'),
        };

        let textareaStyle = {
            height: (toolbar.showTextEditor ? '100%' : '100%'),
            // border: 'dashed black 1px',
            display: (toolbar.showTextEditor ? 'block' : 'none'),
        };
        let attrs = {};
        let width;
        let height;
        let classNames = "";

        if (toolbar.config.needsTextEdition) {
            textareaStyle.textAlign = "left";
            style.textAlign = "left";
        }

        for (let tabKey in toolbar.controls) {
            for (let accordionKey in toolbar.controls[tabKey].accordions) {
                let button;
                for (let buttonKey in toolbar.controls[tabKey].accordions[accordionKey].buttons) {
                    button = toolbar.controls[tabKey].accordions[accordionKey].buttons[buttonKey];
                    if (!button.isAttribute) {
                        if (button.autoManaged) {
                            if (buttonKey === 'className' && button.value) {
                                classNames += button.value;
                            } else if (buttonKey === '__width') {
                                width = button.displayValue + (button.type === "number" ? button.units : "");
                            } else if (buttonKey === '__height') {
                                height = button.displayValue + (button.type === "number" ? button.units : "");
                            } else {
                                style[buttonKey] = button.value;
                            }
                        }
                    } else {
                        attrs['data-' + buttonKey] = button.value;
                    }

                    /* Unused */
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
                            if (!button.isAttribute) {
                                if (button.autoManaged) {
                                    if (buttonKey === 'className' && button.value) {
                                        classNames += button.value;
                                    } else {
                                        style[buttonKey] = button.value;
                                    }
                                }
                            } else {
                                attrs['data-' + buttonKey] = button.value;
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

        Object.assign(textareaStyle, style);
        textareaStyle.visibility = 'visible';

        let wholeBoxStyle = {
            position: box.position.type,
            left: box.position.x ? box.position.x : "",
            top: box.position.y ? box.position.y : "",
            width: width,
            height: height,
            verticalAlign: verticalAlign,
            touchAction: 'none',
            msTouchAction: 'none',
            cursor: vis ? 'inherit' : 'default', // esto evita que aparezcan los cursores de move y resize cuando la caja no está seleccionada
        };

        let rotate = 'rotate(0deg)';
        if (!(this.props.markCreatorId && this.props.id === this.props.boxSelected)) {
            if (toolbar.controls.main.accordions.__sortable.buttons.__rotate && toolbar.controls.main.accordions.__sortable.buttons.__rotate.value) {
                rotate = 'rotate(' + toolbar.controls.main.accordions.__sortable.buttons.__rotate.value + 'deg)';
            }
        }
        wholeBoxStyle.transform = wholeBoxStyle.WebkitTransform = wholeBoxStyle.MsTransform = rotate;
        // style.transform = style.WebkitTransform = style.MsTransform = rotate;

        let content = toolbar.config.flavor === "react" ? (
            <div style={style} {...attrs} className={"boxStyle " + classNames} ref={"content"}>
                {box.content}
            </div>
        ) : (
            <div style={style} {...attrs} className={"boxStyle " + classNames} ref={"content"}>
                {this.renderChildren(box.content)}
            </div>
        );
        let border = (
            <div style={{ visibility: (vis ? 'visible' : 'hidden') }}>
                <div style={{
                    position: 'absolute',
                    top: -(this.borderSize),
                    left: -(this.borderSize),
                    width: '100%',
                    height: '100%',
                    boxSizing: 'content-box',
                }} />
                <div style={{ display: box.resizable ? 'initial' : 'none' }}>
                    <div className="helpersResizable"
                        style={{ left: -cornerSize / 2, top: -cornerSize / 2, width: cornerSize, height: cornerSize, cursor: (!isSortableContainer(box.container) ? 'nw-resize' : 'move') }} />
                    <div className="helpersResizable"
                        style={{ right: -cornerSize / 2, top: -cornerSize / 2, width: cornerSize, height: cornerSize, cursor: (!isSortableContainer(box.container) ? 'ne-resize' : 'move') }} />
                    <div className="helpersResizable"
                        style={{ left: -cornerSize / 2, bottom: -cornerSize / 2, width: cornerSize, height: cornerSize, cursor: (!isSortableContainer(box.container) ? 'sw-resize' : 'move') }} />
                    <div className="helpersResizable"
                        style={{ right: -cornerSize / 2, bottom: -cornerSize / 2, width: cornerSize, height: cornerSize, cursor: (!isSortableContainer(box.container) ? 'se-resize' : 'move') }} />
                </div>
            </div>
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

        let showOverlay = "none";
        // If current level selected is bigger than this box's and it has no children, show overlay
        if (this.props.boxLevelSelected > box.level && box.children.length === 0) {
            showOverlay = "initial";
        // If current level selected is the same but this box belongs to another "tree" of boxes, show overlay
        } else if (this.props.boxLevelSelected === box.level &&
                   box.level !== 0 &&
                   !isAncestorOrSibling(this.props.boxSelected, this.props.id, this.props.boxes)) {
            showOverlay = "initial";
        }
        let verticalAlign = "top";
        if (isSortableBox(box.container)) {
            if (toolbar.controls.main.accordions.__sortable.buttons.__verticalAlign && toolbar.controls.main.accordions.__sortable.buttons.__verticalAlign.value) {
                verticalAlign = toolbar.controls.main.accordions.__sortable.buttons.__verticalAlign.value;
            } else {
                verticalAlign = 'top';
            }
        }

        /* <MarkCreator/>*/
        return (
            <div className={classes} id={'box-' + this.props.id}
                onClick={e => {
                    // If there's no box selected and current's level is 0 (otherwise, it would select a deeper box)
                    // or -1 (only DaliBoxSortable can have level -1)
                    if((this.props.boxSelected === -1 || this.props.boxLevelSelected === -1) && box.level === 0) {
                        this.props.onBoxSelected(this.props.id);
                        e.stopPropagation();
                        return;
                    }
                    // Last parent has to be the same, otherwise all boxes with same level would be selectable
                    if(this.props.boxLevelSelected === box.level &&
                       isAncestorOrSibling(this.props.boxSelected, this.props.id, this.props.boxes)) {
                        if(e.nativeEvent.ctrlKey && box.children.length !== 0) {
                            this.props.onBoxLevelIncreased();
                        }else if(this.props.boxSelected !== this.props.id) {
                            this.props.onBoxSelected(this.props.id);
                        }
                    }
                    if(this.props.boxSelected !== -1 && this.props.boxLevelSelected === 0) {
                        this.props.onBoxSelected(this.props.id);
                        e.stopPropagation();
                    }
                    if(box.level === 0) {
                        e.stopPropagation();
                    }
                }}
                onDoubleClick={(e)=> {
                    if(toolbar.config && toolbar.config.needsTextEdition && this.props.id === this.props.boxSelected) {
                        this.props.onTextEditorToggled(this.props.id, true);
                        this.refs.textarea.focus();
                        // Elimina el placeholder "Introduzca texto aquí" cuando se va a editar
                        // Código duplicado en DaliBox, DaliShortcuts y PluginToolbar. Extraer a common_tools?
                        let CKstring = CKEDITOR.instances[this.props.id].getData();
                        let initString = "<p>" + i18n.t("text_here") + "</p>\n";
                        if(CKstring === initString) {
                            CKEDITOR.instances[this.props.id].setData("");
                        }
                    }
                }}
                style={wholeBoxStyle}>
                {border}
                {/* content */}
                {/* The previous line was changed for the next one in order to make the box grow when text grows while editing.
                 To disable this, you also have to change the textareastyle to an absolute position div, and remove the float property*/}
                {toolbar.showTextEditor ? null : content }
                {toolbar.state.__text ?
                    <div id={box.id}
                        ref={"textarea"}
                        className={classNames + " textAreaStyle"}
                        contentEditable
                        style={textareaStyle} /> :
                    null
                }
                <div className="boxOverlay" style={{ display: showOverlay }} />
                <MarkCreator
                    addMarkShortcut={this.props.addMarkShortcut}
                    onBoxAdded={this.props.onBoxAdded}
                    boxSelected={this.props.boxSelected}
                    content={this.refs.content}
                    containedViews={this.props.containedViews}
                    toolbar={toolbar ? toolbar : {}}
                    deleteMarkCreator={this.props.deleteMarkCreator}
                    parseRichMarkInput={Dali.Plugins.get(toolbar.config.name).parseRichMarkInput}
                    markCreatorId={this.props.markCreatorId}
                    currentId={this.props.id}
                    pageType={this.props.pageType}
                />
            </div>
        );
    }

    /**
     * Renders box children
     * @param markup Content
     * @param key Unique React key
     * @returns {children} React components for the box children
     */
    renderChildren(markup, key) {
        let component;
        let props = {};
        let children = null;
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
                    onTextEditorToggled: this.props.onTextEditorToggled,
                });
            } else {
                component = markup.tag;
            }
            break;
        case 'text':
            component = "span";
            props = { key: key };
            children = [decodeURI(markup.text)];
            break;
        case 'root':
            component = "div";
            props = { style: { width: '100%', height: '100%' } };
            break;
        }

        Object.keys(props).forEach(prop => {
            if (prop.startsWith("on")) {
                let value = props[prop];
                if (typeof value === "string") {
                    props[prop] = function() {
                    };
                }
            }
        });

        if (markup.child) {
            if (markup.child.length === 1 && markup.child[0].node === "text") {
                props.dangerouslySetInnerHTML = {
                    __html: decodeURI(markup.child[0].text),
                };
            } else {
                children = [];
                markup.child.forEach((child, index) => {
                    children.push(this.renderChildren(child, index));
                });
            }
        }
        return React.createElement(component, props, children);
    }

    /**
     * Blurs text area and saves data
     */
    blurTextarea() {
        this.props.onTextEditorToggled(this.props.id, false);
        let toolbar = this.props.toolbars[this.props.id];
        let data = CKEDITOR.instances[this.props.id].getData();
        if(data.length === 0) {
            data = i18n.t("text_here");
            CKEDITOR.instances[this.props.id].setData(i18n.t("text_here"));
        }
        Dali.Plugins.get(toolbar.config.name).forceUpdate(Object.assign({}, toolbar.state, {
            __text: toolbar.config.extraTextConfig ? data : encodeURI(data),
        }), this.props.id, EDIT_PLUGIN_TEXT);
    }

    /**
     * Before component updates
     * Blurs CKEditor area
     * @param nextProps React next props
     * @param nextState React next state
     */
    componentWillUpdate(nextProps, nextState) {
        if ((this.props.boxSelected === this.props.id) && (nextProps.boxSelected !== this.props.id) && this.props.toolbars[this.props.id].showTextEditor) {
            CKEDITOR.instances[this.props.id].focusManager.blur(true);
            this.blurTextarea();
        }
    }

    /**
     * Checks if aspect ratio should be kept when resizing the box
     * @returns {boolean} true if aspect ratio shoud be kept, false otherwise
     */
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
                    return comp.checked;
                }
                return false;

            }
            let comp = toolbar.controls[arb.location[0]].accordions[arb.location[1]].accordions[arb.location[2]].buttons.__aspectRatio;
            if (comp) {
                return comp.checked;
            }
            return false;

        }

        return false;
    }

    /**
     * After component updates
     * Update CKEditor and interact objects bases on updates
     * @param prevProps React previous props
     * @param prevState React previous state
     */
    componentDidUpdate(prevProps, prevState) {
        let toolbar = this.props.toolbars[this.props.id];
        let box = this.props.boxes[this.props.id];
        let node = ReactDOM.findDOMNode(this);

        if (toolbar.showTextEditor) {
            this.refs.textarea.focus();

        }
        if (prevProps.toolbars[this.props.id] && (toolbar.showTextEditor !== prevProps.toolbars[this.props.id].showTextEditor) && box.draggable) {
            interact(node).draggable({ enabled: !toolbar.showTextEditor });
        }

        if (box.resizable) {
            interact(node).resizable({ preserveAspectRatio: this.checkAspectRatioValue() });
        }

        if ((box.level > this.props.boxLevelSelected) && this.props.boxLevelSelected !== -1) {
            interact(node).draggable({ enabled: false });
        } else {
            interact(node).draggable({ enabled: box.draggable });
        }

        let action = this.props.lastActionDispatched;

        if ((action.type === "@@redux-undo/UNDO" || action.type === "@@redux-undo/REDO") && this.props.toolbars[this.props.id].config.needsTextEdition) {
            CKEDITOR.instances[this.props.id].setData(decodeURI(this.props.toolbars[this.props.id].state.__text));
        }

        if (action.type === "DELETE_BOX" && this.props.toolbars[this.props.id].config.needsTextEdition) {
            for (let instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].destroy();
            }
            CKEDITOR.inlineAll();
            for (let editor in CKEDITOR.instances) {
                if (this.props.toolbars[editor].state.__text) {
                    CKEDITOR.instances[editor].setData(decodeURI(this.props.toolbars[editor].state.__text));
                }
            }
        }
        if(this.props.toolbars[this.props.id].config.needsTextEdition) {
            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
        }
        if (action.type === "@@redux-undo/UNDO") {
            Dali.Plugins.get(toolbar.config.name).afterRender(this.refs.content, toolbar.state);

        }
        if ((action.type === ADD_BOX || action.type === UPDATE_BOX || action.type === RESIZE_BOX || action.type === IMPORT_STATE) &&
            ((action.payload.id || action.payload.ids.id) === this.props.id)) {
            Dali.Plugins.get(toolbar.config.name).afterRender(this.refs.content, toolbar.state);
        }

    }

    /**
     * After component mounts
     * Get CKEditor instances and set interact listeners for box manipulation
     */
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
        let offsetEl = document.getElementById('maincontent') ? document.getElementById('maincontent').getBoundingClientRect() : {};
        let leftO = offsetEl.left || 0;
        let topO = offsetEl.top || 0;
        offsetEl;
        let gridTarget = interact.createSnapGrid({ x: 10, y: 10, range: 7.1, offset: { x: leftO, y: topO } });
        Dali.Plugins.get(toolbar.config.name).afterRender(this.refs.content, toolbar.state);
        let dragRestrictionSelector = isSortableContainer(box.container) ? ".daliBoxSortableContainer, .drg" + box.container : "parent";
        interact(ReactDOM.findDOMNode(this))
            /* .snap({
                actions     : ['resizex', 'resizey', 'resizexy', 'resize', 'drag'],
                mode        : 'grid'
            })*/
            .draggable({
                /* snap: {
                    targets: [gridTarget],
                    relativePoints: [{ x: 0, y: 0 }]
                },*/
                enabled: box.draggable,
                restrict: {
                    restriction: dragRestrictionSelector,
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                },
                autoScroll: true,
                onstart: (event) => {
                    // If contained in smth different from ContainedCanvas (sortableContainer || PluginPlaceHolder), clone the node and hide the original
                    if (isSortableContainer(box.container)) {
                        let original = event.target;
                        let parent = original;
                        // Find real parent to append clone
                        let iterate = true;
                        while (iterate) {
                            parent = parent.parentNode;
                            if (parent.className && (parent.className.indexOf("daliBoxSortableContainer") !== -1 || parent.className.indexOf("drg" + box.container) !== -1)) {
                                iterate = false;
                            }
                        }
                        // Clone, assign values and hide original
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
                        clone.style.WebkitTransform = clone.style.transform = 'translate(' + (x) + 'px, ' + (y) + 'px)';
                        clone.style.height = originalRect.height + "px";
                        clone.style.width = originalRect.width + "px";
                        clone.style.border = "1px dashed #555";

                        original.style.opacity = 0;
                    } else if (isContainedView(box.container)) {
                        let target = event.target;
                        target.style.left = this.getElementPositionFromLeft(target.style.left, target.parentElement.offsetWidth) + "px";
                        target.style.top = target.parentElement.offsetHeight * (parseFloat(target.style.top) / 100) + "px";
                    } else {
                        let target = event.target;
                        let topInPix = target.parentElement.offsetHeight * (parseFloat(target.style.top) / 100);
                        let leftInPix = target.parentElement.offsetWidth * (parseFloat(target.style.left) / 100);

                        target.style.top = topInPix + "px";
                        target.style.left = leftInPix + "px";

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
                        if (!isSortableContainer(box.container)) {
                            let target = event.target;
                            target.style.left = (parseInt(target.style.left, 10) || 0) + event.dx + 'px';
                            target.style.top = (parseInt(target.style.top, 10) || 0) + event.dy + 'px';
                            target.style.zIndex = '9999';

                            // Else, drag the clone and update values in attributes in both elements
                        } else {
                            let target = document.getElementById('clone');
                            let original = document.getElementById('box-' + this.props.id);
                            let x = (parseFloat(target.getAttribute('data-x'), 10) || 0) + event.dx;
                            let y = (parseFloat(target.getAttribute('data-y'), 10) || 0) + event.dy;
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
                    let absoluteLeft = (((parseFloat(target.style.left) * 100) / target.parentElement.offsetWidth) > 100) ?
                        ((target.parentElement.offsetWidth - (parseFloat(target.style.width))) / target.parentElement.offsetWidth) * 100 + "%" :
                        ((parseFloat(target.style.left) * 100) / target.parentElement.offsetWidth) + "%";
                    /* let absoluteTop = target.getAttribute('data-y') + Math.max(parseInt(target.style.top, 10), 0) >0 ?
                        (target.getAttribute('data-y') + Math.max(parseInt(target.style.top, 10), 0))/ target.parentElement.offsetHeight * 100 + "%" :
                        "0%";*/
                    let absoluteTop = (parseFloat(target.style.top) * 100) / target.parentElement.offsetHeight + "%";
                    let left = Math.max(Math.min(Math.floor(parseFloat(actualLeft) / target.parentElement.offsetWidth * 100), 100), 0) + '%';
                    let top = Math.max(Math.min(Math.floor(parseFloat(actualTop) / target.parentElement.offsetHeight * 100), 100), 0) + '%';

                    if (isSortableContainer(box.container)) {
                        target.style.left = left;
                        target.style.top = top;
                    } else {
                        target.style.left = absoluteLeft;
                        target.style.top = absoluteTop;
                    }

                    target.style.zIndex = 'initial';

                    // Delete clone and unhide original
                    if (isSortableContainer(box.container)) {
                        let clone = document.getElementById('clone');
                        if (clone) {
                            clone.parentElement.removeChild(clone);
                        }
                        target.style.opacity = 1;
                    }

                    this.props.onBoxMoved(
                        this.props.id,
                        isSortableContainer(box.container) ? left : absoluteLeft,
                        isSortableContainer(box.container) ? top : absoluteTop,
                        this.props.boxes[this.props.id].position.type,
                        box.parent,
                        box.container
                    );

                    // Stuff to reorder boxes when position is relative
                    // TODO: learn how it works
                    let releaseClick = document.elementFromPoint(event.clientX, event.clientY);
                    if (releaseClick) {
                        // Get element that has been clicked
                        let release = releaseClick.getAttribute('id') || "noid";
                        let counter = 7;
                        // Check recursively the parent of the element clicked to check if any of them is a box
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
                                let boxOb = this.props.boxes[this.props.id];
                                if (boxOb && isSortableContainer(boxOb.container)) {
                                    let children = this.props.boxes[boxOb.parent].sortableContainers[boxOb.container].children;
                                    if (children.indexOf(hoverID) !== -1) {
                                        let newOrder = Object.assign([], children);
                                        newOrder.splice(newOrder.indexOf(hoverID), 0, newOrder.splice(newOrder.indexOf(boxOb.id), 1)[0]);
                                        this.props.onBoxesInsideSortableReorder(boxOb.parent, boxOb.container, newOrder);
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
                },
            })
            .ignoreFrom('input, textarea, .textAreaStyle,  a, .pointerEventsEnabled')
            .resizable({
                /* snap: { targets: [gridTarget] },*/
                preserveAspectRatio: this.checkAspectRatioValue(),
                enabled: (box.resizable),
                restrict: {
                    restriction: "parent",
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                },
                edges: { left: true, right: true, bottom: true, top: true },
                onstart: (event) => {
                    // Hide DaliShortcuts
                    let bar = this.props.containedViewSelected === 0 ?
                        document.getElementById('daliBoxIcons') :
                        document.getElementById('contained_daliBoxIcons');
                    bar.classList.add('hidden');

                    // Append textbox with actual size
                    let sb = document.getElementsByClassName('selectedBox');
                    if (sb && ('box-' + this.props.boxSelected) === sb[0].getAttribute('id')) {
                        let span = document.createElement("span");
                        span.setAttribute("id", "sizing");
                        let t = document.createTextNode(" ");
                        sb[0].appendChild(span);

                    }
                },
                onmove: (event) => {
                    if (this.props.boxSelected !== this.props.id) {
                        return;
                    }

                    let target = event.target;
                    let x = (parseFloat(target.getAttribute('data-x'), 10) || 0);
                    let y = (parseFloat(target.getAttribute('data-y'), 10) || 0);

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
                        span.innerHTML = parseInt(target.style.width, 10) + " × " + parseInt(target.style.height, 10);
                    }
                },
                onend: (event) => {
                    if (this.props.boxSelected !== this.props.id) {
                        return;
                    }
                    // Calculate new button values
                    let target = event.target;
                    let widthButton = Object.assign({}, this.props.toolbars[this.props.id].controls.main.accordions.__sortable.buttons.__width);
                    let heightButton = Object.assign({}, this.props.toolbars[this.props.id].controls.main.accordions.__sortable.buttons.__height);

                    // Units can be either % or px
                    if (widthButton.units === "%") {
                        let newWidth = Math.min(Math.floor(parseFloat(target.style.width) / target.parentElement.offsetWidth * 100), 100);
                        // Update display value if it's not "auto"
                        if (widthButton.displayValue !== "auto") {
                            widthButton.displayValue = newWidth;
                        }
                        widthButton.value = newWidth;
                    } else {
                        if (widthButton.displayValue !== "auto") {
                            widthButton.displayValue = parseFloat(target.style.width);
                        }
                        widthButton.value = parseFloat(target.style.width);
                    }

                    if (heightButton.units === "%") {
                        let newHeight = Math.min(Math.floor(parseFloat(target.style.height) / target.parentElement.offsetHeight * 100), 100);
                        if (heightButton.displayValue !== "auto") {
                            heightButton.displayValue = newHeight;
                            heightButton.value = newHeight;
                        }
                    } else if (heightButton.displayValue !== "auto") {
                        heightButton.displayValue = parseFloat(target.style.height);
                        heightButton.value = parseFloat(target.style.height);
                    }

                    target.style.width = widthButton.displayValue === 'auto' ? 'auto' : widthButton.value + widthButton.units;
                    target.style.height = heightButton.displayValue === 'auto' ? 'auto' : heightButton.value + heightButton.units;
                    this.props.onBoxResized(this.props.id, widthButton, heightButton);
                    if (box.position.x !== target.style.left || box.position.y !== target.style.top) {
                        target.style.left = (parseFloat(target.style.left) / 100 * target.parentElement.offsetWidth + parseFloat(target.getAttribute('data-x'))) * 100 / target.parentElement.offsetWidth + '%';
                        target.style.top = (parseFloat(target.style.top) / 100 * target.parentElement.offsetHeight + parseFloat(target.getAttribute('data-y'))) * 100 / target.parentElement.offsetHeight + '%';
                        this.props.onBoxMoved(this.props.id, target.style.left, target.style.top, this.props.boxes[this.props.id].position.type, this.props.parent, this.props.container);
                    }
                    target.style.webkitTransform = target.style.transform =
                        'translate(0px, 0px)';

                    target.setAttribute('data-x', 0);
                    target.setAttribute('data-y', 0);

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
                },
            });

    }

    /**
     * Calculate element position from left
     * @param left element's left
     * @param width element's width
     * @returns {position} Position from left
     */
    getElementPositionFromLeft(left, width) {
        if(left.indexOf("px") !== -1) {
            return left;
        } else if(left.indexOf("%") !== -1) {
            return width * parseFloat(left) / 100;
        }
        return 0;
    }

    /**
     * Before component unmounts
     * Unset interact listeners and destroy current CKEditor instances
     */
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
/**
 * Default props
 * @type {{id: (*), boxes: shim, boxSelected: shim, boxLevelSelected: shim, containedViews: shim, containedViewSelected: shim, toolbars: shim, lastActionDispatched: shim, addMarkShortcut: shim, deleteMarkCreator: shim, markCreatorId: shim, onBoxAdded: shim, onBoxSelected: shim, onBoxLevelIncreased: shim, onBoxMoved: shim, onBoxResized: shim, onBoxDropped: shim, onVerticallyAlignBox: shim, onBoxModalToggled: shim, onBoxesInsideSortableReorder: shim, onSortableContainerResized: shim, onTextEditorToggled: shim, pageType: shim}}
 */
DaliBox.defaultProps = {
    id: PropTypes.string.isRequired,
    // key: PropTypes.string.isRequired,
    boxes: PropTypes.object,
    boxSelected: PropTypes.string,
    boxLevelSelected: PropTypes.number,
    containedViews: PropTypes.object,
    containedViewSelected: PropTypes.string,
    toolbars: PropTypes.object,
    lastActionDispatched: PropTypes.string,
    addMarkShortcut: PropTypes.func,
    deleteMarkCreator: PropTypes.func,
    markCreatorId: PropTypes.string,
    onBoxAdded: PropTypes.func,
    onBoxSelected: PropTypes.func,
    onBoxLevelIncreased: PropTypes.func,
    onBoxMoved: PropTypes.func,
    onBoxResized: PropTypes.func,
    onBoxDropped: PropTypes.func,
    onVerticallyAlignBox: PropTypes.func,
    onBoxModalToggled: PropTypes.func,
    onBoxesInsideSortableReorder: PropTypes.func,
    onSortableContainerResized: PropTypes.func,
    onTextEditorToggled: PropTypes.func,
    pageType: PropTypes.string,
};
