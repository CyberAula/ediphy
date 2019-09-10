import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default class ToolbarFileProvider extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.index = 0;
    }

    /**
     * Render React Component
     * @returns {XML}
     */
    render() {
        let bckg = this.props.formControlProps ? (this.props.value !== undefined ? this.props.value : this.props.formControlProps.value) : null;
        let isURI = (/data\:/).test(bckg);
        let props = { ...this.props.formControlProps,
            placeholder: isURI ? 'http://...' : '',
            value: isURI ? '' : bckg };
        return (<FormGroup style={{ display: this.props.hide ? "none" : "block" }}>
            {this.props.formControlProps ? [<ControlLabel key={1}>{props.label}</ControlLabel>,
                <FormControl key={2}{...props} onChange={e => {
                    this.props.onChange({ value: e.target.value });
                }}/>] : null}
            <Button className={'toolbarButton'}
                onClick={() => {
                    this.props.openModal(this.props.id, this.props.accept);
                }}>{this.props.buttontext}</Button>
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
