import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from '../../common/alert/Alert';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import i18n from 'i18next';
import './_exportModal.scss';
let spinner = require('../../../../dist/images/spinner.svg');
/**
 * Export course modal
 */
export default class ExportModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            format: 0,
            showLoader: false,
            selfContained: false,
            showAlert: false,
        };
    }

    /**
   * Renders React component
   * @returns {code}
   */
    render() {
        let callback = (fail)=> {
            this.setState({ showLoader: false });
            console.log(fail);
            if (fail) {
                this.setState({ showAlert: true });
            } else {
                this.props.close();
            }

        };
        let exportFormats = [
            { format: "SCORM 1.2", handler: ()=> {this.props.scorm(false, callback, this.state.selfContained); } },
            { format: "SCORM 2004", handler: ()=> {this.props.scorm(true, callback, this.state.selfContained); } },
            { format: "HTML", handler: ()=> {this.props.export('HTML', callback, this.state.selfContained); } },
            { format: "PDF", handler: ()=> { this.props.export('PDF', callback, this.state.selfContained);} },
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
                                <Col xs={12} md={6}>
                                    {this.state.showAlert ? (<Alert className="pageModal" show hasHeader acceptButtonText={i18n.t("messages.OK")}
                                        title={<span><i style={{ fontSize: '14px', marginRight: '5px' }} className="material-icons">warning</i>{i18n.t("messages.error")}</span>}
                                        onClose={()=>{ this.setState({ showAlert: false }); }}>
                                        <span> {i18n.t("error.generic")} </span><br/>
                                    </Alert>) : null}
                                    <FormGroup >
                                        <ControlLabel> {i18n.t("messages.export_to")}:</ControlLabel><br/>
                                        {this.state.showLoader ? (<img className="spinnerFloat" src={spinner}/>) : null}
                                        {exportFormats.map((format, i) => {
                                            return (<Radio key={i} name="radioGroup" className="radioExportScorm" checked={this.state.format === i}
                                                onChange={e => {this.setState({ format: i });}}>
                                                {format.format}<br/>
                                            </Radio>);
                                        })}

                                    </FormGroup>
                                </Col>
                                <Col xs={12} md={6} className={"explanation"}>
                                    <br/><br/>
                                    {this.state.format !== 3 ? <div><ToggleSwitch onChange={()=>{this.setState({ selfContained: !this.state.selfContained });}} checked={this.state.selfContained}/>
                                        {i18n.t('messages.selfContained')}</div> : null}
                                </Col>
                                <Col xs={12}>
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
                        this.setState({ showLoader: true });
                        exportFormats[this.state.format].handler(); e.preventDefault();
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
