import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Modal,Grid,Row,Col, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import i18n from 'i18next';

require('./_globalConfig.scss');

export default class GlobalConfig extends Component {
     constructor(props) {
        super(props);
        this.state = {
            courseTitle : "Título curso"
        };
    }

    render() {
        
        return (
            /* jshint ignore:start */
            <Modal className="visor modalVisorContainer"
                   show={this.props.show}
                   backdrop={true} bsSize="large"
                   aria-labelledby="contained-modal-title-lg"
                   onHide={e => {this.props.close()}}>
                <Modal.Header closeButton>
                    <Modal.Title><span id="previewTitle">{i18n.t('messages.global_config')}</span></Modal.Title>
                </Modal.Header>

                <Modal.Body className="gcModalBody">
                     <Grid>
                        <form>
                            <Row>
                                <Col xs={12} md={6} lg={4}>
                                    <br/>
                                    <FormGroup controlId="formBasicText"
                                               validationState={null}>
                                        <ControlLabel>Working example with validation</ControlLabel>
                                        <FormControl   type="text"
                                                       value={this.state.courseTitle}
                                                       placeholder="Enter text"
                                                       onChange={e => { console.log(e);this.setState({courseTitle: e.target.value})}}/>
                                    </FormGroup>
                                </Col>
                                <Col xs={12} md={6} lg={4}>
                                <br/>
                                {this.state.courseTitle}
                                </Col>
                                <Col xs={12} md={6} lg={4}></Col>
                            </Row>
                        </form>
                     </Grid>
                 </Modal.Body>
            </Modal>
            /* jshint ignore:end */
        );
    }

}
