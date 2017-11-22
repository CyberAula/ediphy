import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ediphy from '../../../core/editor/main';

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
    }

    /**
   * After component mounts
   * Sets listener
   */

    copyListener(event) {
        let focus = document.activeElement.className;
        if (event.clipboardData) {
            if(this.props.boxSelected !== -1) {
                if (focus.indexOf('form-control') === -1 && focus.indexOf('tituloCurso') === -1 && focus.indexOf('cke_editable') === -1) {
                    event.preventDefault();
                    event.clipboardData.setData("text/plain", this.props.boxSelected);
                }
            }
            console.log(event.clipboardData.getData("text"));
        }
    }

    // TODO quitar focus al ckeditor
    pasteListener(event) {
        let focus = document.activeElement.className;
        if (event.clipboardData) {
            if(this.props.boxSelected !== -1) {
                if (focus.indexOf('form-control') === -1 && focus.indexOf('tituloCurso') === -1 && focus.indexOf('cke_editable') === -1) {
                    event.preventDefault();
                    console.log(event.clipboardData.getData("text"));
                }
            }
        }
    }

    componentDidMount() {
        document.addEventListener('copy', this.copyListener);
        document.addEventListener('paste', this.pasteListener);
    }

    /**
   * Before component unmounts
   * Unsets listener
   */
    componentWillUnmount() {
        document.removeEventListener('copy', this.copyListener);
        document.removeEventListener('paste', this.pasteListener);
    }

    /**
   * Renders React Component
   * @returns {code} React rendered component
   */
    render() {
        return(null);
    }
}

Clipboard.propTypes = {
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
};
