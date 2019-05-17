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
import TemplateThumbnailPrint from "./TemplateThumbnailPrint";
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
            showPrintAlert: false,
            forcePageBreak: false,
            slidesPerPage: 2,
            slidesWithComments: false,
            optionName: "fullSlideDoc",
            drawBorder: true,
            explanation: i18n.t("export.full_sli_doc"),
            landscape: false,
            itemSelected: 0,
            settingType: 1,

        };
    }

    /**
   * Renders React component
   * @returns {code}
   */
    render() {
        let callback = (fail)=> {
            this.setState({ showLoader: false });
            if(fail === "nullPrint") {
                this.setState({ showLoader: false, showPrintAlert: true });
            } else if (fail) {
                this.setState({ showAlert: true });
            } else {
                this.props.close(true);
            }
        };

        let isSafari = (/constructor/i).test(window.HTMLElement) || (function(p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification));
        let isFirefox = typeof InstallTrigger !== 'undefined';
        let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

        let aspectRatio = this.props.aspectRatio;

        let cancelEvent = new Event('canceled');

        let exportFormats = [
            { format: "SCORM 1.2", handler: ()=> {this.props.scorm(false, callback, this.state.selfContained); } },
            { format: "SCORM 2004", handler: ()=> {this.props.scorm(true, callback, this.state.selfContained); } },
            { format: "HTML", handler: ()=> {this.props.export('HTML', callback, this.state.selfContained); } },
            { format: "PDF", formatRender: <span>PDF <sub className={"betaSub"}>BETA</sub></span>, handler: ()=> { this.props.export('PDF', callback, this.state);} },
            { format: "EDI", handler: ()=> {this.props.export('edi', callback, this.state.selfContained); } },
            { format: "MoodleXML", handler: () => {this.props.export('MoodleXML', callback, this.state.selfContained); } },
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
                                        onClose={()=>{ this.setState({ showAlert: false, showLoader: false }); }}>
                                        <span> {i18n.t("error.generic")} </span><br/>
                                    </Alert>) : null}

                                    {this.state.showPrintAlert ? (<Alert className="pageModal" show hasHeader acceptButtonText={i18n.t("messages.OK")}
                                        title={<span><i style={{ fontSize: '14px', marginRight: '5px' }} className="material-icons">warning</i>{i18n.t("messages.error")}</span>}
                                        onClose={()=>{ this.setState({ showPrintAlert: false, showLoader: false }); }}>
                                        <div> <p><b>{i18n.t("export.null_print")}</b></p>
                                            <ul className={"print-settings-explanation"}>
                                                <li className={"error-setting"}><span className={"setting-title"}>{i18n.t("export.sli_doc")}:</span> <span> {i18n.t("export.sli_doc_explanation")}</span></li>
                                                <li className={"error-setting"}><span className={"setting-title"}>{i18n.t("export.sli")}:</span> <span> {i18n.t("export.sli_explanation")}</span></li>
                                                <li className={"error-setting"}><span className={"setting-title"}>{i18n.t("export.doc")}:</span> <span> {i18n.t("export.doc_explanation")}</span></li>
                                            </ul>

                                        </div><br/>
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
                                        {this.state.format === 4 ? i18n.t("EDI Explanation") : null}
                                        {(this.state.format !== 3 && this.state.format !== 4) ? <div className={"selfContained"}>
                                            <div><ToggleSwitch onChange={()=>{this.setState({ selfContained: !this.state.selfContained });}} checked={this.state.selfContained}/></div>
                                            <div>{i18n.t('messages.selfContained')}</div></div> : null}

                                        {(this.state.format !== 3) ? null : (
                                            <div>
                                                <PanelGroup accordion id="accordion-uncontrolled-example" defaultActiveKey="1">
                                                    <Panel eventKey="1">
                                                        <Panel.Heading>
                                                            <Panel.Title toggle>{i18n.t('messages.slides_and_pages')}<em className={"material-icons expandArrow"}>expand_more</em></Panel.Title>
                                                        </Panel.Heading>
                                                        <Panel.Body collapsible>
                                                            <div className={"pageTemplates"}>
                                                                {this.templatesSliDoc.map((item, index) => {
                                                                    let border = (this.state.itemSelected === index && this.state.settingType === 1) ? "solid #17CFC8 3px" : "solid #eee 1px";
                                                                    return (<div key={index} className="template_item" style={{ position: 'relative', border: border, width: (index === 0 || index === 2) ? '110px' : '80px', height: (index === 0 || index === 2) ? '80px' : '110px' }}>
                                                                        <TemplateThumbnailPrint key={index} index={index}
                                                                            onClick={e => {
                                                                                this.setState({ itemSelected: index });
                                                                                switch (index) {
                                                                                case 0:
                                                                                    this.setState({ slidesPerPage: 1, slidesWithComments: false, settingType: 1, optionName: "fullSlideDoc", explanation: i18n.t("export.full_sli_doc"), landscape: true });
                                                                                    break;
                                                                                case 1:
                                                                                    this.setState({ slidesPerPage: 2, slidesWithComments: false, settingType: 1, optionName: "twoSlideDoc", explanation: i18n.t("export.two_sli_doc"), landscape: false });
                                                                                    break;
                                                                                default:
                                                                                    this.setState({ slidesPerPage: 2, slidesWithComments: false, settingType: 1, optionName: "defaultOption" });
                                                                                    break;
                                                                                }
                                                                            }}
                                                                            boxes={item.boxes}/>
                                                                        {/* <div className={'template_name'} style={{ display: this.state.itemSelected === index ? 'block' : 'none' }}>{item.name}</div>*/}
                                                                    </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </Panel.Body>
                                                    </Panel>
                                                    <Panel eventKey="2">
                                                        <Panel.Heading>
                                                            <Panel.Title toggle>{i18n.t('messages.only_slides')}<em className={"material-icons expandArrow"}>expand_more</em></Panel.Title>
                                                        </Panel.Heading>
                                                        <Panel.Body collapsible>
                                                            <div className={"pageTemplates"}>
                                                                {this.templatesSli.map((item, index) => {
                                                                    let border = (this.state.itemSelected === index && this.state.settingType === 2) ? "solid #17CFC8 3px" : "solid #eee 1px";
                                                                    return (<div key={index} className="template_item" style={{ display: ((index === 0 && !isChrome) || (index === 4 && isFirefox)) ? 'none' : 'flex', position: 'relative', border: border,
                                                                        width: isChrome ? ((index === 0) ? '100px' : ((index === 1 || index === 4) ? '100px' : '70px')) : (index === 0 || index === 1 || index === 4) ? '110px' : '80px',
                                                                        height: isChrome ? ((index === 0) ? (aspectRatio === (16 / 9) ? '60px' : '75px') : ((index === 1 || index === 4) ? '70px' : '100px')) : (index === 0 || index === 1 || index === 4) ? '80px' : '110px' }}>
                                                                        <TemplateThumbnailPrint key={index} index={index}
                                                                            onClick={e => {
                                                                                this.setState({ itemSelected: index });

                                                                                switch (index) {
                                                                                case 0:
                                                                                    this.setState({ slidesPerPage: 1, slidesWithComments: false, settingType: 2, optionName: "fullSlideCustom", explanation: i18n.t("export.full_sli"), landscape: true });
                                                                                    break;
                                                                                case 1:
                                                                                    this.setState({ slidesPerPage: 1, slidesWithComments: false, settingType: 2, optionName: "fullSlide", explanation: i18n.t("export.full_sli"), landscape: true });
                                                                                    break;
                                                                                case 2:
                                                                                    this.setState({ slidesPerPage: 2, slidesWithComments: false, settingType: 2, optionName: "twoSlide", explanation: i18n.t("export.two_sli"), landscape: false });
                                                                                    break;
                                                                                case 3:
                                                                                    this.setState({ slidesPerPage: 2, slidesWithComments: true, settingType: 2, optionName: "slideComments", explanation: i18n.t("export.sli_comments"), landscape: false });
                                                                                    break;
                                                                                case 4:
                                                                                    this.setState({ slidesPerPage: 4, slidesWithComments: false, settingType: 2, optionName: "fourSlide", explanation: i18n.t("export.four_sli"), landscape: true });
                                                                                    break;
                                                                                default:
                                                                                    this.setState({ slidesPerPage: 2, slidesWithComments: false, settingType: 2, optionName: "defaultOption", explanation: i18n.t("export.full_sli") });
                                                                                    break;
                                                                                }
                                                                            }}
                                                                            boxes={item.boxes}/>
                                                                        {/* <div className={'template_name'} style={{ display: this.state.itemSelected === index ? 'block' : 'none' }}>{item.name}</div>*/}

                                                                    </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </Panel.Body>
                                                    </Panel>
                                                    <Panel eventKey="3">
                                                        <Panel.Heading>
                                                            <Panel.Title toggle>{i18n.t('messages.only_pages')}<em className={"material-icons expandArrow"}>expand_more</em></Panel.Title>
                                                        </Panel.Heading>
                                                        <Panel.Body collapsible>
                                                            <div className={"pageTemplates"}>
                                                                {this.templatesDoc.map((item, index) => {
                                                                    let border = (this.state.itemSelected === index && this.state.settingType === 3) ? "solid #17CFC8 3px" : "solid #eee 1px";
                                                                    return (<div key={index} className="template_item" style={{ display: ((isSafari || isFirefox) && (index === 1)) ? 'none' : 'flex', position: 'relative', border: border, width: index % 2 === 1 ? '110px' : '80px', height: index % 2 === 1 ? '80px' : '110px' }}>
                                                                        <TemplateThumbnailPrint key={index} index={index}
                                                                            onClick={e => {
                                                                                this.setState({ itemSelected: index });
                                                                                switch (index) {
                                                                                case 0:
                                                                                    this.setState({ slidesPerPage: 1, slidesWithComments: false, settingType: 3, optionName: "fullDoc", explanation: i18n.t("export.full_doc"), landscape: false });
                                                                                    break;
                                                                                case 1:
                                                                                    this.setState({ slidesPerPage: 2, slidesWithComments: false, settingType: 3, optionName: "twoDoc", explanation: i18n.t("export.two_doc"), landscape: true });
                                                                                    break;
                                                                                default:
                                                                                    this.setState({ slidesPerPage: 2, slidesWithComments: false, settingType: 3, optionName: "defaultOption" });
                                                                                    break;
                                                                                }
                                                                            }}
                                                                            boxes={item.boxes}/>
                                                                        {/* <div className={'template_name'} style={{ display: this.state.itemSelected === index ? 'block' : 'none' }}>{item.name}</div>*/}
                                                                    </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </Panel.Body>
                                                    </Panel>
                                                </PanelGroup>
                                                <div className={"print-explanation"}>
                                                    <div className={"print-explanation-title"}><em className={"material-icons printer-icon"}>print</em> Print settings</div>
                                                    <div className={"print-explanation-body"}> {this.state.explanation} </div>
                                                </div>
                                                {(isSafari || isFirefox) ?
                                                    <div className={"browser-explanation"}>
                                                        <div className={"browser-explanation-title"}><em className={"material-icons warning-icon"}>warning</em> Warning</div>

                                                        {(this.state.landscape) ? (isSafari ?
                                                            <div>{i18n.t("export.safari_landscape")}</div> : (isFirefox ?
                                                                <div>{i18n.t("export.firefox_landscape")}</div> : null)) : (isSafari ?
                                                            <div>{i18n.t("export.safari_portrait")}</div> : (isFirefox ?
                                                                <div>{i18n.t("export.firefox_portrait")}</div> : null))}</div>
                                                    : null}

                                                <div className={"selfContained"}>
                                                    <div><ToggleSwitch onChange={()=>{this.setState({ drawBorder: !this.state.drawBorder });}} checked={this.state.drawBorder}/></div>
                                                    <div>{i18n.t('messages.draw_borders')}</div>
                                                </div>

                                            </div>)

                                        }
                                    </div>
                                </Col>
                            </Row>
                        </form>
                    </Grid>
                </Modal.Body>
                <Modal.Footer >
                    <Button bsStyle="default" id="cancel_export_to_scorm" onClick={e => {
                        this.setState({ showLoader: false });
                        this.props.close(); e.preventDefault();
                        document.body.dispatchEvent(cancelEvent);
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
    /**
     * Aspect ratio
     */
    aspectRatio: PropTypes.number,
};
