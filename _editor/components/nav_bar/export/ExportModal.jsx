import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from '../../common/alert/Alert';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';

import ToggleSwitch from '@trendmicro/react-toggle-switch';
import i18n from 'i18next';
import './_exportModal.scss';
let spinner = require('../../../../dist/images/spinner.svg');

import { templatesSliDoc, templatesSli, templatesDoc } from "./templates/templates";
import './_templatesModal.scss';
import TemplateThumbnail from "./TemplateThumbnail";
import { createBox } from "../../../../common/common_tools";

/**
 * Export course modal
 */
export default class ExportModal extends Component {
    constructor(props) {
        super(props);
        this.templatesSliDoc = templatesSliDoc();
        this.templatesSli = templatesSli();
        this.templatesDoc = templatesDoc();
        this.state = {
            format: 0,
            showLoader: false,
            selfContained: false,
            showAlert: false,
            forcePageBreak: false,
            slidesPerPage: 2,
            slidesWithComments: false,
            optionName: "dafaultOption",
            drawBorder: true,

        };
    }

    /**
   * Renders React component
   * @returns {code}
   */
    render() {
        let callback = (fail)=> {
            this.setState({ showLoader: false });
            if (fail) {
                this.setState({ showAlert: true });
            } else {
                this.props.close(true);
            }

        };
        let exportFormats = [
            { format: "SCORM 1.2", handler: ()=> {this.props.scorm(false, callback, this.state.selfContained); } },
            { format: "SCORM 2004", handler: ()=> {this.props.scorm(true, callback, this.state.selfContained); } },
            { format: "HTML", handler: ()=> {this.props.export('HTML', callback, this.state.selfContained); } },
            { format: "PDF", formatRender: <span>PDF <sub className={"betaSub"}>BETA</sub></span>, handler: ()=> { this.props.export('PDF', callback, this.state);} },
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
                                <Col xs={12} md={12}>
                                    {this.state.showAlert ? (<Alert className="pageModal" show hasHeader acceptButtonText={i18n.t("messages.OK")}
                                        title={<span><i style={{ fontSize: '14px', marginRight: '5px' }} className="material-icons">warning</i>{i18n.t("messages.error")}</span>}
                                        onClose={()=>{ this.setState({ showAlert: false }); }}>
                                        <span> {i18n.t("error.generic")} </span><br/>
                                    </Alert>) : null}
                                    <FormGroup >
                                        <ControlLabel> {i18n.t("messages.export_to_label")}</ControlLabel><br/>
                                        {this.state.showLoader ? (<img className="spinnerFloat" src={spinner}/>) : null}
                                        {exportFormats.map((format, i) => {
                                            return (<Radio key={i} name="radioGroup" className="radioExportScorm" checked={this.state.format === i}
                                                onChange={e => {this.setState({ format: i });}}>
                                                {format.formatRender || format.format}<br/>
                                            </Radio>);
                                        })}
                                    </FormGroup>
                                </Col>
                                <Col xs={12} md={12}>
                                    <div className={"explanation"}>
                                        {this.state.format <= 1 ? i18n.t("SCORM Explanation") : null}
                                        {this.state.format === 2 ? i18n.t("HTML Explanation") : null}
                                        {/* {this.state.format === 3 ? i18n.t("PDF Explanation") : null}*/}
                                    </div>
                                </Col>
                                <Col xs={12} className={"explanation"}>
                                    {this.state.format !== 3 ?

                                        <div className={"selfContained"}>
                                            <div><ToggleSwitch onChange={()=>{this.setState({ selfContained: !this.state.selfContained });}} checked={this.state.selfContained}/></div>
                                            <div>{i18n.t('messages.selfContained')}</div></div> :
                                        <div>
                                            <PanelGroup accordion id="accordion-uncontrolled-example" defaultActiveKey="1">
                                                <Panel eventKey="1">
                                                    <Panel.Heading>
                                                        <Panel.Title toggle>Slides and pages</Panel.Title>
                                                    </Panel.Heading>
                                                    <Panel.Body collapsible>
                                                        <div className={"pageTemplates"}>
                                                            {this.templatesSliDoc.map((item, index) => {
                                                                let border = this.state.itemSelected === index ? "solid #17CFC8 3px" : "solid #eee 1px";
                                                                return (<div key={index} className="template_item" style={{ position: 'relative', border: border, width: (index === 0 || index === 2) ? '110px' : '80px', height: (index === 0 || index === 2) ? '80px' : '110px' }}>
                                                                    <TemplateThumbnail key={index} index={index}
                                                                        onClick={e => {
                                                                            this.setState({ itemSelected: index });
                                                                            switch (index) {
                                                                            case 0:
                                                                                this.setState({ slidesPerPage: 1, slidesWithComments: false, optionName: "fullSlideDoc" });
                                                                                break;
                                                                            case 1:
                                                                                this.setState({ slidesPerPage: 2, slidesWithComments: false, optionName: "twoSlideDoc" });
                                                                                break;
                                                                            default:
                                                                                this.setState({ slidesPerPage: 2, slidesWithComments: false, optionName: "defaultOption" });
                                                                                break;
                                                                            }
                                                                        }}
                                                                        boxes={item.boxes}/>
                                                                </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </Panel.Body>
                                                </Panel>
                                                <Panel eventKey="2">
                                                    <Panel.Heading>
                                                        <Panel.Title toggle>Slides</Panel.Title>
                                                    </Panel.Heading>
                                                    <Panel.Body collapsible>
                                                        <div className={"pageTemplates"}>
                                                            {this.templatesSli.map((item, index) => {
                                                                let border = this.state.itemSelected === index ? "solid #17CFC8 3px" : "solid #eee 1px";
                                                                return (<div key={index} className="template_item" style={{ position: 'relative', border: border, width: (index === 0 || index === 3) ? '110px' : '80px', height: (index === 0 || index === 3) ? '80px' : '110px' }}>
                                                                    <TemplateThumbnail key={index} index={index}
                                                                        onClick={e => {
                                                                            this.setState({ itemSelected: index });
                                                                            switch (index) {
                                                                            case 0:
                                                                                this.setState({ slidesPerPage: 1, slidesWithComments: false, optionName: "fullSlide" });
                                                                                break;
                                                                            case 1:
                                                                                this.setState({ slidesPerPage: 2, slidesWithComments: false, optionName: "twoSlide" });
                                                                                break;
                                                                            case 2:
                                                                                this.setState({ slidesPerPage: 2, slidesWithComments: true, optionName: "slideComments" });
                                                                                break;
                                                                            case 3:
                                                                                this.setState({ slidesPerPage: 4, slidesWithComments: false, optionName: "fourSlide" });
                                                                                break;
                                                                            default:
                                                                                this.setState({ slidesPerPage: 2, slidesWithComments: false, optionName: "defaultOption" });
                                                                                break;
                                                                            }
                                                                        }}
                                                                        boxes={item.boxes}/>
                                                                </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </Panel.Body>
                                                </Panel>
                                                <Panel eventKey="3">
                                                    <Panel.Heading>
                                                        <Panel.Title toggle>Pages</Panel.Title>
                                                    </Panel.Heading>
                                                    <Panel.Body collapsible>
                                                        <div className={"pageTemplates"}>
                                                            {this.templatesDoc.map((item, index) => {
                                                                let border = this.state.itemSelected === index ? "solid #17CFC8 3px" : "solid #eee 1px";
                                                                return (<div key={index} className="template_item" style={{ position: 'relative', border: border, width: index % 2 === 1 ? '110px' : '80px', height: index % 2 === 1 ? '80px' : '110px' }}>
                                                                    <TemplateThumbnail key={index} index={index}
                                                                        onClick={e => {
                                                                            this.setState({ itemSelected: index });
                                                                            switch (index) {
                                                                            case 0:
                                                                                this.setState({ slidesPerPage: 1, slidesWithComments: false, optionName: "fullDoc" });
                                                                                break;
                                                                            case 1:
                                                                                this.setState({ slidesPerPage: 2, slidesWithComments: false, optionName: "twoDoc" });
                                                                                break;
                                                                            default:
                                                                                this.setState({ slidesPerPage: 2, slidesWithComments: false, optionName: "defaultOption" });
                                                                                break;
                                                                            }
                                                                        }}
                                                                        boxes={item.boxes}/>
                                                                </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </Panel.Body>
                                                </Panel>
                                            </PanelGroup>

                                            <div className={"selfContained"}>
                                                <div><ToggleSwitch onChange={()=>{this.setState({ drawBorder: !this.state.drawBorder });}} checked={this.state.drawBorder}/></div>
                                                <div>{i18n.t('messages.draw_borders')}</div>
                                            </div>

                                        </div>

                                    }

                                </Col>
                            </Row>
                        </form>
                    </Grid>
                </Modal.Body>
                <Modal.Footer >
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
