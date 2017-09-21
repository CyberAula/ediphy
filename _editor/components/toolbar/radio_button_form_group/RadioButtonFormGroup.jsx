import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Tooltip, OverlayTrigger } from 'react-bootstrap';
import './_radiobuttonformgroup.scss';
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
     * Constructor
     * @param props React component properties
     */
    constructor(props) {
        super(props);

    }

    /**
     * Tooltip creator
     * @param text Tooltip Content
     * @returns {Tooltip} React Tooltip component
     */
    tooltip(text) {
        return (
            <Tooltip id="tooltip_radio">{text}</Tooltip>
        );
    }

    /**
     * Renders React Component
     * @returns {ccde} Rendered React component
     */
    render() {
        return React.createElement(FormGroup, {},
            React.createElement(ControlLabel, { key: 'label' }, this.props.title), <br key="space"/>,
            this.props.options
                .map((option, index) => {
                    return (<OverlayTrigger placement="top" key={'item_' + index} overlay={this.props.tooltips ? this.tooltip(this.props.tooltips[index]) : this.tooltip(option)}>
                        {React.createElement('button',
                            { value: option,
                                className: (this.props.selected === option ? 'radioButtonCustom selectedAlignment' : 'radioButtonCustom unselectedAlignment'),
                                onClick: e => {this.props.click(option); e.stopPropagation();},
                            },
                            <i className="material-icons">{this.props.icons[index]}</i>)}
                    </OverlayTrigger>);
                })
        );

    }

    /**
     * Before component updates
     * @param nextProps React next props
     * @param nextState React next state
     * @returns {boolean} True
     */
    componentWillUpdate(nextProps, nextState) {
        return true;
    }

}
/**
 * Prop Types
 * @type {{key: shim, title: shim, options: shim, selected: shim, click: shim, tooltips: *, icons: *}}
 */
RadioButtonFormGroup.propTypes = {
    // key: PropTypes.string,
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    selected: PropTypes.any.isRequired,
    click: PropTypes.func.isRequired,
    tooltips: PropTypes.arrayOf(PropTypes.string),
    icons: PropTypes.arrayOf(PropTypes.string),
};

