import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import i18n from 'i18next';
import RangeSlider from './range_slider/RangeSlider';
import Select from 'react-select';
import { WithContext as ReactTags } from 'react-tag-input';
import { suggestions, statusOptions, contextOptions, languages, difLevels, rightsOptions } from './global_options';
import Alert from './../../common/alert/Alert';
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
const img_place_holder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAHCCAIAAAC8ESAzAAAAB3RJTUUH4QgEES4UoueqBwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAA3zSURBVHja7d1rUxtXgsdhpBag1h18mRqTfbHz/T/S7r6ZmMzETgyYi21AbIMyxmAwCCS3pP/zFOWqOEQckWr/fA7d5zT2P+ytAUCqZt0DAIA6CSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARGvVPQC428XFxfHJcfVr3QNhBhqNRqfsVL/WPRC4gxCyoMbj8e7u7tn5ed0DYQZaRfGP//5HURR1DwTuYGkUgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANE8UM9Sarfb21tbdY+CG/7488/Pnz/XPQqYmhCylNZbreFgWPcouOHg4EAIWUaWRgGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCa5whZNRf/UfdAVlDjP+oeCMySELKC3v62e3h4WPcoVlCv1/vlzU7do4AZszTKKjIbnBPfWFaREAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0D9TDFIqiWG9V1ovi8i+R5+fj07PTs7Oz8/PzuocGPJEQwsMajUav2xv0++12u8pgs/nXUspkL7eqhJ8+nRwcfDw6PrK1GywdIYQH9Hu9F9svqgR+v8fmZOPNzY2N6qPfH3w6OXn/5x9HR0d1DxmYghDCvYpm8/Wr14PB4OsU8AeajUan0/ml3d7b3//93e+mhrAshBDu1mq1dv7+pizLqQ5bqJK5NRptbKy/3d0dj8d1vwngYe4ahTsURbHzZqea4T3hyKHqP+l2ujtv3jxmHgnUzoUKt1Ule/3qdacsn/MKVQtfvXhZ91sBHiaEcFuv2xsOBs98kaqFo9GoymHd7wZ4gBDCDVXAXr18OZND2JvN5ovtbee5w4ITQrih3+ttbm7O6tXKTqdTdup+T8CPCCHcMBwMZ/hqzUZjMOjX/Z6AHxFCuNZsNsvO0++RuVPZLotmUfc7A+4lhHBtc3Oz2ZjxRbGxsVEUQgiLSwjh2sb6+sxfs9ForK/buQIWlxDCteZ81jCbZoSwwIQQvuFJB8gjhHBtPJ9jBef0ssBMCCFc+3J6OvPXHF+MT8/O6n5nwL2EEK59/vx55scnnX45PT8zI4TFJYRwbTweH5+czPY1Tz59Oh8LISwuIYQb9vf3ZjgprF7q4OBgHuNsFa2t0ejnfV9gdQkh3PDx8HCGPyms5pfHJ8fzGGdZtl9sv1ifw4OPkEYI4YZqDvf+/buZTArH4/Eff/4x8x86TvR6/aqCW0OTQnguIYTbqknh/rPXM6v+7e3vHR0dzWOEraI1OTd4OByut2xbA88ihHBb1bB3794dHz99SbN6haPj43fv389phO12e7Io2mq1tkZbtXyXYGUIIdzh7Pxs91+/PfnHe1VEd3/bHY/Hcxpev9/7et7vaDRqmRTCMwgh3O309PTXt2/39/en+iFf9ckf9j78uvv2fG67yRRF0e10v/3HbZNCeAYhhHtVMavmhW93dz9/efhB++oTPn369M+3v/7r3/+e31xw7eqAw1tTwMtJoX294amsqMADPh5+rD4G/f5gMCzb7Waz2biydhW/yuQx/P2D/cPDw58wnn6//3VddKIa0vb29u/v3tX9rYKlJITwKAcfP1YfVXI2NzfXW63JgU3j8fnp6ennL1/mOgX8VjWAXrd76zerLg4Hww97e6dz2CsVVp4QwhSq4J2czHoTtml0ys6dt8YURbE1GpkUwhP4GSEsk0G/f+fvV5PCwWBgoxl4AiGEpVHVrtfr3fdv7T4KTyOEsDS6nW5x/92hl5PCvkkhTE0IYWncty761eVGM3YfhSkJISyHZrPZ/e5+0Vsubx8dDk0KYSpCCMuh2+kUj3hq3qQQpiWEsBz6vdvP0d/HpBCmIoSwBKq5YKfTeeQnV5PCkUkhPJoQwhLolOVUR0yMhsNm09UNj+JSgSXw+HXRiaqanfKxM0gIJ4Sw6FpFUV6dRz+VB5+1ACaEEBZduyyfcPNLr9ebahIJsYQQFt1gynXRiVvn9wL3EUJYaK2i9YR10Qmro/AYQggLrV22n/xQYLfbde8oPMhFAgtt2vtFv3W1OureUXiAEMLimuo5+u9VBa06WvebgEUnhLCg/jpWaZrn6L/XedwOpZDsWdcYMA9VvaoE9rrdVqv1zEcgrp6sLz8eHtb9nmBxCSEshGaz2W63q/71e72pdlP7scnqqBDCDwgh1KnqX9lu9/v9Xrc3pyMjqvllq2idnZ/V/V5hQQkh1KAoivZmu5r8dbvdjY2NuX6tan5ZXq6Ofqz7TcOCEkL4eS77177sX6fsVP37OVugXa2O9oQQ7iOEMHeX659leTn/63TX19d//hag1Ve3Ogr3EUKYl2ajWXaq/vW7nU4t/fuq+urtsn3olhm4ixDCjDXWGp1O5+r+l27RajUX4AiIyb2jQgh3EkKYjSo2ZVlOnn8oimLRjkCaPFl/fn5e90Bg4QghzMBoOHr54sWcnn+YiY319bJdHh6ZFMJttliD59oabf3t9etFruBE36lMcBchhGepKvj61aulOO2oa99RuMsSXL2wsJaogmtX946W7See8QsrbDkuYFhAy1XBCWfWw/eW6RqGxbGMFVybnFm/YLezQu2W7DKGRbCkFVybnMrU6dY9Clgsy3clQ72Wt4ITVkfhlmW9mKEWy17BSq/XazaWePwwc64HeKwVqODa1Q7g3a7VUbi23Jc0/DSrUcG1q63gXr16ubm5WfdAYFEs/VUNP8HKVHBiY31j5+9vtBAmVuTChvlZsQquXU0KNza0EP6yOtc2zMPqVXDiawurX+seC9Rs1S5vmKFVreDEpIX/tfOLFhJuNa9weL7VruCEFsKaEMKdEir4lRYSLuI6h6lEVXCiquAvOzubWkikoEsdHiOwghOXz1S82XEfKYFadQ8AZq/f721sPmVy02q1toajwAqufXMf6f7BwcXaxZ2fY8rIShJCVk31B/poOKp7FEup+tZVM8JqQlz3QOCnSvybLwB8JYQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQzQP1LKXDo6P/+b//rXsU3HB2dlb3EOAphJCldHFxcXp6WvcogFVgaRSAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCieY6QRdVYa7fbZ+fndY+DGWgVRfU/FBZTY//DXt1jAIDaWBoFIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEO3/AeDwuM9ery2mAAAAAElFTkSuQmCC";

// Styles
import 'react-select/dist/react-select.css';
import './_globalConfig.scss';
import './_reactTags.scss';
import FileInput from "../../common/file-input/FileInput";

/**
 * Global course configuration modal
 */
export default class GlobalConfig extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /* State from props is an anti-pattern*/
        this.state = {
            title: this.props.globalConfig.title || "",
            author: this.props.globalConfig.author || "",
            canvasRatio: this.props.globalConfig.canvasRatio || 16 / 9,
            age: this.props.globalConfig.age || { min: 0, max: 100 },
            typicalLearningTime: this.props.globalConfig.typicalLearningTime || { h: 0, m: 0, s: 0 },
            difficulty: this.props.globalConfig.difficulty || 'easy',
            rights: this.props.globalConfig.rights || 1,
            description: this.props.globalConfig.description || '',
            thumbnail: this.props.globalConfig.thumbnail || img_place_holder,
            language: this.props.globalConfig.language || undefined,
            keywords: this.props.globalConfig.keywords || [],
            version: this.props.globalConfig.version || '0.0.0',
            status: this.props.globalConfig.status || 'draft',
            context: this.props.globalConfig.context || 'school',
            visorNav: this.props.globalConfig.visorNav || { player: true, sidebar: true, keyBindings: true },
            modifiedState: false,
            showAlert: false,
        };
        // Tag handling functions
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.fileChanged = this.fileChanged.bind(this);
    }

    /**
     * Renders React component
     * @returns {code}
     */
    render() {
        const { title, author, canvasRatio, age, typicalLearningTime, difficulty, rights, visorNav, description, language, thumbnail, keywords, version, status, context } = this.state;
        return (
            <Modal className="pageModal"
                show={this.props.show}
                backdrop={'static'} bsSize="large"
                aria-labelledby="contained-modal-title-lg"
                onHide={e => {
                    // If anything has changed after last save show an alert, otherwise just leave
                    if (this.state.modifiedState) {
                        this.setState({ showAlert: true });
                    } else {
                        this.cancel();
                    }
                }}>
                <Modal.Header closeButton>
                    <Modal.Title><span id="previewTitle">{i18n.t('global_config.title')}</span></Modal.Title>
                </Modal.Header>
                <Alert className="pageModal"
                    show={this.state.showAlert}
                    hasHeader
                    title={i18n.t("messages.save_changes")}
                    closeButton
                    cancelButton
                    acceptButtonText={'OK'}
                    onClose={(bool) => {
                        // If Accept button clicked, state is saved, otherwise close without saving
                        bool ? this.saveState() : this.cancel();
                        // Anyway close the alert
                        this.setState({ showAlert: false });
                        this.props.close();
                    }}>
                    {i18n.t("global_config.prompt")}
                </Alert>
                <Modal.Body className="gcModalBody" style={{ overFlowY: 'auto' }}>
                    <Grid>
                        <form>
                            <Row>
                                <Col xs={12} md={7} lg={7}><br/>
                                    <h4>{i18n.t('global_config.title_general')}</h4>
                                    <FormGroup>
                                        <ControlLabel>{i18n.t('global_config.avatar')}</ControlLabel>
                                        <div className="cont_avatar">
                                            <img height={100} src={this.state.thumbnail} className="avatar" />
                                            <div>
                                                <FileInput onChange={this.fileChanged} className="fileInput" accept=".jpeg,.gif,.png">
                                                    <div className="fileDrag">
                                                        <span style={{ display: this.state.name ? 'none' : 'block' }}><b>{ i18n.t('FileInput.Drag') }</b>{ i18n.t('FileInput.Drag_2') }<b>{ i18n.t('FileInput.Click') }</b></span>
                                                        <span className="fileUploaded" style={{ display: this.state.name ? 'block' : 'none' }}><i className="material-icons">insert_drive_file</i>{ this.state.name || '' }</span>
                                                    </div>
                                                </FileInput>
                                                <Button bsStyle="primary" onClick={()=>{
                                                    this.getCurrentPageAvatar();
                                                }}>{i18n.t('global_config.avatar_screenshot')}</Button>
                                                <Button bsStyle="default" disabled={ this.state.thumbnail === img_place_holder } onClick={()=>{
                                                    this.setState({ thumbnail: img_place_holder });
                                                }}>{i18n.t('global_config.avatar_delete_img')}</Button>
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>{i18n.t('global_config.course_title')}</ControlLabel>
                                        <FormControl type="text"
                                            value={title}
                                            placeholder=""
                                            onChange={e => {this.setState({ modifiedState: true, title: e.target.value });}}/>
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.description')}</ControlLabel>
                                        <FormControl id="descTA"
                                            componentClass="textarea"
                                            placeholder={i18n.t('global_config.description_placeholder')}
                                            value={description}
                                            onInput={e => {this.setState({ modifiedState: true, description: e.target.value });}} />
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.author')}</ControlLabel>
                                        <FormControl type="text"
                                            value={author}
                                            placeholder={i18n.t('global_config.anonymous')}
                                            onChange={e => {this.setState({ modifiedState: true, author: e.target.value });}}/>
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.language')}</ControlLabel><br/>
                                        <Select
                                            name="form-field-lang"
                                            value={language}
                                            options={languages()}
                                            placeholder={i18n.t("global_config.no_lang")}
                                            onChange={e => {this.setState({ modifiedState: true, language: e.value });}}
                                        />
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.rights')}</ControlLabel>
                                        <OverlayTrigger trigger="click" rootClose placement="top"
                                            overlay={<Popover id="info_licenses" className="advancedPopover" title="Licencias">
                                                {i18n.t('global_config.rights_short_txt')}
                                                <a target="_blank" href={"https://creativecommons.org/licenses/?lang=" + i18n.t('currentLang')}> [{i18n.t('Read_more')}] </a>
                                            </Popover>}>
                                            <a className="miniIcon"><i className="material-icons">help</i></a>
                                        </OverlayTrigger>
                                        {/*
                                        <a className="miniIcon" target="_blank" href={"https://creativecommons.org/licenses/?lang="+i18n.t('currentLang')}><i className="material-icons">help</i></a>
                                         */}
                                        <br/>
                                        <Select
                                            name="form-field-name-rights"
                                            value={rights}
                                            options={rightsOptions()}
                                            onChange={e => {this.setState({ modifiedState: true, rights: e.value });}} />
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.keywords')}</ControlLabel><br/>
                                        <ReactTags tags={keywords}
                                            suggestions={suggestions()}
                                            placeholder={i18n.t('global_config.keyw.Add_tag')}
                                            delimiters={[188, 13]}
                                            handleDelete={this.handleDelete}
                                            handleAddition={this.handleAddition}
                                            handleDrag={this.handleDrag} />
                                    </FormGroup>

                                </Col>
                                <Col className="advanced-block" xs={12} md={5} lg={5}><br/>
                                    <h4>{i18n.t('global_config.title_advanced')}</h4>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.difficulty')}</ControlLabel><br/>
                                        <div className=" W(100%)">
                                            <div className="D(ib) C(#4e5b65)">{i18n.t('global_config.dif.' + difficulty)}</div>
                                            <div className="D(ib) Fl(end) C(#4e5b65)" />
                                            <div className="range-slider Pos(r) Ta(c) H(35px)">
                                                <div id="outsideInputBox" style={{ position: 'absolute', boxSizing: 'border-box', width: '100%' }}>
                                                    <div id="insideInputBox" style={{ marginLeft: '0%', width: difLevels.indexOf(difficulty) * 25 + '%', backgroundColor: 'rgb(95, 204, 199)' }} />
                                                </div>
                                                <input type="range" step="1" min="0" max="4" value={difLevels.indexOf(difficulty)} onChange={e =>{this.setState({ modifiedState: true, difficulty: difLevels[e.target.value] }); }}/>
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.recom_age')}</ControlLabel>
                                        <RangeSlider
                                            min={0}
                                            max={100}
                                            minRange={1}
                                            minValue={age.min}
                                            maxValue={age.max}
                                            onChange={(state)=>{
                                                this.setState({ modifiedState: true, age: { max: state.max, min: state.min } });
                                            }}
                                            step={1}
                                        />
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.typicalLearningTime')}</ControlLabel><br/>
                                        <InputGroup className="inputGroup">
                                            <FormControl type="number"
                                                value={typicalLearningTime.h}
                                                min={0}
                                                max={100}
                                                placeholder="hour"
                                                onChange={e => {this.setState({ modifiedState: true, typicalLearningTime: { h: e.target.value, m: typicalLearningTime.m, s: typicalLearningTime.s } });}}/>
                                            <InputGroup.Addon>h</InputGroup.Addon>
                                        </InputGroup>
                                        <InputGroup className="inputGroup">
                                            <FormControl type="number"
                                                value={typicalLearningTime.m}
                                                min={0}
                                                max={59}
                                                placeholder="min"
                                                onChange={e => {this.setState({ modifiedState: true, typicalLearningTime: { h: typicalLearningTime.h, m: e.target.value, s: typicalLearningTime.s } });}}/>
                                            <InputGroup.Addon>m</InputGroup.Addon>
                                        </InputGroup>{/*
                                      <InputGroup className="inputGroup">
                                        <FormControl  type="number"
                                                      value={typicalLearningTime.s}
                                                      min={0}
                                                      max={59}
                                                      placeholder="sec"
                                                      onChange={e => {this.setState({typicalLearningTime: {h:typicalLearningTime.h, m:typicalLearningTime.m, s:e.target.value}})}}/>
                                        <InputGroup.Addon>s</InputGroup.Addon>
                                      </InputGroup>*/}
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.context')}</ControlLabel><br/>
                                        <Select
                                            name="form-field-name-context"
                                            value={context}
                                            options={contextOptions()}
                                            onChange={e => {this.setState({ modifiedState: true, context: e.value });}} />
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.aspect_ratio')}</ControlLabel><br/>
                                        <Radio name="radioGroup" inline checked={canvasRatio === 16 / 9 } onChange={e => {this.setState({ modifiedState: true, canvasRatio: 16 / 9 });}}>
                                            16/9
                                        </Radio>
                                        {' '}
                                        <Radio name="radioGroup" inline checked={canvasRatio === 4 / 3 } onChange={e => {this.setState({ modifiedState: true, canvasRatio: 4 / 3 });}}>
                                            4/3
                                        </Radio>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>{i18n.t('global_config.visor_nav.title')}</ControlLabel><br/>
                                        <ToggleSwitch onChange={(e)=>{this.setState({ modifiedState: true, visorNav: { player: !visorNav.player, sidebar: visorNav.sidebar, keyBindings: visorNav.keyBindings } });}} checked={visorNav.player}/>
                                        { i18n.t('global_config.visor_nav.player') }&nbsp;&nbsp;&nbsp;&nbsp;
                                        <ToggleSwitch onChange={(e)=>{this.setState({ modifiedState: true, visorNav: { player: visorNav.player, sidebar: !visorNav.sidebar, keyBindings: visorNav.keyBindings } });}} checked={visorNav.sidebar}/>
                                        { i18n.t('global_config.visor_nav.sidebar') }
                                    </FormGroup>
                                    <FormGroup>
                                        <ToggleSwitch onChange={(e)=>{this.setState({ modifiedState: true, visorNav: { player: visorNav.player, sidebar: visorNav.sidebar, keyBindings: !visorNav.keyBindings } });}} checked={visorNav.keyBindings}/>
                                        { i18n.t('global_config.visor_nav.keybindings') }
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.status')}</ControlLabel><br/>
                                        <Select
                                            name="form-field-name-status"
                                            value={status}
                                            options={statusOptions()}
                                            onChange={e => {this.setState({ modifiedState: true, status: e.value }); }} />
                                    </FormGroup>

                                </Col>
                                {/*
                                <Col xs={12} md={6} lg={6}><br/>
                                     version commented, transparent for the user
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.version')}</ControlLabel>
                                        <FormControl   type="text"
                                                       value={version}
                                                       placeholder=""
                                                       onChange={e => {this.setState({version: e.target.value})}}/>
                                    </FormGroup>
                                </Col>*/}

                            </Row>
                        </form>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="default" id="insert_plugin_config_modal" onClick={e => {
                        this.cancel(); e.preventDefault();
                    }}>{i18n.t("global_config.Discard")}</Button>
                    <Button bsStyle="primary" id="insert_plugin_config_modal" onClick={e => {
                        this.saveState(); e.preventDefault();
                    }}>{i18n.t("global_config.Accept")}</Button>{'   '}
                </Modal.Footer>
            </Modal>
        );
    }

    /** *
     * Keyword deleted callback
     * @param i position of the keyword
     */
    handleDelete(i) {
        let tags = Object.assign([], this.state.keywords);
        tags.splice(i, 1);
        this.setState({ modifiedState: true, keywords: tags });
    }

    /**
     * Keyword added callback
     * @param tag Keyword name
     */
    handleAddition(tag) {
        let tags = Object.assign([], this.state.keywords);
        tags.push({
            id: tags.length + 1,
            text: tag,
        });
        this.setState({ modifiedState: true, keywords: tags });
    }

    /**
     * Keyword moved callback
     * @param tag Tag moving
     * @param currPos Current position
     * @param newPos New position
     */
    handleDrag(tag, currPos, newPos) {
        let tags = Object.assign([], this.state.keywords);

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({ modifiedState: true, keywords: tags });
    }

    /**
     * Save configuration changes
     */
    saveState() {
        this.setState({ modifiedState: false });
        this.props.changeGlobalConfig("STATE", this.state);
        this.props.close();
    }

    getCurrentPageAvatar() {
        let element;
        if (document.getElementsByClassName('scrollcontainer').length > 0) {
            element = document.getElementsByClassName('scrollcontainer')[0];
        } else {
            element = document.getElementById('maincontent');
        }

        let clone = element.cloneNode(true);
        let style = clone.style;
        style.position = 'relative';
        style.top = window.innerHeight + 'px';
        style.left = 0;
        document.body.appendChild(clone);

        html2canvas(clone, {
            onrendered: (canvas)=> {
                let extra_canvas = document.createElement('canvas');

                extra_canvas.setAttribute('width', 500);
                extra_canvas.setAttribute('height', 500);
                let ctx = extra_canvas.getContext('2d');
                ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 500, 500);

                // Uncomment this lines to download the image directly
                // let a = document.createElement('a');
                // a.href = a.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                // a.click();

                document.body.removeChild(clone);
                this.setState({ thumbnail: extra_canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream") });

            },
            useCORS: true });
    }

    fileChanged(event) {
        let files = event.target.files;
        let file = files[0];
        let gc = this;
        let reader = new FileReader();
        reader.onload = () => {
            let data = reader.result;
            let img = new Image();
            img.onload = ()=>{
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                canvas.width = 500;
                canvas.height = canvas.width * (img.height / img.width);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                gc.setState({ thumbnail: canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream") });
            };
            img.src = data;
        };
        reader.readAsDataURL(file);
    }

    /**
     * Discard configuration changes
     */
    cancel() {
        this.setState({
            title: this.props.globalConfig.title || "",
            author: this.props.globalConfig.author || "",
            canvasRatio: this.props.globalConfig.canvasRatio || 16 / 9,
            age: this.props.globalConfig.age || { min: 0, max: 100 },
            typicalLearningTime: this.props.globalConfig.typicalLearningTime || { h: 0, m: 0, s: 0 },
            difficulty: this.props.globalConfig.difficulty || 'easy',
            rights: this.props.globalConfig.rights || 1,
            description: this.props.globalConfig.description || '',
            language: this.props.globalConfig.language || undefined,
            keywords: this.props.globalConfig.keywords || [],
            thumbnail: this.props.globalConfig.thumbnail || img_place_holder,
            version: this.props.globalConfig.version || '0.0.0',
            status: this.props.globalConfig.status || 'draft',
            context: this.props.globalConfig.context || 'school',
            visorNav: this.props.globalConfig.visorNav || { player: true, sidebar: true, keyBindings: true },
            modifiedState: false,
        });

        //  Comment the following line if you don't want to exit when changes are discarded
        this.props.close();

    }

    /**
     * If title is changed from outside
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.globalConfig.title !== nextProps.globalConfig.title) {
            this.setState({
                title: nextProps.globalConfig.title || "",
            });
        }
        if (this.props.globalConfig.status !== nextProps.globalConfig.status) {
            this.setState({
                status: nextProps.globalConfig.status || "draft",
            });
        }
    }

}

GlobalConfig.propTypes = {
    /**
     * Indica si se debe mostrar la ventana de configuración del curso u ocultar
     */
    show: PropTypes.bool,
    /**
     * Diccionario que contiene la configuración del curso. Objeto idéntico a ***globalConfig*** en el estado de Redux.
     */
    globalConfig: PropTypes.object.isRequired,
    /**
     * Guarda la nueva configuración
     */
    changeGlobalConfig: PropTypes.func.isRequired,
    /**
     * Cierra la ventana de configuración
     */
    close: PropTypes.func.isRequired,
};
