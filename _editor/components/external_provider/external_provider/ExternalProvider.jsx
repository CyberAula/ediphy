import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import VishSearcherModal from '../external_searcher_modal/ExternalSearcherModal';
import VishUploaderModal from '../external_uploader_modal/ExternalUploaderModal';
import i18n from 'i18next';

/**
 * VishProvider Component
 */
export default class VishProvider extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.index = 0;
        /**
         * Component's initial state
         * @type {{searching: boolean, uploading: boolean, resourceUrl: string}}
         */
        this.state = {
            searching: false,
            uploading: false,
            resourceUrl: "",
        };
    }

    /**
     * Render React Component
     * @returns {XML}
     */
    render() {
        return (
            <FormGroup>
                <ControlLabel>{this.props.formControlProps.label}</ControlLabel>
                <FormControl {...this.props.formControlProps} onChange={e => {
                    this.props.formControlProps.onChange(e, this.state);
                }}/>
                <br />
                <Button className={'toolbarButton'}
                    onClick={() => {
                        this.setState({ searching: true });
                    }}>{i18n.t('Search_in_ViSH')}</Button>
                <br />
                <br />
                <Button className={'toolbarButton'}
                    onClick={() => {
                        this.setState({ uploading: true });
                    }}>{i18n.t('Upload_to_ViSH')}</Button>
                <VishSearcherModal visible={this.state.searching}
                    isBusy={this.props.isBusy}
                    fetchResults={this.props.fetchResults}
                    onVishSearcherToggled={(resourceUrl) => {
                        if(resourceUrl) {
                            this.props.onChange({ target: { value: resourceUrl } });
                        }
                        this.setState({ searching: !this.state.searching });
                    }}
                    onFetchVishResources={this.props.onFetchVishResources}/>
                <VishUploaderModal visible={this.state.uploading}
                    isBusy={this.props.isBusy}
                    onVishUploaderToggled={(resourceUrl) => {
                        if(resourceUrl) {
                            this.props.onChange({ target: { value: JSON.parse(resourceUrl).src } });
                        }
                        this.setState({ uploading: !this.state.uploading });
                    }}
                    onUploadVishResource={this.props.onUploadVishResource}/>
            </FormGroup>
        );
    }
}
