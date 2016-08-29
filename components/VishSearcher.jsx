import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {FormGroup, FormControl, Button} from 'react-bootstrap';
import VishSearcherModal from './VishSearcherModal';
import Dali from './../core/main';

export default class VishSearcher extends Component {
    constructor(props) {
        super(props);
        this.index = 0;
        this.state = {
            modalVisible: false,
            resourceUrl: ""
        };
    }
    /*
     onChange={e=> {
     let value = e.target ? e.target.value : e.target;
     this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, value);

     if (!button.autoManaged) {
     button.callback(state, buttonKey, value, id);
     }
     }}
     */

    render() {
        return (
            /* jshint ignore:start */
            <FormGroup>
                <FormControl {...this.props.formControlProps} onChange={e => {
                    this.props.formControlProps.onChange(e, this.state);
                }} />
                <br />
                <Button onClick={() => {
                    this.setState({modalVisible: true});
                }}>Search in ViSH</Button>
                <VishSearcherModal visible={this.state.modalVisible}
                                   isBusy={this.props.isBusy}
                                   fetchResults={this.props.fetchResults}
                                   onVishSearcherToggled={(resourceUrl) => {
                                        if(resourceUrl){
                                            this.props.onChange({target: {value: resourceUrl}});
                                        }
                                        this.setState({modalVisible: !this.state.modalVisible});
                                   }}
                                   onFetchVishResources={this.props.onFetchVishResources}/>
            </FormGroup>
            /* jshint ignore:end */
        );
    }
}