import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ediphy from '../../../core/editor/main';
import { isContainedView, isSlide, isSortableBox } from '../../../common/utils';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from '../../../common/constants';

/** *
 * Component for managing the clipboard
 */
export default class Clipboard extends Component {
    /**
   * Constructor
   * @param props React component props
   */
    constructor(props) {
        super(props);
        this.copyListener = this.copyListener.bind(this);
        this.pasteListener = this.pasteListener.bind(this);
        this.cutListener = this.cutListener.bind(this);
    }

    /**
   * After component mounts
   * Sets listener
   */

    copyListener(event) {
        let focus = document.activeElement.className;
        if (event.clipboardData) {
            if(this.props.boxSelected !== -1 && !isSortableBox(this.props.boxSelected)) {
                if (focus.indexOf('form-control') === -1 && focus.indexOf('cke_editable') === -1) { // focus.indexOf('tituloCurso') === -1 &&
                    event.preventDefault();
                    let copyData = { box: this.props.boxes[this.props.boxSelected], toolbar: this.props.toolbars[this.props.boxSelected] };
                    event.clipboardData.setData("text/plain", JSON.stringify(copyData));
                }
            }
            // console.log(event.clipboardData.getData("text"));
        }
    }

    cutListener(event) {
        this.copyListener(event);
        let box = this.props.boxes[this.props.boxSelected];
        // TODO CKEditor errors fix
        this.props.onBoxDeleted(box.id, box.parent, box.container);
    }

    pasteListener(event) {
        let focus = document.activeElement.className;
        if (event.clipboardData) {
            let data = event.clipboardData.getData("text");
            // Check if copied data is plugin
            try {
                data = JSON.parse(data);
            } catch(err) {
                console.log(err);
            }
            // Copied data is a plugin
            if (data && data.box && data.toolbar) {
                // Focus is outside a text box
                if (focus.indexOf('form-control') === -1 && focus.indexOf('cke_editable') === -1) {
                    // Paste plugin
                    event.preventDefault();
                    let page = isContainedView(this.props.containedViewSelected) ?
                        this.props.containedViews[this.props.containedViewSelected] :
                        (this.props.navItemSelected !== 0 ? this.props.navItems[this.props.navItemSelected] : null);
                    if (page) {
                        let containerId = ID_PREFIX_SORTABLE_CONTAINER + Date.now();
                        let id = ID_PREFIX_BOX + Date.now();
                        let isTargetSlide = isSlide(page.type);
                        let parent = isTargetSlide ? page.id : page.boxes[0];
                        let container = isTargetSlide ? 0 : containerId;
                        // console.log(id, parent, container, page);
                        let ids = { id, parent, container };
                        this.props.onBoxPasted(ids,
                            this.transformBox(data.box, ids, isTargetSlide),
                            this.transformToolbar(data.toolbar, ids, isTargetSlide));
                    }

                    // Inside a text box (CKEditor or input)
                } else {
                    event.preventDefault();
                }
                // Copied data is not a plugin
            } else {
                // TODO Create plugin image from copied image, plugin text from copied text, etc
            }

        }
    }

    transformBox(box, ids, isTargetSlide) {
        let newBox = Object.assign({}, box, {
            container: ids.container,
            id: ids.id,
            parent: ids.parent,
            position: isTargetSlide ? { type: "absolute", x: randomPositionGenerator(20, 40), y: randomPositionGenerator(20, 40) } : { type: box.position.type, x: "0%", y: "0%" },
            resizable: isTargetSlide,
            row: 0,
            col: 0,
        });
        return newBox;
    }

    transformToolbar(toolbar, ids, isTargetSlide) {
        let newToolbar = Object.assign({}, toolbar, { id: ids.id });
        console.log("//////////NEW_BOX///////////////");
        console.log(newToolbar);
        return newToolbar;

    }

    componentDidMount() {
        document.addEventListener('copy', this.copyListener);
        document.addEventListener('paste', this.pasteListener);
        document.addEventListener('cut', this.cutListener);
    }

    /**
   * Before component unmounts
   * Unsets listener
   */
    componentWillUnmount() {
        document.removeEventListener('copy', this.copyListener);
        document.removeEventListener('paste', this.pasteListener);
        document.removeEventListener('cut', this.cutListener);
    }

    /**
   * Renders React Component
   * @returns {code} React rendered component
   */
    render() {
        return(null);
    }

}

function randomPositionGenerator(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2) + "%";

}

Clipboard.propTypes = {
    /**
     * Paste box function
     */
    onBoxPasted: PropTypes.func.isRequired,
    /**
     * Delete box function
     */
    onBoxDeleted: PropTypes.func.isRequired,
    /**
      * Selected box
      */
    boxSelected: PropTypes.any,
    /**
      * Object that contains the toolbars
      */
    toolbars: PropTypes.object,
    /**
      * Object that contains the boxes
      */
    boxes: PropTypes.object,
    /**
   * View selected
   */
    navItemSelected: PropTypes.any,
    /**
   * Contained view selected
   */
    containedViewSelected: PropTypes.any,
    /**
   * Object that contains all the views
   */
    navItems: PropTypes.object,
    /**
   * Object that contains all the contained views
   */
    containedViews: PropTypes.any,
};

