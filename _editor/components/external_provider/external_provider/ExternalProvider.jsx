import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import ExternalSearcherModal from '../external_searcher_modal/ExternalSearcherModal';
import ExternalUploaderModal from '../external_uploader_modal/ExternalUploaderModal';
import i18n from 'i18next';

/**
 * ExternalProvider Component
 */
export default class ExternalProvider extends Component {
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
                { Dali.Config.external_providers.enable_search &&
                <Button className={'toolbarButton'}
                    onClick={() => {
                        this.setState({ searching: true });
                    }}>{i18n.t('Search_in_ViSH')}</Button>}
                <br />
                <br />
                { Dali.Config.external_providers.enable_external_upload &&
                <Button className={'toolbarButton'}
                    onClick={() => {
                        this.setState({ uploading: true });
                    }}>{i18n.t('Upload_to_ViSH')}</Button>}
                { Dali.Config.external_providers.enable_search &&
                <ExternalSearcherModal visible={this.state.searching}
                    isBusy={this.props.isBusy}
                    fetchResults={this.props.fetchResults}
                    onExternalSearcherToggled={(resourceUrl) => {
                        if(resourceUrl) {
                            this.props.onChange({ target: { value: resourceUrl } });
                        }
                        this.setState({ searching: !this.state.searching });
                    }}
                    onFetchVishResources={this.props.onFetchVishResources}/>}
                { Dali.Config.external_providers.enable_external_upload &&
                <ExternalUploaderModal visible={this.state.uploading}
                                       accept={this.props.accept}
                                       isBusy={this.props.isBusy}
                                       onExternalUploaderToggled={(resourceUrl) => {
                        if(resourceUrl) {
                            this.props.onChange({ target: { value: resourceUrl } });
                        }
                        this.setState({ uploading: !this.state.uploading });
                    }}
                                       onUploadVishResource={this.props.onUploadVishResource}/>}
            </FormGroup>
        );
    }
}
