import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import MarkCreator from '../../rich_plugins/mark_creator/MarkCreator';
import interact from 'interactjs';
import PluginPlaceholder from '../plugin_placeholder/PluginPlaceholder';
import { EDIT_PLUGIN_TEXT } from '../../../../common/actions';
import { releaseClick, findBox } from '../../../../common/common_tools';
import { isUnitlessNumber } from '../../../../common/cssNonUnitProps';
import Ediphy from '../../../../core/editor/main';
import {
    isSortableBox, isSortableContainer, isAncestorOrSibling, isContainedView, isBox,
    vendorTransform,
} from '../../../../common/utils';
import './_editorBox.scss';
import { ID_PREFIX_SORTABLE_CONTAINER } from '../../../../common/constants';
import CKEDitorComponent from './CKEDitorComponent';
const SNAP_DRAG = 5;
const SNAP_SIZE = 2;
let html2json = require('html2json').html2json;
import { connect } from "react-redux";

/**
 * Ediphy Box component.
 * @desc It is the main and more complex component by far. It is the one in charge of painting a plugin's template and therefore it has many parts conditioned to the type of plugin.
 */
class EditorBox extends Component {
    /**
     * Constructor
     * @param props React component props
     */
    state = { borderSize: 2 };
    /**
     * Renders React Component
     * @returns {code} React rendered component
     */
    render() {

        const { onBoxAdded, onBoxSelected } = this.props.handleBoxes;

        const { addMarkShortcut, deleteMarkCreator, onRichMarksModalToggled } = this.props.handleMarks;

        const cornerSize = 15;
        const box = this.props.boxes[this.props.id];
        const toolbar = this.props.pluginToolbars[this.props.id];
        const vis = this.props.boxSelected === this.props.id;
        let style = {
            visibility: (toolbar.showTextEditor ? 'hidden' : 'visible'),
            overflow: 'hidden',
        };

        let textareaStyle = {
            height: (toolbar.showTextEditor ? '100%' : '100%'),
            display: (toolbar.showTextEditor ? 'block' : 'none'),
        };
        let marks = this.getMarks(this.props.marks, this.props.id);
        let { width, height, widthUnit, heightUnit } = toolbar.structure;
        let classNames = "";
        let apiPlugin = Ediphy.Plugins.get(toolbar.pluginId);
        let config = apiPlugin.getConfig();
        if (config.needsTextEdition) {
            textareaStyle.textAlign = "left";
            style.textAlign = "left";
        }

        let toolbarStyle = {};
        for (let propCSS in toolbar.style) {
            if (!isNaN(toolbar.style[propCSS]) && isUnitlessNumber.indexOf(propCSS) === -1) {
                toolbarStyle[propCSS] = toolbar.style[propCSS] / 7 + 'em';
            } else {
                toolbarStyle[propCSS] = toolbar.style[propCSS];
            }
        }
        style = { ...style, ...toolbarStyle };
        if (toolbar.structure.height === 'auto' && config.needsTextEdition) {
            style.height = 'auto';
        }

        Object.assign(textareaStyle, style);
        textareaStyle.visibility = 'visible';
        let wholeBoxStyle = {
            position: box.position.type,
            left: box.position.x ? box.position.x : "",
            top: box.position.y ? box.position.y : "",
            width: width !== "auto" ? (width + widthUnit) : "auto",
            height: height !== "auto" ? (height + heightUnit) : "auto",
            touchAction: 'none',
            msTouchAction: 'none',
            transformOrigin: '0 0',
            cursor: vis ? 'inherit' : 'default', // esto evita que aparezcan los cursores de move y resize cuando la caja no está seleccionada
        };

        let rotate = 'rotate(0deg)';
        if (!(this.props.markCreatorId && this.props.id === this.props.boxSelected)) {
            if (toolbar.structure.rotation && toolbar.structure.rotation) {
                rotate = 'rotate(' + toolbar.structure.rotation + 'deg)';
            }
        }

        vendorTransform(wholeBoxStyle, rotate);
        let props = { ...this.props,
            marks: marks,
            allMarks: this.props.marks,
            update: (key, value) => {
                this.props.onToolbarUpdated(this.props.id, "main", "state", key, value);
            },
            parentBox: this.props.boxes[this.props.id],
            setCorrectAnswer: (correctAnswer) => {
                if (this.props.exercises.correctAnswer !== correctAnswer) {
                    this.props.setCorrectAnswer(this.props.id, correctAnswer, this.props.page);
                }
            },
        };
        let content = config.flavor === "react" ? (
            <div style={style} className={"boxStyle " + classNames} ref={"content"}>
                {Ediphy.Plugins.get(toolbar.pluginId).getRenderTemplate(toolbar.state, props)}
            </div>
        ) : (
            <div style={style} className={"boxStyle " + classNames} ref={"content"}>
                {this.renderChildren(html2json(Ediphy.Plugins.get(toolbar.pluginId).getRenderTemplate(toolbar.state, props)))}
            </div>
        );
        let border = (
            <div style={{ visibility: (vis ? 'visible' : 'hidden') }}>
                <div style={{
                    position: 'absolute',
                    top: -(this.state.borderSize),
                    left: -(this.state.borderSize),
                    width: '100%',
                    height: '100%',
                    boxSizing: 'content-box',
                }} />
                <div style={{ zIndex: 9999, display: 'initial' }}>
                    <div className="helpersResizable" onClick={this.stopEventPropagation}
                        style={{ left: -cornerSize / 2, top: -cornerSize / 2, width: cornerSize, height: cornerSize, cursor: 'nw-resize' }} />
                    <div className="helpersResizable" onClick={this.stopEventPropagation}
                        style={{ right: -cornerSize / 2, top: -cornerSize / 2, width: cornerSize, height: cornerSize, cursor: 'ne-resize' }} />
                    <div className="helpersResizable" onClick={this.stopEventPropagation}
                        style={{ left: -cornerSize / 2, bottom: -cornerSize / 2, width: cornerSize, height: cornerSize, cursor: 'sw-resize' }} />
                    <div className="helpersResizable" onClick={this.stopEventPropagation}
                        style={{ right: -cornerSize / 2, bottom: -cornerSize / 2, width: cornerSize, height: cornerSize, cursor: 'se-resize' }} />
                </div>
            </div>
        );

        let classes = "wholebox";
        classes += " dnd";// + box.container;
        if (this.props.id === this.props.boxSelected) {
            classes += " selectedBox";
        }
        if (box.height === 'auto') {
            classes += " automaticallySizedBox";
        }

        let showOverlay = "none";
        let verticalAlign = "top";

        wholeBoxStyle.verticalAlign = verticalAlign;
        return (
            <div className={classes} id={'box-' + this.props.id} name={toolbar.pluginId}
                onClick={e => {
                    if (this.props.boxSelected !== this.props.id) {
                        // Do not stop propagation if we are not allowed to select this box because of its level, so it selects the parent instead of itself
                        if (!isAncestorOrSibling(this.props.boxSelected, this.props.id, this.props.boxes) && isBox(box.parent)) {
                            return;
                        }
                        // If it is a box inside another box, you are only allowed to select it if you have its parent box selected
                        if (box.level < 1 || box.level < this.props.boxLevelSelected || isAncestorOrSibling(this.props.boxSelected, this.props.id, this.props.boxes)) {
                            onBoxSelected(this.props.id);
                        }
                    }
                    e.stopPropagation();
                }}
                onDoubleClick={(e)=> {
                    if(config && config.needsTextEdition && this.props.id === this.props.boxSelected) {
                        this.props.onTextEditorToggled(this.props.id, true);
                        e.stopPropagation();
                    }
                }}
                style={wholeBoxStyle}>
                {border}
                {toolbar.showTextEditor ? null : content }
                {toolbar.state.__text ? <CKEDitorComponent key={"ck-" + this.props.id} boxSelected={this.props.boxSelected} box={this.props.boxes[this.props.id]}
                    style={textareaStyle} className={classNames + " textAreaStyle"} toolbars={this.props.pluginToolbars} id={this.props.id}
                    onBlur={this.blurTextarea}/> : null}
                <div className="boxOverlay" style={{ display: showOverlay }} />
                <MarkCreator
                    addMarkShortcut={addMarkShortcut}
                    deleteMarkCreator={deleteMarkCreator}
                    onBoxAdded={onBoxAdded}
                    boxSelected={this.props.boxSelected}
                    containedViews={this.props.containedViews}
                    toolbar={toolbar ? toolbar : {}}
                    parseRichMarkInput={Ediphy.Plugins.get(toolbar.pluginId).parseRichMarkInput}
                    markCreatorId={this.props.markCreatorId}
                    currentId={this.props.id}
                    pageType={this.props.pageType}
                    onRichMarksModalToggled={onRichMarksModalToggled} />
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
                    pluginContainer: markup.attr["plugin-container"],
                    resizable: resizable,
                    parentBox: this.props.boxes[this.props.id],
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
                    props[prop] = function() {};
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

    stopEventPropagation = e => e.stopPropagation();

    /**
     * Blurs text area and saves data
     */
    blurTextarea = (text, data) => {
        this.props.onTextEditorToggled(this.props.id, false, text, data);
    };

    /**
     * Checks if aspect ratio should be kept when resizing the box
     * @returns {boolean} true if aspect ratio shoud be kept, false otherwise
     */
    checkAspectRatioValue() {
        let toolbar = this.props.pluginToolbars[this.props.id];
        let apiPlugin = Ediphy.Plugins.get(toolbar.pluginId);
        let config = apiPlugin.getConfig();
        let box = this.props.boxes[this.props.id];
        if (box && toolbar && toolbar.structure && (toolbar.structure.aspectRatio === true
        /* &&( toolbar.structure.height === 'auto' || toolbar.structure.width === 'auto')*/)) {
            return true;
        }

        if (config.aspectRatioButtonConfig) {
            let arb = config.aspectRatioButtonConfig;
            if (arb.location.length === 2) {
                let comp = toolbar.structure.aspectRatio;
                if (comp) {
                    return comp.checked;
                }
                return false;

            }
            let comp = toolbar.structure.aspectRatio;
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
        let toolbar = this.props.pluginToolbars[this.props.id];
        let box = this.props.boxes[this.props.id];
        let node = ReactDOM.findDOMNode(this);
        let offsetEl = document.getElementById('maincontent') ? document.getElementById('maincontent').getBoundingClientRect() : {};
        let leftO = offsetEl.left || 0;
        let topO = offsetEl.top || 0;
        let gridTarget = interact.createSnapGrid({ x: SNAP_DRAG, y: SNAP_DRAG, range: Math.floor(SNAP_DRAG / 2), offset: { x: leftO, y: topO } });
        let dragTarget = interact.createSnapGrid({ x: SNAP_DRAG, y: SNAP_DRAG, range: (SNAP_DRAG / 2 + 1), offset: { x: leftO, y: topO } });

        let snap = { targets: [], relativePoints: [{ x: 0, y: 0 }] };
        let snapD = { targets: [], relativePoints: [{ x: 0, y: 0 }] };
        let snapSize = {};
        if (this.props.grid) {
            snap = { targets: [gridTarget], relativePoints: [{ x: 0, y: 0 }] };
            snapD = { targets: [dragTarget], relativePoints: [{ x: 0, y: 0 }] };
            snapSize = { targets: [
                { width: SNAP_SIZE, height: SNAP_SIZE, range: SNAP_SIZE },
            ] };
        }

        if (prevProps.pluginToolbars[this.props.id] && (toolbar.showTextEditor !== prevProps.pluginToolbars[this.props.id].showTextEditor) && box.draggable) {
            interact(node).draggable({ enabled: !toolbar.showTextEditor, snap: snapD });
        } else {
            interact(node).draggable({ snap: snapD });
        }

        // if (box.resizable) {
        interact(node).resizable({ preserveAspectRatio: this.checkAspectRatioValue(), snap: snap, snapSize: snapSize });
        // }

        if ((box.level > this.props.boxLevelSelected) && this.props.boxLevelSelected !== -1) {
            interact(node).draggable({ enabled: false });
        }

    }

    /**
     * After component mounts
     * Set interact listeners for box manipulation
     */
    componentDidMount() {
        let toolbar = this.props.pluginToolbars[this.props.id];
        let apiPlugin = Ediphy.Plugins.get(toolbar.pluginId);
        let box = this.props.boxes[this.props.id];
        let container = box.container;
        let offsetEl = document.getElementById('maincontent') ? document.getElementById('maincontent').getBoundingClientRect() : {};
        let leftO = offsetEl.left || 0;
        let topO = offsetEl.top || 0;
        let gridTarget = interact.createSnapGrid({ x: SNAP_DRAG, y: SNAP_DRAG, range: Math.floor(SNAP_DRAG / 2), offset: { x: leftO, y: topO } });
        let dragTarget = interact.createSnapGrid({ x: SNAP_DRAG, y: SNAP_DRAG, range: (SNAP_DRAG / 2 + 1), offset: { x: leftO, y: topO } });

        let targets = this.props.grid ? [gridTarget] : [];
        let dragTargets = this.props.grid ? [dragTarget] : [];
        apiPlugin.afterRender(this.refs.content, toolbar.state);
        let dragRestrictionSelector = ".parentRestrict";
        let resizeRestrictionSelector = isSortableContainer(box.container) ? "body" : "parent";
        let canvas = this.props.containedViewSelected === 0 ?
            document.getElementById('canvas') :
            document.getElementById('containedCanvas');
        interact.dynamicDrop(true);

        interact(ReactDOM.findDOMNode(this))
            .draggable({
                snap: {
                    targets: dragTargets,
                    relativePoints: [{ x: 0, y: 0 }],
                },
                enabled: box.draggable,
                restrict: {
                    restriction: dragRestrictionSelector,
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                },
                autoScroll: {
                    container: canvas,
                    margin: 50,
                    distance: 6,
                    interval: 10,
                },
                ignoreFrom: 'input, textarea, .textAreaStyle,  a, .pointerEventsEnabled, .markeditor',
                onstart: (event) => {
                    event.stopPropagation();
                    if (this.props.boxSelected !== this.props.id) {
                        this.props.handleBoxes.onBoxSelected(this.props.id);
                    }
                    container = this.props.boxes[this.props.id].container;
                    // If contained in smth different from ContainedCanvas (sortableContainer || PluginPlaceHolder), clone the node and hide the original
                    if (isSortableContainer(box.container)) {
                        let original = event.target;
                        let parent = original;
                        // Find real parent to append clone
                        let iterate = true;
                        while (iterate) {
                            parent = parent.parentNode;
                            if (parent.className && (parent.className.indexOf("editorBoxSortableContainer") !== -1 || parent.className.indexOf("slide_air") !== -1)) {
                                iterate = false;
                            }
                        }
                        parent = document.body;
                        // Clone, assign values and hide original
                        let clone = original.cloneNode(true);

                        vendorTransform(original.style, 'none');
                        let originalRect = original.getBoundingClientRect();
                        let parentRect = parent.getBoundingClientRect();
                        let x = originalRect.left - parentRect.left;
                        let y = originalRect.top - parentRect.top;
                        if ($('.canvasSliClass')) {
                            clone.style.fontSize = $('.canvasSliClass').css('font-size');
                        }

                        clone.setAttribute("id", "clone");
                        clone.setAttribute('data-x', x);
                        clone.setAttribute('data-y', y);
                        clone.style.left = 0 + 'px';
                        clone.style.top = 0 + 'px';
                        clone.style.zIndex = '9999 !important';
                        original.setAttribute('data-x', x);
                        original.setAttribute('data-y', y);
                        clone.style.position = 'absolute';

                        clone.style.height = original.offsetHeight + "px";
                        clone.style.width = original.offsetWidth + "px";
                        clone.style.border = "1px dashed #555";
                        parent.appendChild(clone);
                        vendorTransform(original.style, this.rotate());
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

                    event.stopPropagation();
                    // Hide EditorShortcuts
                    let bar = this.props.containedViewSelected === 0 ?
                        document.getElementById('editorBoxIcons') :
                        document.getElementById('contained_editorBoxIcons');
                    if (bar) {bar.classList.add('hidden');}

                    // Level has to be the same to drag a box, unless a sortableContainer is selected, then it should allow level 0 boxes
                    if ((box.level - this.props.boxLevelSelected) === 0 || (box.level === 0 && this.props.boxLevelSelected < 1)) {
                        // If box not in a sortableContainer or PluginPlaceHolder, just drag
                        if (!isSortableContainer(box.container)) {
                            let target = event.target;
                            target.style.left = (parseInt(target.style.left, 10) || 0) + event.dx + 'px';
                            target.style.top = (parseInt(target.style.top, 10) || 0) + event.dy + 'px';
                            target.style.zIndex = '9999';

                            // Else, drag the clone and update values in attributes in both elements
                        } else {
                            let target = document.getElementById('clone');
                            let original = findBox(this.props.id);
                            let x = (parseFloat(target.getAttribute('data-x'), 10) || 0) + event.dx;
                            let y = (parseFloat(target.getAttribute('data-y'), 10) || 0) + event.dy;
                            let translate = 'translate(' + (x) + 'px, ' + (y) + 'px)';
                            vendorTransform(target.style, translate + this.rotate());
                            target.style.zIndex = '9999';

                            target.setAttribute('data-x', x);
                            target.setAttribute('data-y', y);
                            original.setAttribute('data-x', x);
                            original.setAttribute('data-y', y);
                        }
                    }
                },
                onend: (event) => {
                    event.stopPropagation();
                    let bar = this.props.containedViewSelected === 0 ?
                        document.getElementById('editorBoxIcons') :
                        document.getElementById('contained_editorBoxIcons');
                    if (bar) { bar.classList.remove('hidden');}
                    let target = event.target;
                    target.style.opacity = 1;
                    if (this.props.boxSelected !== this.props.id) {
                        return;
                    }

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
                    let left = Math.max(Math.min((parseFloat(actualLeft) / target.parentElement.offsetWidth * 100), 100), 0) + '%';
                    let top = Math.max(Math.min((parseFloat(actualTop) / target.parentElement.offsetHeight * 100), 100), 0) + '%';

                    if (isSortableContainer(box.container)) {
                        target.style.left = left;
                        target.style.top = top;
                    } else {
                        target.style.left = absoluteLeft;
                        target.style.top = absoluteTop;
                    }

                    target.style.zIndex = '0';

                    // Delete clone and unhide original

                    let clone = document.getElementById('clone');
                    if (clone) {
                        clone.parentElement.removeChild(clone);
                    }
                    if (isSortableContainer(box.container)) {
                        target.style.opacity = 1;
                    }

                    let releaseClickEl = document.elementFromPoint(event.clientX, event.clientY);
                    let row = releaseClick(releaseClickEl, "rowNum");
                    let col = releaseClick(releaseClickEl, "colNum");
                    let hoverSortableContainer;
                    let calculatedId = releaseClick(releaseClickEl, ID_PREFIX_SORTABLE_CONTAINER);
                    if (calculatedId) {
                        hoverSortableContainer = ID_PREFIX_SORTABLE_CONTAINER + calculatedId;
                    }
                    let containerId = hoverSortableContainer || box.container;
                    let disposition = { col: col || 0, row: row || 0 };
                    let containerHoverID = releaseClick(releaseClickEl, 'sc-');
                    // TODO Comentar?
                    if (box.container === 0) {
                        this.props.handleBoxes.onBoxMoved(
                            this.props.id,
                            isSortableContainer(box.container) ? left : absoluteLeft,
                            isSortableContainer(box.container) ? top : absoluteTop,
                            this.props.boxes[this.props.id].position.type,
                            box.parent,
                            containerHoverID ? ('sc-' + containerHoverID) : containerId,
                            disposition
                        );
                    }

                    event.stopPropagation();

                },
            })
            .resizable({
                snap: { targets: targets },
                snapSize: { targets: [
                    // snap the width and height to multiples of 5 when the element size
                    // is 25 pixels away from the target size
                    { width: SNAP_SIZE, height: SNAP_SIZE, range: SNAP_SIZE },
                ] },
                preserveAspectRatio: this.checkAspectRatioValue(),
                enabled: true, // (box.resizable),
                restrict: {
                    restriction: resizeRestrictionSelector,
                },
                margin: 10,
                allowFrom: '.helpersResizable',
                edges: { left: true, right: true, bottom: true, top: true },
                onstart: (event) => {
                    // Hide EditorShortcuts
                    if (this.props.boxSelected !== this.props.id) {
                        return;
                    }
                    let bar = this.props.containedViewSelected === 0 ?
                        document.getElementById('editorBoxIcons') :
                        document.getElementById('contained_editorBoxIcons');
                    if (bar) {bar.classList.add('hidden');}
                    // Append textbox with actual size
                    let sb = document.getElementsByClassName('selectedBox');
                    if (sb && sb[0] && ('box-' + this.props.boxSelected) === sb[0].getAttribute('id') && !document.getElementById('sizing')) {
                        let span = document.createElement("span");
                        span.setAttribute("id", "sizing");
                        let t = document.createTextNode(" ");
                        sb[0].appendChild(span);

                    }
                    event.stopPropagation();
                },
                onmove: (event) => {
                    event.stopPropagation();
                    if (this.props.boxSelected !== this.props.id) {
                        return;
                    }
                    let target = event.target;
                    let x = (parseFloat(target.getAttribute('data-x'), 10) || 0);
                    let y = (parseFloat(target.getAttribute('data-y'), 10) || 0);
                    // update the element's style
                    let w = event.rect.width;
                    let h = event.rect.height;
                    toolbar = this.props.pluginToolbars[this.props.id];
                    let cos = Math.cos(toolbar.structure.rotation * Math.PI / 180);
                    let sin = Math.sin(toolbar.structure.rotation * Math.PI / 180);
                    let r = cos * cos - sin * sin;

                    target.style.width = (w * cos - h * sin) / r + 'px';
                    target.style.height = (h * cos - w * sin) / r + 'px';

                    x += event.deltaRect.left;
                    y += event.deltaRect.top;
                    if(box.resizable) { // Only in slide
                        let translate = 'translate(' + x + 'px,' + y + 'px)';
                        vendorTransform(target.style, translate + this.rotate());
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }
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
                    let structure = this.props.pluginToolbars[this.props.id].structure;
                    let widthButton = Object.assign({}, { value: structure.width, units: structure.widthUnit });
                    let heightButton = Object.assign({}, { value: structure.height, units: structure.heightUnit });

                    // Units can be either % or px
                    if (widthButton.units === "%") {
                        let newWidth = Math.min((parseFloat(target.style.width) / target.parentElement.offsetWidth * 100), 100);
                        // Update display value if it's not "auto"
                        if (widthButton.value !== "auto") {
                            widthButton.value = newWidth;
                        }
                        widthButton.value = newWidth;
                    } else {
                        if (widthButton.value !== "auto") {
                            widthButton.value = parseFloat(target.style.width);
                        }
                        widthButton.value = parseFloat(target.style.width);
                    }

                    if (heightButton.units === "%") {
                        let newHeight = Math.min((parseFloat(target.style.height) / target.parentElement.offsetHeight * 100), 100);
                        if (heightButton.value !== "auto") {
                            heightButton.value = newHeight;
                            heightButton.value = newHeight;
                        }
                    } else if (heightButton.value !== "auto") {
                        heightButton.value = parseFloat(target.style.height);
                    }
                    target.style.width = widthButton.value === 'auto' ? 'auto' : widthButton.value + widthButton.units;
                    target.style.height = heightButton.value === 'auto' ? 'auto' : heightButton.value + heightButton.units;

                    this.props.handleBoxes.onBoxResized(this.props.id, {
                        width: widthButton.value,
                        widthUnit: widthButton.units,
                        height: heightButton.value,
                        heightUnit: heightButton.units,
                        x: box.resizable ? ((parseFloat(target.style.left) / 100 * target.parentElement.offsetWidth + parseFloat(target.getAttribute('data-x'))) * 100 / target.parentElement.offsetWidth + '%') : 0,
                        y: box.resizable ? ((parseFloat(target.style.top) / 100 * target.parentElement.offsetHeight + parseFloat(target.getAttribute('data-y'))) * 100 / target.parentElement.offsetHeight + '%') : 0,
                    });
                    let translate = 'translate(0px, 0px)';
                    vendorTransform(target.style, translate + this.rotate());
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
                    // this.forceUpdate();
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

    getMarks = (marks, id) => {
        let myMarks = {};
        Object.keys(marks || {}).forEach(mark =>{
            if(marks[mark].origin === id) {
                myMarks[mark] = marks[mark];
            }
        });

        return myMarks;
    };

    /**
     * Before component unmounts
     * Unset interact listeners
     */
    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this)).unset();
    }

    rotate = () => {
        let rotate = 'rotate(0deg) ';
        let toolbar = this.props.pluginToolbars[this.props.id];
        if (!(this.props.markCreatorId && this.props.id === this.props.boxSelected)) {
            if (toolbar.structure.rotation && toolbar.structure.rotation) {
                rotate = ' rotate(' + toolbar.structure.rotation + 'deg) ';
            }
        }
        return rotate;
    };
}

function mapStateToProps(state) {
    return {
        boxes: state.undoGroup.present.boxesById,
        boxSelected: state.undoGroup.present.boxSelected,
        boxLevelSelected: state.undoGroup.present.boxLevelSelected,
        containedViews: state.undoGroup.present.containedViewsById,
        containedViewSelected: state.undoGroup.present.containedViewSelected,
        pluginToolbars: state.undoGroup.present.pluginToolbarsById,
        marks: state.undoGroup.present.marksById,
        exercises: state.undoGroup.present.exercises,
        markCreatorId: state.reactUI.markCreatorVisible,
        lastActionDispatched: state.undoGroup.present.lastActionDispatched || "",
    };
}

export default connect(mapStateToProps)(EditorBox);

EditorBox.propTypes = {
    /**
     * Box unique identifier
     */
    id: PropTypes.string.isRequired,
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Box selected. If there is none selected the value is, -1
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Depth level of the selected box. Used when there are plugins inside plugins
     */
    boxLevelSelected: PropTypes.number.isRequired,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Selected contained view
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Collection of callbacks for boxes handling
     */
    handleBoxes: PropTypes.object.isRequired,
    /**
     * Collection of callbacks for marks handling
     */
    handleMarks: PropTypes.object.isRequired,
    /**
     * Object containing all the toolbars
     */
    pluginToolbars: PropTypes.object.isRequired,
    /**
     * Identifier of the box that is currently in process of creating a mark
     */
    markCreatorId: PropTypes.any.isRequired,
    /**
     * Object containing box marks
     */
    marks: PropTypes.object,
    /**
     * Callback for toggling the CKEDitor
     */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
     * Page type the box is at
     */
    pageType: PropTypes.string.isRequired,
    /**
      * Snap to grid flag
      */
    grid: PropTypes.bool,
    /**
       * Object containing all exercises
       */
    exercises: PropTypes.object,
    /**
    * Function for setting the right answer of an exercise
    */
    setCorrectAnswer: PropTypes.func.isRequired,
    /**
      * Current page
      */
    page: PropTypes.any,
    /**
    * Function that updates the toolbar of a view
    */
    onToolbarUpdated: PropTypes.func,
};
