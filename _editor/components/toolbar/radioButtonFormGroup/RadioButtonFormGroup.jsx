import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Tooltip, OverlayTrigger } from 'react-bootstrap';

import { RadioButtonCustom } from "./Styles";
/** *
 * Radio Button component that displays material icons instead of plain text options
 * @example <RadioButtonFormGroup
 *    key="alignment"
 *    title='Alineación'       // Label for Input
 *    options={['left', 'center', 'right']}      // The actual value of the option
 *    selected={this.props.box.textAlign}        // Current value
 *    tooltips={['Alinear a la izquierda', 'Alinear al centro','Alinear a la derecha']} // Optional: Help message for the user. Default: option value
 *    icons={['format_align_left', 'format_align_center', 'format_align_right']}   // Material icon code in the same order as the options
 *    click={(option) => {this.props.onChangeSortableProps(this.props.id, this.props.parentId, 'textAlign', option)}} /> // Change handler
 */

export default class RadioButtonFormGroup extends Component {

    /**
     * Tooltip creator
     * @param text Tooltip Content
     * @returns {Tooltip} React Tooltip component
     */
    tooltip = (text) => <Tooltip id="tooltip_radio">{text}</Tooltip>;

    handleClick = (e, option) => {
        this.props.click(option);
        e.stopPropagation();
    };

    /**
     * Renders React Component
     * @returns {ccde} Rendered React component
     */
    render() {
        return React.createElement(FormGroup, {},
            React.createElement(ControlLabel, { key: 'label' }, this.props.title), <br key="space"/>,
            this.props.options
                .map((option, index) => {
                    const overlay = this.props.tooltips ? this.tooltip(this.props.tooltips[index]) : this.tooltip(option);
                    return (
                        <OverlayTrigger placement="top" key={'item_' + index} overlay={overlay}>
                            <RadioButtonCustom value={option} selected={ this.props.selected === option }
                                onClick={this.handleClick}>
                                <i className="material-icons">{this.props.icons[index]}</i>
                            </RadioButtonCustom>
                        </OverlayTrigger>);
                })
        );
    }
}
/**
 * Prop Types
 * @type {{key: shim, title: shim, options: shim, selected: shim, click: shim, tooltips: *, icons: *}}
 */
RadioButtonFormGroup.propTypes = {
    /**
     * Button name
     */
    title: PropTypes.string.isRequired,
    /**
     * Button options
     */
    options: PropTypes.array.isRequired,
    /**
     * Button value
     */
    selected: PropTypes.any.isRequired,
    /**
     * Callback for give action to the button
     */
    click: PropTypes.func.isRequired,
    /**
     * Button tooltips
     */
    tooltips: PropTypes.arrayOf(PropTypes.string),
    /**
     * Button icons
     */
    icons: PropTypes.arrayOf(PropTypes.string),
};

