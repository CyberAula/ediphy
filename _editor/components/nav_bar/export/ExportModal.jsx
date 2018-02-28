import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import i18n from 'i18next';
import './_exportModal.scss';
/**
 * Export course modal
 */
export default class ExportModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            format: 0,
        };
    }

    /**
   * Renders React component
   * @returns {code}
   */
    render() {
        let exportFormats = [
            { format: "SCORM 1.2", handler: ()=> {this.props.export(); alert("Exporting to SCORM 1.2");} },
            { format: "SCORM 2004", handler: ()=> {this.props.export(); alert("Exporting to SCORM 2004");} },
            { format: "HTML", handler: ()=> {this.props.export(); alert("Exporting to HTML");} },
        ];
        return (
            <Modal className="pageModal"
                show={this.props.show}
                backdrop={'static'} bsSize="large"
                aria-labelledby="contained-modal-title-lg"
                onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title><span id="previewTitle">{i18n.t('export_scorm')}</span></Modal.Title>
                </Modal.Header>
                <Modal.Body className="exportoScormModalBody" style={{ overFlowY: 'auto' }}>
                    <Grid>
                        <form>
                            <Row>
                                <Col xs={12} md={7} lg={7}>
                                    <FormGroup >
                                        <ControlLabel> {i18n.t("export_to")}</ControlLabel><br/>
                                        {exportFormats.map((format, i) => {
                                            return (<Radio name="radioGroup" className="radioExportScorm" checked={this.state.format === i}
                                                onChange={e => {this.setState({ format: i });}}>
                                                {format.format}<br/>
                                            </Radio>);
                                        })}
                                    </FormGroup>
                                </Col>
                            </Row>
                        </form>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="default" id="cancel_export_to_scorm" onClick={e => {
                        this.props.close(); e.preventDefault();
                    }}>{i18n.t("global_config.Discard")}</Button>
                    <Button bsStyle="primary" id="accept_export_to_scorm" onClick={e => {
                        exportFormats[this.state.format].handler(); e.preventDefault(); this.props.close();
                    }}>{i18n.t("global_config.Accept")}</Button>{'   '}
                </Modal.Footer>
            </Modal>
        );
    }

}

ExportModal.propTypes = {
    /**
   * Indicates whether the course configuration modal should be shown or hidden
   */
    show: PropTypes.bool,
    /**
   * Configuration course dictionary. Object identical to Redux state ***globalConfig*** .
   */
    globalConfig: PropTypes.object.isRequired,
    /**
   * Saves new configuration
   */
    changeGlobalConfig: PropTypes.func.isRequired,
    /**
   * Closes course configuration modal
   */
    close: PropTypes.func.isRequired,
};
