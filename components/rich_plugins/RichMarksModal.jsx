import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button, Row, FormGroup, ControlLabel, FormControl, Radio} from 'react-bootstrap';
import Typeahead from 'react-bootstrap-typeahead';
import {ID_PREFIX_RICH_MARK, ID_PREFIX_CONTAINED_VIEW} from '../../constants';

export default class RichMarksModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectMode: "new",
            displayMode: "navigate",
            newSelected: "slide",
            existingSelected: ""
        };
    }

    componentWillReceiveProps(nextProps) {
        let current = nextProps.currentRichMark;
        if (current) {
            this.setState({
                connectMode: current.connectMode || "new",
                displayMode: current.displayMode || "navigate",
                newSelected: (current.connectMode === "new" ? current.connection : "slide"),
                existingSelected: (current.connectMode === "existing" && nextProps.navItems[current.connection] ? nextProps.navItems[current.connection].name : "")
            });
        }
    }

    render() {
        let navItemsNames = [];
        this.props.navItemsIds.map(id => {
            if (id === 0) {
                return;
            }
            if (this.props.navItems[id].hidden) {
                return;
            }
            navItemsNames.push({name: this.props.navItems[id].name, id: id});
        });
        let current = this.props.currentRichMark;
        return (
            /* jshint ignore:start */
            <Modal className="pageModal" backdrop={true} bsSize="large" show={this.props.visible}>
                <Modal.Header>
                    <Modal.Title>{current ? "Edit rich mark" : "Add mark to rich plugin"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row>
                        <FormGroup>
                            <ControlLabel>Title</ControlLabel>
                            <FormControl ref="title"
                                         type="text"
                                         defaultValue={current ? current.title : ""}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Connect mode</ControlLabel>
                            <Radio value="new"
                                   name="connect_mode"
                                   checked={this.state.connectMode === "new"}
                                   onChange={e => {
                                        this.setState({connectMode: "new"});
                                   }}>Connect to new self contained view</Radio>
                            <Radio value="existing"
                                   name="connect_mode"
                                   checked={this.state.connectMode === "existing"}
                                   onChange={e => {
                                        this.setState({connectMode: "existing"});
                                   }}>Connect to existing view</Radio>
                            <Radio value="external"
                                   name="connect_mode"
                                   checked={this.state.connectMode === "external"}
                                   onChange={e => {
                                        this.setState({connectMode: "external"});
                                   }}>Connect to external URL</Radio>
                        </FormGroup>
                        <FormGroup style={{display: this.state.connectMode === "new" ? "initial" : "none"}}>
                            <FormControl componentClass="select"
                                         defaultValue={this.state.newSelected}
                                         style={{
                                            display: this.state.newSelected === "slide" || this.state.newSelected === "document" ? "initial" : "none"
                                         }}
                                         onChange={e => {
                                            this.setState({newSelected: e.nativeEvent.target.value});
                                         }}>
                                <option value="document">New document</option>
                                <option value="slide">New slide</option>
                            </FormControl>
                            <span style={{
                                display: this.state.newSelected === "slide" || this.state.newSelected === "document" ? "none" : "initial"
                                }}>
                                Connected to {this.state.newSelected}
                            </span>
                        </FormGroup>
                        <FormGroup style={{display: this.state.connectMode === "existing" ? "initial" : "none"}}>
                            <Typeahead options={navItemsNames}
                                       placeholder="Search view by name"
                                       labelKey="name"
                                       defaultSelected={[this.state.existingSelected]}
                                       onChange={items => {
                                           this.setState({existingSelected: items.length !== 0 ? items[0].id : ""});
                                       }}/>
                        </FormGroup>
                        <FormGroup style={{display: this.state.connectMode === "external" ? "initial" : "none"}}>
                            <FormControl ref="externalSelected"
                                         type="text"
                                         defaultValue={current && this.state.connectMode === "external" ? current.connection : ""}
                                         placeholder="URL"/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Display mode</ControlLabel>
                            <Radio name="display_mode"
                                   checked={this.state.displayMode === "navigate"}
                                   onChange={e => {
                                        this.setState({displayMode: "navigate"});
                                   }}>Navigate to content</Radio>
                            <Radio name="display_mode"
                                   checked={this.state.displayMode === "popup"}
                                   onChange={e => {
                                        this.setState({displayMode: "popup"});
                                   }}>Show as popup</Radio>
                            <Radio name="display_mode"
                                   checked={this.state.displayMode === "new_tab"}
                                   disabled={this.state.connectMode !== "external"}
                                   onChange={e => {
                                        this.setState({displayMode: "new_tab"});
                                   }}>Open in new tab</Radio>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Value</ControlLabel>
                            <FormControl ref="value"
                                         type="text"
                                         defaultValue={current ? current.value : ""}/>
                        </FormGroup>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={e => {
                        this.props.onRichMarksModalToggled();
                    }}>Cancel</Button>
                    <Button bsStyle="primary" onClick={e => {
                        let title = ReactDOM.findDOMNode(this.refs.title).value;
                        let connectMode = this.state.connectMode;
                        let connection;
                        switch (connectMode){
                            case "new":
                                connection = current ?
                                    current.connection :
                                    {
                                        id: ID_PREFIX_CONTAINED_VIEW + Date.now(),
                                        parent: this.props.boxSelected,
                                        boxes: [],
                                        type: this.state.newSelected,
                                        extraFiles: {}
                                    };
                                break;
                            case "existing":
                                connection = this.state.existingSelected;
                                break;
                            case "external":
                                connection = ReactDOM.findDOMNode(this.refs.externalSelected).value;
                            break;
                        }
                        let displayMode = this.state.displayMode;
                        let value = ReactDOM.findDOMNode(this.refs.value).value;
                        this.props.onRichMarkUpdated({id: (current ? current.id : ID_PREFIX_RICH_MARK + Date.now()), title, connectMode, connection, displayMode, value});
                        this.props.onRichMarksModalToggled();
                    }}>Save changes</Button>
                </Modal.Footer>
            </Modal>
            /* jshint ignore:end */
        );
    }
}
