import React, { Component } from 'react';
import reactCSS from 'reactcss';
import { ChromePicker } from 'react-color';
import PropTypes from "prop-types";
import './color_picker_input.scss';

export default class ColorPicker extends Component {

    constructor(props) {
        super(props);
        this.state = { displayColorPicker: false, color: this.getRGBAComponents(this.props.value) };
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const didReceiveColor = nextProps.value;
        if (didReceiveColor) {
            const color = nextProps.value;
            this.setState({ color: this.getRGBAComponents(color) });
        }
    }

    render() {
        const styles = reactCSS({
            'default': {
                color: {
                    borderRadius: '2px',
                    background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });

        return (
            <div>
                <div className={'colorPickerContainer'} style={ styles.swatch } onClick={ this.handleClick }>
                    <div className={'colorPickerInput'} style={ styles.color } />
                </div>
                { this.state.displayColorPicker &&
                    <div className={'cpicker'} style={ styles.popover }>
                        <div style={ styles.cover } onClick={ this.handleClose }/>
                        <ChromePicker
                            color={this.state.color}
                            onChange={this.handleChange}
                            onChangeComplete={this.handleChangeComplete}/>
                    </div> }

            </div>
        );
    }

    handleClick = () => this.setState({ displayColorPicker: !this.state.displayColorPicker });

    handleClose = () => this.setState({ displayColorPicker: false });

    handleChange = (color) => this.setState({ color: color.rgb });

    handleChangeComplete = () => this.props.onChange({ color: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })` });

    /**
     * Converts hex color + alpha transparency to rgba value
     * @param color
     * @param alpha
     * @returns {string}
     */
    hexToRgba = (color, alpha = 100) => {
        let cutHex = (color.charAt(0) === "#") ? color.substring(1, 7) : color;
        let r = parseInt(cutHex.substring(0, 2), 16);
        let g = parseInt(cutHex.substring(2, 4), 16);
        let b = parseInt(cutHex.substring(4, 6), 16);
        let a = alpha / 100;
        return `rgba(${ r }, ${ g }, ${ b }, ${ a })`;
    };

    getRGBAComponents = (colorString) => {
        const rgbKeys = ['r', 'g', 'b', 'a'];
        let rgbObj = {};

        let colorIsHex = colorString.indexOf('#') !== -1;
        let colorIsRgba = colorString.indexOf('rgba') !== -1;
        let color = colorIsRgba ? colorString : colorIsHex ? this.hexToRgba(colorString) : this.hexToRgba('#ffffff');
        color = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');

        for (let i in rgbKeys)
        {rgbObj[rgbKeys[i]] = color[i] || 1;}

        return rgbObj;
    };
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

