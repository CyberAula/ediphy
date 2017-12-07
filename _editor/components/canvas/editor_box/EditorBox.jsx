import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import MarkCreator from '../../rich_plugins/mark_creator/MarkCreator';
import interact from 'interactjs';
import PluginPlaceholder from '../plugin_placeholder/PluginPlaceholder';
import { EDIT_PLUGIN_TEXT } from '../../../../common/actions';
import Ediphy from '../../../../core/editor/main';
import { isSortableBox, isSortableContainer, isAncestorOrSibling, isContainedView } from '../../../../common/utils';
import './_editorBox.scss';
import { ID_PREFIX_SORTABLE_CONTAINER } from '../../../../common/constants';
import CKEDitorComponent from './CKEDitorComponent';
/**
 * Ediphy Box component.
 * @desc It is the main and more complex component by far. It is the one in charge of painting a plugin's template and therefore it has many parts conditioned to the type of plugin.
 */
export default class EditorBox extends Component {
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
        this.blurTextarea = this.blurTextarea.bind(this);
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
                {Ediphy.Plugins.get(toolbar.config.name).getRenderTemplate(toolbar.state)}
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
            classes += " dnd";// + box.container;
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
        wholeBoxStyle.verticalAlign = verticalAlign;

        /* <MarkCreator/>*/
        return (
            <div className={classes} id={'box-' + this.props.id}
                role="presentation"
                onClick={e => {
                    // If there's no box selected and current's level is 0 (otherwise, it would select a deeper box)
                    // or -1 (only EditorBoxSortable can have level -1)
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

                    }
                }}
                style={wholeBoxStyle}>
                {border}
                {/* content */}
                {/* The previous line was changed for the next one in order to make the box grow when text grows while editing.
                 To disable this, you also have to change the textareastyle to an absolute position div, and remove the float property*/}
                {toolbar.showTextEditor ? null : content }
                {toolbar.state.__text ? <CKEDitorComponent key={"ck-" + this.props.id} boxSelected={this.props.boxSelected} box={this.props.boxes[this.props.id]}
                    style={textareaStyle} className={classNames + " textAreaStyle"} toolbars={this.props.toolbars} id={this.props.id}
                    onBlur={this.blurTextarea}/> : null}

                <div className="boxOverlay" style={{ display: showOverlay }} />
                <MarkCreator
                    addMarkShortcut={this.props.addMarkShortcut}
                    onBoxAdded={this.props.onBoxAdded}
                    boxSelected={this.props.boxSelected}
                    content={this.refs.content}
                    containedViews={this.props.containedViews}
                    toolbar={toolbar ? toolbar : {}}
                    deleteMarkCreator={this.props.deleteMarkCreator}
                    parseRichMarkInput={Ediphy.Plugins.get(toolbar.config.name).parseRichMarkInput}
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
    blurTextarea(data) {
        this.props.onTextEditorToggled(this.props.id, false);
        let toolbar = this.props.toolbars[this.props.id];

        Ediphy.Plugins.get(toolbar.config.name).forceUpdate(Object.assign({}, toolbar.state, {
            __text: toolbar.config.extraTextConfig ? data : encodeURI(data),
        }), this.props.id, EDIT_PLUGIN_TEXT);
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
     * @param prevProps React previous props
     * @param prevState React previous state
     */
    componentDidUpdate(prevProps, prevState) {
        let toolbar = this.props.toolbars[this.props.id];
        let box = this.props.boxes[this.props.id];
        let node = ReactDOM.findDOMNode(this);

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

    }

    /**
     * After component mounts
     * Set interact listeners for box manipulation
     */
    componentDidMount() {
        let toolbar = this.props.toolbars[this.props.id];
        let box = this.props.boxes[this.props.id];

        let offsetEl = document.getElementById('maincontent') ? document.getElementById('maincontent').getBoundingClientRect() : {};
        let leftO = offsetEl.left || 0;
        let topO = offsetEl.top || 0;
        offsetEl;
        let gridTarget = interact.createSnapGrid({ x: 10, y: 10, range: 7.1, offset: { x: leftO, y: topO } });
        Ediphy.Plugins.get(toolbar.config.name).getConfig();
        Ediphy.Plugins.get(toolbar.config.name).afterRender(this.refs.content, toolbar.state);
        let dragRestrictionSelector = isSortableContainer(box.container) ? /* ".editorBoxSortableContainer, .drg" + box.container :*/"sortableContainerBox" : "parent";
        let resizeRestrictionSelector = isSortableContainer(box.container) ? ".editorBoxSortableContainer, .drg" + box.container : "parent";
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
                            if (parent.className && (parent.className.indexOf("editorBoxSortableContainer") !== -1 || parent.className.indexOf("drg" + box.container) !== -1)) {
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

                    // Hide EditorShortcuts
                    let bar = this.props.containedViewSelected === 0 ?
                        document.getElementById('editorBoxIcons') :
                        document.getElementById('contained_editorBoxIcons');
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
                    let bar = this.props.containedViewSelected === 0 ?
                        document.getElementById('editorBoxIcons') :
                        document.getElementById('contained_editorBoxIcons');
                    bar.classList.remove('hidden');

                    if (this.props.boxSelected !== this.props.id) {
                        return;
                    }

                    let target = event.target;
                    if (!target.parentNode) {
                        return;
                    }
                    // Unhide EditorShortcuts

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

                    let releaseClick = document.elementFromPoint(event.clientX, event.clientY);
                    let row = this.releaseClick(releaseClick, "rowNum");
                    let col = this.releaseClick(releaseClick, "colNum");
                    let hoverSortableContainer;
                    let calculatedId = this.releaseClick(releaseClick, ID_PREFIX_SORTABLE_CONTAINER);
                    if (calculatedId) {
                        hoverSortableContainer = ID_PREFIX_SORTABLE_CONTAINER + calculatedId;
                    }
                    let containerId = hoverSortableContainer || box.container;
                    let disposition = { col: col || 0, row: row || 0 };
                    this.props.onBoxMoved(
                        this.props.id,
                        isSortableContainer(box.container) ? left : absoluteLeft,
                        isSortableContainer(box.container) ? top : absoluteTop,
                        this.props.boxes[this.props.id].position.type,
                        box.parent,
                        containerId,
                        disposition
                    );

                    // Stuff to reorder boxes when position is relative
                    let hoverID = this.releaseClick(releaseClick, 'box-');
                    let boxOb = this.props.boxes[this.props.id];
                    if (boxOb && isSortableContainer(boxOb.container)) {
                        let children = this.props.boxes[boxOb.parent].sortableContainers[boxOb.container].children;
                        if (children.indexOf(hoverID) !== -1) {
                            let newOrder = Object.assign([], children);
                            newOrder.splice(newOrder.indexOf(hoverID), 0, newOrder.splice(newOrder.indexOf(boxOb.id), 1)[0]);
                            this.props.onBoxesInsideSortableReorder(boxOb.parent, boxOb.container, newOrder);
                        }
                    }

                    event.stopPropagation();

                },
            })
            .ignoreFrom('input, textarea, .textAreaStyle,  a, button,.pointerEventsEnabled')
            .resizable({
                /* snap: { targets: [gridTarget] },*/
                preserveAspectRatio: this.checkAspectRatioValue(),
                enabled: (box.resizable),
                restrict: {
                    restriction: resizeRestrictionSelector,
                    // elementRect: { top: 0, left: 0, bottom: 0, right: 0 },
                },
                edges: { left: true, right: true, bottom: true, top: true },
                onstart: (event) => {
                    // Hide EditorShortcuts
                    let bar = this.props.containedViewSelected === 0 ?
                        document.getElementById('editorBoxIcons') :
                        document.getElementById('contained_editorBoxIcons');
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
                        this.props.onBoxMoved(this.props.id, target.style.left, target.style.top, box.position.type, box.parent, box.container);
                    }
                    target.style.webkitTransform = target.style.transform =
                        'translate(0px, 0px)';

                    target.setAttribute('data-x', 0);
                    target.setAttribute('data-y', 0);

                    // Unhide EditorShorcuts and remove size textbox
                    let bar = this.props.containedViewSelected === 0 ?
                        document.getElementById('editorBoxIcons') :
                        document.getElementById('contained_editorBoxIcons');
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
   * Calculate if a click was released on top of any element of a kind
   * Example: Check if plugin was dropped on top of another plugin. Check in which sortable it was dropped, etc.
   * @param releaseClick Element where the click was released
   * @param name Prefix of the className of the parent we are looking for
   * @returns {*}
   */
    releaseClick(releaseClick, name) {
        if (releaseClick) {
        // Get element that has been clicked
            let release = releaseClick.getAttribute('id') || "noid";
            let counter = 7;
            // Check recursively the parent of the element clicked to check if any of them is a box
            while (release && release.indexOf(name) === -1 && counter > 0 && releaseClick.parentNode) {
                releaseClick = releaseClick.parentNode;
                if (releaseClick) {
                    release = releaseClick.getAttribute('id') || "noid";
                } else {
                    counter = 0;
                    break;
                }
                counter--;
            }
            if (counter > 0 && release && release.indexOf(name) !== -1) {
                let partialID = release.split(name);
                if (partialID && partialID.length > 0) {
                    return partialID[1];

                }

            }
        }
        return undefined;
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
     * Unset interact listeners
     */
    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this)).unset();

    }

}

EditorBox.propTypes = {
    /**
     * Identificador único de la caja
     */
    id: PropTypes.string.isRequired,
    /**
     * Diccionario que contiene todas las cajas creadas, accesibles por su *id*
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Caja seleccionada en el momento. Si no hay ninguna, -1
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Nivel de profundidad de caja seleccionada (sólo para plugins dentro de plugins)
     */
    boxLevelSelected: PropTypes.number.isRequired,
    /**
     * Diccionario que contiene todas las vistas contenidas, accesibles por su *id*
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Vista contenida seleccionada identificada por su *id*
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Diccionario que contiene todas las cajas y vistas creadas , accesibles por su *id*
     */
    toolbars: PropTypes.object.isRequired,
    /**
     * Última acción realizada en Redux
     */
    lastActionDispatched: PropTypes.any.isRequired,
    /**
     * Añade una marca a la caja
     */
    addMarkShortcut: PropTypes.func.isRequired,
    /**
     * Función que oculta el overlay de creación de marcas
     */
    deleteMarkCreator: PropTypes.func.isRequired,
    /**
     * Identificador de la caja en la que se va a crear una marca
     */
    markCreatorId: PropTypes.any.isRequired,
    /**
     * Añade una caja
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * Selecciona la caja
     */
    onBoxSelected: PropTypes.func.isRequired,
    /**
     * Aumenta el nivel de profundidad de selección (plugins dentro de plugins)
     */
    onBoxLevelIncreased: PropTypes.func.isRequired,
    /**
     * Mueve la caja
     */
    onBoxMoved: PropTypes.func.isRequired,
    /**
     * Redimensiona la caja
     */
    onBoxResized: PropTypes.func.isRequired,
    /**
     * Suelta la caja en una zona de un EditorBoxSortable
     */
    onBoxDropped: PropTypes.func.isRequired,
    /**
     * Alínea la caja verticalmente
     */
    onVerticallyAlignBox: PropTypes.func.isRequired,
    /**
     * Reordena las cajas dentro de su contenedor
     */
    onBoxesInsideSortableReorder: PropTypes.func.isRequired,
    /**
     * Redimensiona un contenedor
     */
    onSortableContainerResized: PropTypes.func.isRequired,
    /**
     * Hace aparecer/desaparecer el CKEditor
     */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
     * Indica el tipo de página en el que se encuentra la caja
     */
    pageType: PropTypes.string.isRequired,
};
