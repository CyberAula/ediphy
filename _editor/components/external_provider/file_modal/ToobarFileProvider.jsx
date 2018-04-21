
import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import i18n from 'i18next';
import PropTypes from 'prop-types';

/**
 * ExternalProvider Component
 */
export default class ToolbarFileProvider extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.index = 0;
        /**
         * Component's initial state
         */
        this.state = {
            open: false,
        };
    }

    /**
     * Render React Component
     * @returns {XML}
     */
    render() {
        return (<FormGroup>
            <ControlLabel>{this.props.formControlProps.label}</ControlLabel>
            <FormControl {...this.props.formControlProps} onChange={e => {
                this.props.formControlProps.onChange(e);
            }}/>
            <Button className={'toolbarButton'}
                onClick={() => {
                    this.setState({ open: true });
                    this.props.openModal(this.props.id, this.props.accept);
                }}>{i18n.t('Importar')}</Button>
        </FormGroup>);
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.fileModalResult &&
            nextProps.fileModalResult &&
            nextProps.id === nextProps.fileModalResult.id
            && nextProps.fileModalResult.value &&
            this.state.open && this.props.fileModalResult.value !== nextProps.fileModalResult.value) {
            this.props.formControlProps.onChange({ value: nextProps.fileModalResult.value });
            this.setState({ open: false });
        }
    }
}

ToolbarFileProvider.propTypes = {

};
