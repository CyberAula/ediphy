import React, {Component} from 'react';
import {Modal, Button, Tabs, Tab} from 'react-bootstrap';
import {ID_PREFIX_BOX, ID_PREFIX_SORTABLE_BOX, BOX_TYPES} from '../constants';

export default class BoxModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttons: [],
            show: this.props.visibility
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({show: nextProps.visibility});
    }

    render() {
        return (
        <Modal show={this.state.show} backdrop={true} bsSize="large" onHide={e => this.props.onVisibilityToggled(null, false, false)}>
            <Modal.Header closeButton>
                <Modal.Title>Plugin Selection</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Tabs position="left">
                    <Tab eventKey={0} title="Temp">
                        <Button bsSize="large" onClick={e => this.props.onBoxAdded(this.props.caller, ID_PREFIX_BOX + Date.now(), (this.props.fromSortable ? BOX_TYPES.INNER_SORTABLE : BOX_TYPES.NORMAL), true, true)}>Add simple box</Button>
                        <Button bsSize="large" disabled={this.props.fromSortable ? true : false} onClick={e => this.props.onBoxAdded(this.props.caller, ID_PREFIX_SORTABLE_BOX + Date.now(), BOX_TYPES.SORTABLE, false, false)}>Add sortable</Button>
                    </Tab>
                    <Tab eventKey={1} title="Text">
                        {this.state.buttons.map((id, index) => {
                            if(this.state.buttons[index].category === 'text')
                                return <Button key={index} bsSize="large" onClick={this.buttonCallback.bind(this, index)}>{this.state.buttons[index].name}</Button>;
                        })}
                    </Tab>
                    <Tab eventKey={2} title="Images">
                        {this.state.buttons.map((id, index) => {
                            if(this.state.buttons[index].category === 'image') {
                                return <Button key={index} bsSize="large" onClick={this.buttonCallback.bind(this, index)}>{this.state.buttons[index].name}</Button>;
                            }
                        })}
                    </Tab>
                    <Tab eventKey={3} title="Multimedia">
                        {this.state.buttons.map((id, index) => {
                            if(this.state.buttons[index].category === 'multimedia')
                                return <Button key={index} bsSize="large" onClick={this.buttonCallback.bind(this, index)}>{this.state.buttons[index].name}</Button>;
                        })}
                    </Tab>
                    <Tab eventKey={4} title="Animations">
                        {this.state.buttons.map((id, index) => {
                            if(this.state.buttons[index].category === 'animations')
                                return <Button key={index} bsSize="large" onClick={this.buttonCallback.bind(this, index)}>{this.state.buttons[index].name}</Button>;
                        })}
                    </Tab>
                    <Tab eventKey={5} title="Exercises">
                        {this.state.buttons.map((id, index) => {
                            if(this.state.buttons[index].category === 'exercises')
                                return <Button key={index} bsSize="large" onClick={this.buttonCallback.bind(this, index)}>{this.state.buttons[index].name}</Button>;
                        })}
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
        );
    }

    componentDidMount(){
        Dali.API.Private.listenEmission(Dali.API.Private.events.addMenuButton, e =>{
            this.setState({buttons: this.state.buttons.concat([e.detail])});
        })
    }

    buttonCallback(index){
        this.setState({show: false});
        this.state.buttons[index].callback();
    }
}