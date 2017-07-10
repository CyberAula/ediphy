import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio} from 'react-bootstrap';
import i18n from 'i18next';
import RangeSlider from './range_slider/RangeSlider';
import TimePicker from 'yet-another-react-time-picker';
import Select from 'react-select';
import { WithContext as ReactTags } from 'react-tag-input';
import {suggestions, statusOptions, contextOptions, languages, difLevels, rightLevels} from './global_options';

//Styles
import 'react-select/dist/react-select.css';
require('./_globalConfig.scss');
require('./_reactTags.scss');

export default class GlobalConfig extends Component {
    constructor(props) {
        super(props);
        //Tag handling functions
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    render() {
        let gc = this.props.globalConfig;
        let title = gc.title || "";
        let author = gc.author || "";
        let ar = gc.canvasRatio || 16/9;
        let age = gc.age || {min:0, max:100};
        let tlt = gc.typicalLearningTime || {h:0, m:0, s:0};
        let dif = gc.difficulty || 'easy';
        let rights = gc.rights || 1;
        let descrip = gc.description ||  '';
        let language = gc.language || undefined;
        let tags = gc.keywords || [];
        let version = gc.version || '0.0.0';
        let status = gc.status || 'draft';
        let context = gc.context || 'school';

        return (
            /* jshint ignore:start */
            <Modal className="visor modalVisorContainer"
                   show={this.props.show}
                   backdrop={true} bsSize="large"
                   aria-labelledby="contained-modal-title-lg"
                   onHide={e => {this.props.close()}}>
                <Modal.Header closeButton>
                    <Modal.Title><span id="previewTitle">{i18n.t('global_config.title')}</span></Modal.Title>
                </Modal.Header>

                <Modal.Body className="gcModalBody" style={{overFlowY: 'auto'}}>
                     <Grid>
                        <form>
                            <Row>
                                <Col xs={12} md={6} lg={4}><br/>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.course_title')}</ControlLabel>
                                        <FormControl   type="text"
                                                       value={title}
                                                       placeholder=""
                                                       onChange={e => {this.props.changeGlobalConfig("title",e.target.value)}}/>
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.author')}</ControlLabel>
                                        <FormControl   type="text"
                                                       value={author}
                                                       placeholder={i18n.t('global_config.anonymous')}
                                                       onChange={e => {this.props.changeGlobalConfig("author",e.target.value)}}/>
                                    </FormGroup>
                                    <FormGroup >
                                      <ControlLabel>{i18n.t('global_config.aspect_ratio')}</ControlLabel><br/>
                                      <Radio name="radioGroup" inline checked={ar == 16/9 } onChange={e => {this.props.changeGlobalConfig("canvasRatio",16/9)}}>
                                        16/9
                                      </Radio>
                                      {' '}
                                      <Radio name="radioGroup" inline checked={ar == 4/3 } onChange={e => {this.props.changeGlobalConfig("canvasRatio",4/3)}}>
                                        4/3
                                      </Radio>
                                    </FormGroup>
                                    <FormGroup >
                                      <ControlLabel>{i18n.t('global_config.language')}</ControlLabel><br/>
                                      <Select
                                        name="form-field-lang"
                                        value={language}
                                        options={languages}
                                        placeholder={i18n.t("global_config.no_lang")}
                                        onChange={e => {this.props.changeGlobalConfig("language",e.value)}}
                                      />
                                    </FormGroup>
                                    <FormGroup >
                                         <ControlLabel>{i18n.t('global_config.description')}</ControlLabel>
                                         <FormControl id="descTA" componentClass="textarea" placeholder={i18n.t('global_config.description_placeholder')} value={descrip} onInput={e => {this.props.changeGlobalConfig("description",e.target.value)}} />
                                    </FormGroup>
                                    
                                </Col>
                                <Col xs={12} md={6} lg={4}><br/>
                                    <FormGroup >
                                      <ControlLabel>{i18n.t('global_config.recom_age')}</ControlLabel>
                                      <RangeSlider
                                             min={0}
                                             max={100}
                                             minRange={1}
                                             minValue={age.min}
                                             maxValue={age.max}
                                             onChange={(state)=>{
                                                  this.props.changeGlobalConfig("age", {max: state.max, min: state.min})
                                             }}
                                             step={1}
                                         />
                                    </FormGroup>
                                    <FormGroup >
                                      <ControlLabel>{i18n.t('global_config.typicalLearningTime')}</ControlLabel><br/>
                                      <InputGroup className="inputGroup">      
                                        <FormControl  type="number"
                                                      value={tlt.h}
                                                      min={0}
                                                      max={100}
                                                      placeholder="hour"
                                                      onChange={e => {this.props.changeGlobalConfig("typicalLearningTime",{h:e.target.value, m:tlt.m, s:tlt.s})}}/>
                                        <InputGroup.Addon>h</InputGroup.Addon>
                                      </InputGroup>
                                      <InputGroup className="inputGroup">     
                                        <FormControl  type="number"
                                                      value={tlt.m}
                                                      min={0}
                                                      max={59}
                                                      placeholder="min"
                                                      onChange={e => {this.props.changeGlobalConfig("typicalLearningTime",{h:tlt.h, m:e.target.value, s:tlt.s})}}/>
                                        <InputGroup.Addon>m</InputGroup.Addon>
                                      </InputGroup>
                                      <InputGroup className="inputGroup">     
                                        <FormControl  type="number"
                                                      value={tlt.s}
                                                      min={0}
                                                      max={59}
                                                      placeholder="sec"
                                                      onChange={e => {this.props.changeGlobalConfig("typicalLearningTime",{h:tlt.h, m:tlt.m, s:e.target.value})}}/>
                                        <InputGroup.Addon>s</InputGroup.Addon>
                                      </InputGroup>
                                    </FormGroup>
                                    <FormGroup >
                                      <ControlLabel>{i18n.t('global_config.difficulty')}</ControlLabel><br/>
                                      <div className=" W(100%)">
                                        <div className="D(ib) C(#4e5b65)">{i18n.t('global_config.dif.'+dif)}</div>
                                        <div className="D(ib) Fl(end) C(#4e5b65)"></div>
                                        <div className="range-slider Pos(r) Ta(c) H(35px)">
                                          <div style={{position: 'absolute', boxSizing: 'border-box', width: difLevels.indexOf(dif)*25+'%', top: '7px'}}>
                                            <div style={{marginLeft: '0%', width: '100%', height: '4px', backgroundColor: 'rgb(95, 204, 199)'}}></div>
                                          </div>
                                          <input type="range" step="1" min="0" max="4" value={difLevels.indexOf(dif)} onChange={e =>{this.props.changeGlobalConfig("difficulty", difLevels[e.target.value]) }}/>
                                        </div>
                                      </div>
                                    </FormGroup>
                                    <FormGroup >
                                      <ControlLabel>{i18n.t('global_config.keywords')}</ControlLabel><br/>
                                      <ReactTags tags={tags}
                                                suggestions={suggestions()}
                                                delimiters={[188,13]}
                                                handleDelete={this.handleDelete}
                                                handleAddition={this.handleAddition}
                                                handleDrag={this.handleDrag} />
                                    </FormGroup>
                                </Col>
                                <Col xs={12} md={6} lg={4}><br/>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.version')}</ControlLabel>
                                        <FormControl   type="text"
                                                       value={version}
                                                       placeholder=""
                                                       onChange={e => {this.props.changeGlobalConfig("version",e.target.value)}}/>
                                    </FormGroup>
                                    <FormGroup >
                                      <ControlLabel>{i18n.t('global_config.status')}</ControlLabel><br/>
                                      <Select
                                        name="form-field-name-status"
                                        value={status}
                                        options={statusOptions()}
                                        onChange={e => {this.props.changeGlobalConfig("status",e.value)}} />       
                                    </FormGroup>
                                    <FormGroup >
                                      <ControlLabel>{i18n.t('global_config.context')}</ControlLabel><br/>
                                      <Select
                                        name="form-field-name-context"
                                        value={context}
                                        options={contextOptions()}
                                        onChange={e => {this.props.changeGlobalConfig("context",e.value)}} />       
                                    </FormGroup>
                                    <FormGroup >
                                      <ControlLabel>{i18n.t('global_config.rights')}<a className="miniIcon" target="_blank" href={"https://creativecommons.org/licenses/?lang="+i18n.t('currentLang')}><i className="material-icons">info</i></a></ControlLabel><br/>
                                      <Select
                                        name="form-field-name-rights"
                                        value={rights}
                                        options={rightLevels}
                                        onChange={e => {this.props.changeGlobalConfig("rights",e.value)}} />       
                                    </FormGroup>

                                </Col>
                            </Row>
                        </form>
                     </Grid>
                 </Modal.Body>
            </Modal>
            /* jshint ignore:end */
        );
    }

    handleDelete(i) {
        let tags = this.props.globalConfig.keywords;
        tags.splice(i, 1);
        this.props.changeGlobalConfig("keywords", tags);
     }

    handleAddition(tag) {
        let tags = this.props.globalConfig.keywords;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.props.changeGlobalConfig("keywords", tags);
    }

    handleDrag(tag, currPos, newPos) {
        let tags = this.props.globalConfig.keywords;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.props.changeGlobalConfig("keywords", tags);
    }
}
