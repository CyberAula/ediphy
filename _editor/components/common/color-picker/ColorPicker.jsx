import React, { Component } from 'react';
import Picker from 'rc-color-picker';
require('./../../../../node_modules/rc-color-picker/assets/index.css');
require('./color_picker_input.scss');
/** *
 * React input color component
 */
export default class ColorPicker extends Component {
    constructor(props) {
        super(props);
        let { newColor, alpha } = this.internalFormat(this.props.value || '#000000');
        this.state = {
            color: newColor,
            alpha: alpha,
        };
    }

    componentWillReceiveProps(nextProps) {
        let { newColor, alpha } = this.internalFormat(nextProps.value);
        this.setState({ color: newColor, alpha: alpha });
    }

    render() {
        return(
            <div className="colorPickerContainer" >
                <Picker className="colorPickerInput"
                    placement="topRight"
                    enableAlpha
                    animation="slide-up"
                    color={this.state.color}
                    onChange={(e)=>{ this.setState({ color: e.color, alpha: e.alpha });}}
                    onClose={()=>{this.props.onChange({ color: this.hexToRgba(this.state.color, this.state.alpha) });}}
                    mode="RGB"
                    alpha={this.state.alpha} />
            </div>);

    }

    /** *
     * Splits rgba value into rgb and alpha values
     * @param rgba
     * @returns {newColor, alpha} newColor = rgb color, alpha = transparency value}
     */
    internalFormat(rgba) {
        let regex = /rgba\((\d+),(\d+),(\d+),(.+)\)/;
        let oldColor = regex.exec(rgba);
        if(oldColor && oldColor.length > 0) {
            let newColor = '#' + this.rgbtoHex(oldColor[1]) + this.rgbtoHex(oldColor[2]) + this.rgbtoHex(oldColor[3]);
            return { newColor: newColor, alpha: oldColor[4] * 100 };
        }

        return { newColor: rgba, alpha: 100 };
    }

    hexToRgba(color, alpha) {
        let cutHex = (color.charAt(0) === "#") ? color.substring(1, 7) : color;
        let r = parseInt(cutHex.substring(0, 2), 16);
        let g = parseInt(cutHex.substring(2, 4), 16);

        let b = parseInt(cutHex.substring(4, 6), 16);
        let a = alpha / 100;
        let str = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        return str;
    }

    rgbtoHex(n) {
        n = parseInt(n, 10);
        if (isNaN(n)) {return "00";}
        n = Math.max(0, Math.min(n, 255));
        let num = "0123456789ABCDEF".charAt((n - n % 16) / 16)
            + "0123456789ABCDEF".charAt(n % 16);
        return num;
    }
}
