import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Picker from 'rc-color-picker';
import './../../../../node_modules/rc-color-picker/assets/index.css';
import './color_picker_input.scss';
import { toColor } from '../../../../common/common_tools';
/**
 * React input color component
 */
export default class ColorPicker_DEPRECATED extends Component {
    /**
     *
     * @param {object} props Inherited props
     */
    constructor(props) {
        super(props);
        let { newColor, alpha } = this.internalFormat(this.props.value || '#000000');
        /**
         * Component's initial state
         */
        this.state = {
            color: newColor,
            alpha: alpha,
        };
    }

    /**
     * Before component receives new props
     * Sets state to new color
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let { newColor, alpha } = this.internalFormat(nextProps.value);
        this.setState({ color: newColor, alpha: alpha });
    }

    /**
     * Render React component
     * @returns {code}
     */
    render() {
        console.log(this.state);
        return(
            <div className="colorPickerContainer" >
                <Picker className="colorPickerInput"
                    placement="topRight"
                    enableAlpha
                    animation="slide-up"
                    color={this.state.color}
                    onChange={(e)=>{ this.setState({ color: e.color, alpha: e.alpha });}}
                    onClose={()=>{console.log('closing...'); this.props.onChange({ color: this.hexToRgba(this.state.color, this.state.alpha) });}}
                    mode="RGB"
                    alpha={this.state.alpha} />
            </div>);

    }

    /**
     * Splits rgba value into rgb and alpha values
     * @param rgba
     * @returns {object}
     */
    internalFormat(rgba) {
        return toColor(rgba);
    }

    /**
     * Converts hex color + alpha transparency to rgba value
     * @param color
     * @param alpha
     * @returns {string}
     */
    hexToRgba(color, alpha) {
        let cutHex = (color.charAt(0) === "#") ? color.substring(1, 7) : color;
        let r = parseInt(cutHex.substring(0, 2), 16);
        let g = parseInt(cutHex.substring(2, 4), 16);

        let b = parseInt(cutHex.substring(4, 6), 16);
        let a = alpha / 100;
        let str = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        return str;
    }

    /**
     * Converts rgb color to hex
     * @param n R, G or B part or the color
     * @returns {*} Two digits corresponding to the hex value of the color part
     */

}

ColorPicker.propTypes = {
    /**
     * Value of the selected color
     */
    value: PropTypes.string.isRequired,
    /**
     * Changes the selected color
     */
    onChange: PropTypes.func.isRequired,
};
