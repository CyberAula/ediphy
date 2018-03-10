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
            { format: "SCORM 1.2", handler: ()=> {this.props.scorm(false);} },
            { format: "SCORM 2004", handler: ()=> {this.props.scorm(true);} },
            { format: "HTML", handler: ()=> {this.props.export();} },
            { format: "PDF", handler: ()=> {this.props.export('PDF');} },
        ];
        return (
            <Modal className="pageModal exportoScormModalBody"
                show={this.props.show}
                backdrop={'static'}
                aria-labelledby="contained-modal-title-md"
                onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title><span id="previewTitle"> {i18n.t('messages.export_course')}</span></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overFlowY: 'auto' }}>
                    <Grid>
                        <form>
                            <Row>
                                <Col xs={12}>
                                    <FormGroup >
                                        <ControlLabel> {i18n.t("messages.export_to")}:</ControlLabel><br/>
                                        {exportFormats.map((format, i) => {
                                            return (<Radio key={i} name="radioGroup" className="radioExportScorm" checked={this.state.format === i}
                                                onChange={e => {this.setState({ format: i });}}>
                                                {format.format}<br/>
                                            </Radio>);
                                        })}
                                    </FormGroup>
                                    <div className={"explanation"}>{i18n.t("SCORM Explanation")}</div>

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
                    }}>{i18n.t("messages.export_course")}</Button>{'   '}
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
   * Function for exporting the course to HTML
   */
    export: PropTypes.func.isRequired,
    /**
   * Function for exporting the course to SCORM
   */
    scorm: PropTypes.func.isRequired,
    /**
   * Closes course configuration modal
   */
    close: PropTypes.func.isRequired,
};
