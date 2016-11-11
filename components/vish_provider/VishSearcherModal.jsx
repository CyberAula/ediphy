import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import Dali from './../../core/main';

export default class VishSearcherModal extends Component {
    constructor(props) {
        super(props);
        this.index = 0;
        this.state = {
            itemSelected: 0,
            resourceUrl: ""
        };
    }

    render() {
        return (
            /* jshint ignore:start */
            <Modal className="pageModal" backdrop={true} bsSize="large" show={this.props.visible}>
                <Modal.Header>
                    <Modal.Title>BUSCADOR VISH</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col md={4}>
                                <ControlLabel>Términos de búsqueda</ControlLabel>
                                <FormControl ref="query" type="text"/>
                            </Col>
                            <Col md={3}>
                                <ControlLabel>Búsqueda por tipo</ControlLabel>
                                <FormControl ref="type" componentClass="select">
                                    <option value="Picture">Picture</option>
                                    {/*
                                     <option value="Resource">All</option>
                                     <option value="Audio">Audio</option>
                                     <option value="Embed">Embed</option>
                                     <option value="Excursion">Excursion</option>
                                     <option value="Swf">Flash Object</option>
                                     <option value="Link">Link</option>
                                     <option value="Officedoc">Office Document</option>
                                     <option value="Scormfile">SCORM Package</option>
                                     <option value="Video">Video</option>
                                     <option value="Webapp">Web Application</option>
                                     <option value="Workshop">Workshop</option>
                                     <option value="Writing">Writing</option>
                                     <option value="Zipfile">ZIP File</option>
                                     */}
                                </FormControl>
                            </Col>
                            <Col md={3}>
                                <ControlLabel>Ordenar por</ControlLabel>
                                <FormControl ref="sort_by" componentClass="select">
                                    <option value="ranking">Ranking</option>
                                    <option value="popularity">Popularity</option>
                                    <option value="modification">Modification</option>
                                    <option value="creation">Creation</option>
                                    <option value="visits">Visits</option>
                                    <option value="favorites">Likes</option>
                                    <option value="quality">Quality</option>
                                </FormControl>
                            </Col>
                            <Col md={2} >
                                <Button onClick={(e) => {
                                     let url = encodeURI(Dali.Config.search_vish_url +
                                        "?q=" + ReactDOM.findDOMNode(this.refs.query).value +
                                        "&type=" + ReactDOM.findDOMNode(this.refs.type).value +
                                        "&sort_by=" + ReactDOM.findDOMNode(this.refs.sort_by).value
                                     );

                                     this.props.onFetchVishResources(url);
                                }}>Search
                                </Button>
                            </Col>
                        </FormGroup>

                    </Form>
                    <Form style={{minHeight: 250}}>
                        {this.props.fetchResults.total_results ?
                            (
                                <FormGroup>
                                    <ControlLabel>{ this.props.fetchResults.total_results + " Resultados"}</ControlLabel>
                                    <br />
                                    {this.props.fetchResults.results.map((item, index) => {
                                        let border = this.state.itemSelected === index ? "solid orange 3px" : "solid transparent 3px";
                                        return (
                                            <img key={index}
                                                 src={item.file_url}
                                                 style={{
                                                    width: 160,
                                                    height: 160,
                                                    border: border
                                                 }}
                                                 onClick={e => {
                                                    this.setState({
                                                        itemSelected: index,
                                                        resourceUrl: item.file_url
                                                    });
                                                 }}
                                            />
                                        )
                                    })}
                                </FormGroup>
                            ) :
                            (
                                <FormGroup>
                                    <ControlLabel>{this.props.isBusy.msg}</ControlLabel>
                                </FormGroup>
                            )
                        }
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={e => {
                        this.props.onVishSearcherToggled();
                    }}>Cancel</Button>
                    <Button bsStyle="primary" onClick={e => {
                        this.props.onVishSearcherToggled(this.state.resourceUrl);
                    }}>Save changes</Button>
                </Modal.Footer>
            </Modal>
            /* jshint ignore:end */
        );
    }
}
