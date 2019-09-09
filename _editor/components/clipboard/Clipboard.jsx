import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ediphy from '../../../core/editor/main';
import Alert from '../common/alert/Alert';
import {
    isContainedView,
    isSlide,
    isBox,
    isSortableBox,
    isView,
    getIndex,
} from '../../../common/utils';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from '../../../common/constants';
import { randomPositionGenerator, retrieveImageFromClipboardAsBase64, isURL, copyText } from './clipboard.utils';
import i18n from 'i18next';
import { instanceExists, scrollElement, findBox, createBox } from '../../../common/commonTools';
import { connect } from 'react-redux';
import { uploadVishResourceAsync, uploadEdiphyResourceAsync, addBox, pasteBox } from '../../../common/actions';

/**
 * Component for managing the clipboard
 */
class Clipboard extends Component {

    state = { alert: null };

    /**
     * Extracts necessary information for clipboard/duplicating
     */
    copyData = () => {
        let box = this.props.boxes[this.props.boxSelected];
        let toolbar = this.props.toolbars[this.props.boxSelected];
        let itemSelected = this.currentPage();
        let score;
        if (itemSelected.id) {
            let exercisePage = this.props.exercises[itemSelected.id];
            score = exercisePage.exercises[this.props.boxSelected];
        }

        let childBoxes = {};
        let childToolbars = {};
        if (box.sortableContainers) {
            for (let sc in box.sortableContainers) {
                for (let b in box.sortableContainers[sc].children) {
                    let bid = box.sortableContainers[sc].children[b];
                    childBoxes[bid] = this.props.boxes[bid];
                    childToolbars[bid] = this.props.toolbars[bid];
                }
            }
        }
        let marks = {};
        for (let id in this.props.marks) {
            let mark = this.props.marks[id];
            if (mark.origin === this.props.boxSelected) {
                marks[id] = mark;
            }
            if (Object.keys(childBoxes).indexOf(mark.origin) > -1) {
                marks[id] = mark;
            }
        }
        return { box, toolbar, marks, childBoxes, childToolbars, score };
    };

    /**
     * Copy action listener
     * @param event
     */
    copyListener = (event) => {
        let activeElement = document.activeElement;
        if (event.clipboardData) {
            if (this.props.boxSelected !== -1 && !isSortableBox(this.props.boxSelected)) {
                if (!this.containsCKEDitorText(activeElement)) {
                    event.preventDefault();
                    event.clipboardData.setData("text/plain", JSON.stringify(this.copyData()));
                    document.activeElement.blur();
                    return true;
                }
            }
            return true;
        }
        document.activeElement.blur();
        return false;
    };

    copyButtonListener = () => {
        let activeElement = document.activeElement;
        if (this.props.boxSelected !== -1 && !isSortableBox(this.props.boxSelected)) {
            if (!this.containsCKEDitorText(activeElement) || (this.props.boxes[this.props.boxSelected] && !this.props.boxes[this.props.boxSelected].showTextEditor)) {
                return copyText(this.copyData());
            }
            try {
                document.execCommand('copy');
                return true;
            } catch(e) {
                return false;
            }

        }
        return false;
    };
    /**
     * Cut action listener
     */
    cutListener = (event) => {
        let fromPlugin = this.copyListener(event);
        if (fromPlugin) {
            let box = this.props.boxes[this.props.boxSelected];
            this.props.onBoxDeleted(box.id, box.parent, box.container, this.currentPage());
            // this.props.dispatch(deleteBox(box.id, box.parent, box.container, this.currentPage()));
        }
        document.activeElement.blur();
    };

    /**
     * Calculates current page (nav or cv)
     */
    currentPage = () => {
        return isContainedView(this.props.containedViewSelected) ?
            this.props.containedViews[this.props.containedViewSelected] :
            (this.props.navItemSelected !== 0 ? this.props.navItems[this.props.navItemSelected] : null);
    };

    /**
     * Duplicates box
     */
    duplicateBox = () => {
        let data = this.copyData();
        let containerId = ID_PREFIX_SORTABLE_CONTAINER + Date.now();
        let id = ID_PREFIX_BOX + Date.now();
        let page = this.currentPage();

        let isTargetSlide = isSlide(page.type);
        let parent = isTargetSlide ? page.id : page.boxes[0];

        let container = isTargetSlide ? 0 : containerId;
        let newInd;
        if (this.props.boxSelected && this.props.boxes[this.props.boxSelected] && isBox(this.props.boxSelected)) {
            parent = this.props.boxes[this.props.boxSelected].parent;
            container = this.props.boxes[this.props.boxSelected].container;
            // isTargetSlide = container === 0;
            newInd = getIndex(parent, container, this.props);
        }
        let ids = { id, parent, container, page: page ? page.id : 0 };
        this.pasteBox(data, ids, isTargetSlide, newInd);
        document.activeElement.blur();
    };

    /**
     * Duplicate action listener
     */
    duplicateListener = (event) => {
        let key = event.keyCode ? event.keyCode : event.which;
        if ((key === 69) && event.ctrlKey && event.altKey && isBox(this.props.boxSelected)) {
            event.preventDefault();
            event.stopPropagation();
            this.duplicateBox();
        } else if (key === 86 && event.ctrlKey && event.shiftKey) {
            this.pasteListener(event, true);
        }
        return true;
    };

    /**
     * Pastes box
     */
    pasteBox = (data, ids, isTargetSlide, index) => {
        let pluginName = data.toolbar.pluginId;
        let plug = Ediphy.Plugins.get(pluginName);
        if (!plug) {
            return;
        }
        let config = plug.getConfig();
        let limitToOneInstance = config.limitToOneInstance;
        let alertMsg = (msg) => { return (<Alert className="pageModal" key="alert" show hasHeader backdrop={false}
            title={ <span><i className="material-icons alert-warning" >warning</i>{ i18n.t("messages.alert") }</span> }
            closeButton onClose={()=>{this.setState({ alert: null });}}>
            <span> {msg} </span>
        </Alert>);

        };
        // Forbid plugins inside plugins inside plugins (only 1 level allowed)
        if (isBox(ids.parent) && (!data.childBoxes || Object.keys(data.childBoxes).length > 0)) {
            this.setState({ alert: alertMsg(i18n.t('messages.depth_limit')) }); return;
        }
        if (limitToOneInstance && instanceExists(data.toolbar.pluginId)) {
            this.setState({ alert: alertMsg(i18n.t('messages.instance_limit')) });
            return;
        }

        let transformedBox = this.transformBox(data.box, ids, isTargetSlide, data.box.resizable);
        let transformedToolbar = this.transformToolbar(data.toolbar, ids, isTargetSlide, data.box.resizable);
        let transformedChildren = {};
        let marks = data.marks;
        let newMarks = {};
        if (data.childBoxes && data.childToolbars) {
            for (let bid in transformedBox.newIds) {
                let idsChild = { id: transformedBox.newIds[bid], parent: ids.id, container: data.childBoxes[bid].container };
                let transformedBoxChild = this.transformBox(data.childBoxes[bid], idsChild, false, false);
                let transformedToolbarChild = this.transformToolbar(data.childToolbars[bid], idsChild, false, false);
                transformedChildren[transformedBox.newIds[bid]] = { box: transformedBoxChild.newBox, toolbar: transformedToolbarChild };
            }
        }
        for (let mark in marks) {
            let newId = marks[mark].id + Date.now() + "_1";
            let newMark = { ...marks[mark],
                origin: transformedBox.newIds[marks[mark].origin] || ids.id,
                id: newId };
            if ((isContainedView(newMark.connection) && this.props.containedViews[newMark.connection]) || (isView(newMark.connection) && this.props.navItems[newMark.connection]) || newMark.connectMode === 'external' || newMark.connectMode === 'popup') {
                newMarks[newId] = newMark;
            }
        }
        this.props.dispatch(pasteBox({ ...ids, config }, transformedBox.newBox, transformedToolbar, transformedChildren, index, newMarks, data.score));
    };

    /**
     * Calculates if the current focused element in the DOM is a text area. If it is we do not want to paste the box.
     */
    containsCKEDitorText(activeElement) {
        let focus = activeElement.classList;
        return (focus.contains('form-control') || focus.contains('cke_editable') || focus.contains('textAreaStyle') || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT');
    }

    /**
     * Paste action listener
     */
    pasteListener = (event, overrideShiftKey) => {
        if (event.shiftKey && !overrideShiftKey) {
            return;
        }
        let activeElement = document.activeElement;

        if (event.clipboardData) {
            // Check if copied data is plugin
            let data = "";
            try {
                let clipboardData = event.clipboardData.getData("text");
                data = JSON.parse(clipboardData);
            } catch (err) {
                // eslint-disable-next-line no-console
                // console.log(err, event);
            }

            let page = this.currentPage();
            if (page) {
                let containerId = ID_PREFIX_SORTABLE_CONTAINER + Date.now();
                let id = ID_PREFIX_BOX + Date.now();
                let isTargetSlide = isSlide(page.type);
                let parent = isTargetSlide ? page.id : page.boxes[0];
                let row = 0;
                let col = 0;
                let container = isTargetSlide ? 0 : containerId;
                let newInd;
                if (this.props.boxSelected && this.props.boxes[this.props.boxSelected] && isBox(this.props.boxSelected)) {
                    parent = this.props.boxes[this.props.boxSelected].parent;
                    container = this.props.boxes[this.props.boxSelected].container;
                    // isTargetSlide = container === 0;
                    row = this.props.boxes[this.props.boxSelected].row;
                    col = this.props.boxes[this.props.boxSelected].col;
                    newInd = this.getIndex(parent, container, this.props);
                }

                let ids = { id, parent, container, row, col, page: page ? page.id : 0 };
                // Copied data is an EditorBox
                if (data && data.box && data.toolbar) {
                    // Focus is outside a text box
                    if (!this.containsCKEDitorText(activeElement)) {
                        // Paste plugin
                        event.preventDefault();
                        event.stopPropagation();
                        // TODO Drag with Ctrl key held
                        this.pasteBox(data, ids, isTargetSlide, newInd);
                        // Scroll into pasted element
                        let boxCreated = findBox(ids.id);
                        scrollElement(boxCreated);
                    } else {
                        // Inside a text box (CKEditor or input)
                        // Let normal paste work
                        // event.preventDefault();
                    }

                // Copied data is not an EditorBox
                } else if (!this.containsCKEDitorText(activeElement)) {
                    event.preventDefault();
                    let initialParams = {
                        id: ID_PREFIX_BOX + Date.now(),
                        parent: parent, //
                        container: container,
                        row: row,
                        col: col,
                        index: newInd,
                        page: page ? page.id : 0,
                        position: isTargetSlide && container === 0 ? {
                            type: "absolute",
                            x: randomPositionGenerator(20, 40),
                            y: randomPositionGenerator(20, 30),
                        } : { type: 'relative', x: "0%", y: "0%" },
                    };
                    // If it is an image
                    let noImage = true;
                    let onBoxAdded = (...params)=>this.props.dispatch(addBox(...params));
                    try {
                        let uploadFunctionAction = (process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc') ? uploadVishResourceAsync : uploadEdiphyResourceAsync;
                        let uploadFunction = (...params) => {return this.props.dispatch(uploadFunctionAction(...params));};
                        noImage = retrieveImageFromClipboardAsBase64(event, uploadFunction, (url) => {
                            if (url) {
                                initialParams.url = url; // URLObj.createObjectURL(imageBlob);
                                createBox(initialParams, "HotspotImages", isTargetSlide, onBoxAdded, this.props.boxes);
                                return;
                            }
                        });
                    } catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(err);
                    }
                    if (noImage) {

                        let text = (event.clipboardData.getData("text/html") || event.clipboardData.getData("text/plain"));
                        try {
                            let el = ($(text));
                            let tag = el.prop("tagName");
                            let type = el.attr('objecttype');
                            let src = el.attr('src');
                            if (tag === 'IFRAME') {
                                if (type === 'scormpackage') {
                                    initialParams.url = src;
                                    createBox(initialParams, "ScormPackage", isTargetSlide, onBoxAdded, this.props.boxes);
                                    return;
                                }

                                // check if it is a youtube iframe
                                if (isURL(src) && src.includes('youtube')) {
                                    initialParams.url = src;
                                    createBox(initialParams, "EnrichedPlayer", isTargetSlide, this.props.onBoxAdded, this.props.boxes);
                                    return;
                                }

                                initialParams.url = src;
                                createBox(initialParams, "Webpage", isTargetSlide, onBoxAdded, this.props.boxes);
                                return;

                            } else if (tag === "EMBED") {
                                initialParams.url = src;
                                createBox(initialParams, "FlashObject", isTargetSlide, onBoxAdded, this.props.boxes);
                                return;
                            } else if (tag === "AUDIO") {
                                if (!src) {
                                    let source = el.find('source');
                                    if (source && source[0]) {
                                        src = $(source[0]).attr('src');
                                    }
                                }
                                initialParams.url = src;
                                createBox(initialParams, "EnrichedAudio", isTargetSlide, this.props.onBoxAdded, this.props.boxes);
                                return;

                            } else if (tag === "VIDEO") {
                                if (!src) {
                                    let source = el.find('source');
                                    if (source && source[0]) {
                                        src = $(source[0]).attr('src');
                                    }
                                }
                                initialParams.url = src;
                                createBox(initialParams, "EnrichedPlayer", isTargetSlide, this.props.onBoxAdded, this.props.boxes);
                                return;
                            }
                        } catch(err) {
                            // eslint-disable-next-line no-console
                            console.log(err);
                        }
                        initialParams.text = text;
                        if (isURL(initialParams.text)) {
                            initialParams.text = '<a href="' + initialParams.text + '">' + initialParams.text + '</a>';
                        }
                        createBox(initialParams, "BasicText", isTargetSlide, this.props.onBoxAdded, this.props.boxes);
                    }
                }
            }
        }
    };

    /**
     * Modifies pasted box so it adapts to its new parent
     */
    transformBox = (box, ids, isTargetSlide) => {
        let samePage = isTargetSlide && box.parent === ids.parent;
        let newIds = {};
        let newContainerBoxes = {};
        let ind = 0;
        if (box.sortableContainers) {
            newContainerBoxes = JSON.parse(JSON.stringify(box.sortableContainers));
            for (let sc in newContainerBoxes) {
                for (let b in newContainerBoxes[sc].children) {
                    let newID = ID_PREFIX_BOX + Date.now() + '_' + ind++;
                    newIds[newContainerBoxes[sc].children[b]] = newID;
                    newContainerBoxes[sc].children[b] = newID;
                }
            }
        }
        let newBox = Object.assign({}, box, {
            container: ids.container,
            id: ids.id,
            parent: ids.parent,
            position: isTargetSlide ? {
                type: "absolute",
                x: !samePage ? box.position.x : randomPositionGenerator(20, 40),
                y: !samePage ? box.position.y : randomPositionGenerator(20, 30),
            } : { type: "relative", x: "0%", y: "0%" },
            resizable: isTargetSlide,
            row: ids.row || 0,
            col: ids.col || 0,
            level: isBox(ids.parent) ? 1 : 0,
            sortableContainers: newContainerBoxes,
            containedViews: box.containedViews.filter(cv=> this.props.containedViews[cv]),
        });
        return { newBox, newIds };

    };

    /**
     * Modifies pasted toolbar so it adapts to its new parent
     */
    transformToolbar = (toolbar, ids, isTargetSlide, isOriginSlide) => {
        let newToolbar = Object.assign({}, toolbar, { id: ids.id });
        if (isTargetSlide !== isOriginSlide) {
            let config = Ediphy.Plugins.get(newToolbar.pluginId).getConfig();
            if (isTargetSlide) {
                // TODO width VS bwidth?
                newToolbar.structure.width = parseFloat(config.initialWidthSlide || config.initialWidth) || "25";
                newToolbar.structure.height = parseFloat(config.initialHeightSlide || config.initialHeight) || "auto";
                newToolbar.structure.widthUnit = "%";
                newToolbar.structure.heightUnit = "%";
            } else {
                newToolbar.structure.width = parseFloat(config.initialWidth) || "25";
                newToolbar.structure.widthUnit = config.initialWidth.indexOf('px') !== -1 ? "px" : "%";
                newToolbar.structure.height = parseFloat(config.initialHeight) || "auto";
                newToolbar.structure.heightUnit = config.initialHeight.indexOf('px') !== -1 ? "px" : "%";

            }
        }
        if (isTargetSlide) {
            newToolbar.structure.widthUnit = "%";
            newToolbar.structure.heightUnit = "%";
        }
        return newToolbar;

    };

    /**
     * After component mounts
     * Sets listeners
     */
    componentDidMount() {
        document.addEventListener('copy', this.copyListener);
        document.addEventListener('paste', this.pasteListener);
        document.addEventListener('cut', this.cutListener);
        document.addEventListener('keyup', this.duplicateListener);
    }

    /**
     * Before component unmounts
     * Unsets listeners
     */
    componentWillUnmount() {
        document.removeEventListener('copy', this.copyListener);
        document.removeEventListener('paste', this.pasteListener);
        document.removeEventListener('cut', this.cutListener);
        document.removeEventListener('keyup', this.duplicateListener);
    }

    /**
     * Renders React Component
     */
    render() {
        let childrenWithProps = React.Children.map(this.props.children, (child) =>{
            if (React.isValidElement(child) && child.props.name === "duplicate") {
                return React.cloneElement(child, { onClick: this.duplicateBox });
            }
            if (React.isValidElement(child) && child.props.name === "copy") {
                return React.cloneElement(child, { onClick: this.copyButtonListener });
            }
            return child;
        });
        return [this.state.alert, ...(childrenWithProps || []),

        ];
    }

}

export default connect(mapStateToProps)(Clipboard);

function mapStateToProps(state) {
    return {
        navItemSelected: state.undoGroup.present.navItemSelected,
        containedViewSelected: state.undoGroup.present.containedViewSelected,
        boxSelected: state.undoGroup.present.boxSelected,
        boxes: state.undoGroup.present.boxesById,
        navItems: state.undoGroup.present.navItemsById,
        marks: state.undoGroup.present.marksById,
        exercises: state.undoGroup.present.exercises,
        containedViews: state.undoGroup.present.containedViewsById,
        toolbars: state.undoGroup.present.pluginToolbarsById,
    };
}

Clipboard.propTypes = {
    /**
     * Redux actions dispatcher
     */
    dispatch: PropTypes.func,
    /**
      * Selected box
      */
    boxSelected: PropTypes.any,
    /**
      * Object that contains the toolbars
      */
    toolbars: PropTypes.object,
    /**
      * Object containing all created boxes (by id)
      */
    boxes: PropTypes.object,
    /**
   * Contained view selected
   */
    containedViewSelected: PropTypes.any,
    /**
   * Object that contains all the views
   */
    navItems: PropTypes.object,
    /**
     * Selected nav item
     */
    navItemSelected: PropTypes.any,
    /**
   * Object containing all contained views (identified by its ID)
   */
    containedViews: PropTypes.any,
    /**
     * Children components
     */
    children: PropTypes.any,
    /**
     * Object containing all marks
     */
    marks: PropTypes.object,
    /**
       * Object containing all exercises
       */
    exercises: PropTypes.object,
    /**
     * Added box handler
     */
    onBoxAdded: PropTypes.func,
    /**
     * Deleted box handler
     */
    onBoxDeleted: PropTypes.func,
};
