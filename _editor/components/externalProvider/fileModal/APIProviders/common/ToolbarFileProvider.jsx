import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ToolbarButton } from "../../../../toolbar/toolbarComponents/Styles";

export default class ToolbarFileProvider extends Component {

    /**
     * Render React Component
     * @returns {XML}
     */
    render() {
        const { accept, buttontext, formControlProps, hide, id, value, onChange, openModal } = this.props;
        const bckg = value ?? formControlProps?.value ?? null;
        const isURI = (/data\:/).test(bckg);
        const props = { ...formControlProps, placeholder: isURI ? 'http://...' : '', value: isURI ? '' : bckg };
        return (
            <FormGroup style={{ display: hide ? "none" : "block" }}>
                {formControlProps ? [<ControlLabel key={1}>{props.label}</ControlLabel>,
                    <FormControl key={2}{...props} onChange={e => {
                        onChange({ value: e.target.value });
                    }}/>] : null}
                <ToolbarButton
                    onClick={() => {
                        openModal(id, accept);
                    }}>{buttontext}</ToolbarButton>
            </FormGroup>);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.id === nextProps.fileModalResult?.id
            && ((!this.props.fileModalResult && nextProps.fileModalResult.value)
            || (this.props.fileModalResult.value !== nextProps.fileModalResult.value))) {
            this.props.onChange({ value: nextProps.fileModalResult.value });
        }
    }
}

ToolbarFileProvider.propTypes = {
    /**
     * Toolbar input inherited props
     */
    formControlProps: PropTypes.object,
    /**
     * Input Value
     */
    value: PropTypes.any,
    /**
     * Open File Modal
     */
    openModal: PropTypes.func,
    /**
     * Id of the box/page being edited
     */
    id: PropTypes.any,
    /**
     * Mime Type accepted
     */
    accept: PropTypes.string,
    /**
     * Button text
     */
    buttontext: PropTypes.string,
    /**
     * Last files uploaded to server or searched in modal
     */
    fileModalResult: PropTypes.object,
    /**
     * Toolbar change callback
     */
    onChange: PropTypes.func,
    /**
     * Hide external provider input type
     */
    hide: PropTypes.bool,

};
