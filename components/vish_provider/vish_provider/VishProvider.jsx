import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import VishSearcherModal from './../vish_searcher_modal/VishSearcherModal';
import VishUploaderModal from './../vish_uploader_modal/VishUploaderModal';
import Dali from './../../../core/main';

export default class VishProvider extends Component {
    constructor(props) {
        super(props);
        this.index = 0;
        this.state = {
            searching: false,
            uploading: false,
            resourceUrl: ""
        };
    }

    render() {
        return (
            /* jshint ignore:start */
            <FormGroup>
                <ControlLabel>{this.props.formControlProps.label}</ControlLabel>
                <FormControl {...this.props.formControlProps} onChange={e => {
                    this.props.formControlProps.onChange(e, this.state);
                }}/>
                <br />
                <Button className={'toolbarButton'}
                        onClick={() => {
                    this.setState({searching: true});
                }}>{Dali.i18n.t('Search_in_ViSH')}</Button>
                <br />
                <br />
                <Button className={'toolbarButton'}
                        onClick={() => {
                    this.setState({uploading: true});
                }}>{Dali.i18n.t('Upload_to_ViSH')}</Button>
                <VishSearcherModal visible={this.state.searching}
                                   isBusy={this.props.isBusy}
                                   fetchResults={this.props.fetchResults}
                                   onVishSearcherToggled={(resourceUrl) => {
                                        if(resourceUrl){
                                            this.props.onChange({target: {value: resourceUrl}});
                                        }
                                        this.setState({searching: !this.state.searching});
                                   }}
                                   onFetchVishResources={this.props.onFetchVishResources}/>
                <VishUploaderModal visible={this.state.uploading}
                                   isBusy={this.props.isBusy}
                                   onVishUploaderToggled={(resourceUrl) => {
                                        if(resourceUrl){
                                            this.props.onChange({target: {value: resourceUrl}});
                                        }
                                        this.setState({uploading: !this.state.uploading});
                                   }}
                                   onUploadVishResource={this.props.onUploadVishResource}/>
            </FormGroup>
            /* jshint ignore:end */
        );
    }
}