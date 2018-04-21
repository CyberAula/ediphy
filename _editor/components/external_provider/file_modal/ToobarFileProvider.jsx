
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
        let bckg = (this.props.value !== undefined ? this.props.value : this.props.formControlProps.value);
        // bckg = bckg instanceof Object ? '' : bckg;
        let props = { ...this.props.formControlProps, value: bckg, label: this.props.label || this.props.formControlProps.label || 'URL' };
        return (<FormGroup>
            <ControlLabel>{props.label}</ControlLabel>
            <FormControl {...props} onChange={e => {
                props.onChange(e);
            }}/>
            <Button className={'toolbarButton'}
                onClick={() => {
                    this.setState({ open: true });
                    this.props.openModal(props.id, props.accept);
                }}>{i18n.t('Importar')}</Button>
        </FormGroup>);
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.fileModalResult &&
            nextProps.fileModalResult &&
            nextProps.id === nextProps.fileModalResult.id
            && nextProps.fileModalResult.value &&
            this.state.open && this.props.fileModalResult.value !== nextProps.fileModalResult.value) {
            console.log(22222);
            this.props.formControlProps.onChange({ value: nextProps.fileModalResult.value });
            this.setState({ open: false });
        }
    }
}

ToolbarFileProvider.propTypes = {

};
