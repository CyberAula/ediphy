import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button} from 'react-bootstrap';
import i18n from 'i18next';
import RangeSlider from './range_slider/RangeSlider';
import Select from 'react-select';
import { WithContext as ReactTags } from 'react-tag-input';
import {suggestions, statusOptions, contextOptions, languages, difLevels, rightsOptions} from './global_options';

//Styles
import 'react-select/dist/react-select.css';
require('./_globalConfig.scss');
require('./_reactTags.scss');

export default class GlobalConfig extends Component {
    constructor(props) {
        super(props);
        /*State from props is an anti-pattern*/
        this.state = {
          title: this.props.globalConfig.title || "",
          author: this.props.globalConfig.author || "",
          canvasRatio: this.props.globalConfig.canvasRatio || 16/9,
          age: this.props.globalConfig.age || {min:0, max:100},
          typicalLearningTime: this.props.globalConfig.typicalLearningTime || {h:0, m:0, s:0},
          difficulty: this.props.globalConfig.difficulty || 'easy',
          rights: this.props.globalConfig.rights || 1,
          description: this.props.globalConfig.description ||  '',
          language: this.props.globalConfig.language || undefined,
          keywords: this.props.globalConfig.keywords || [],
          version: this.props.globalConfig.version || '0.0.0',
          status: this.props.globalConfig.status || 'draft',
          context: this.props.globalConfig.context || 'school',
          modifiedState: false
        };
        //Tag handling functions
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    render() {
        const {title, author, canvasRatio, age, typicalLearningTime, difficulty, rights, description, language, keywords, version, status, context} = this.state;
        return (
            /* jshint ignore:start */
            //  visor modalVisorContainer
            <Modal className="pageModal"
                   show={this.props.show}
                   backdrop={'static'} bsSize="large"
                   aria-labelledby="contained-modal-title-lg"
                   onHide={e => {
                    if (this.state.modifiedState) {
                      confirm(i18n.t("global_config.prompt")) ? this.saveState():this.cancel();
                    }
                    this.props.close(); }}>
                <Modal.Header closeButton>
                    <Modal.Title><span id="previewTitle">{i18n.t('global_config.title')}</span></Modal.Title>
                </Modal.Header>

                <Modal.Body className="gcModalBody" style={{overFlowY: 'auto'}}>
                     <Grid>
                        <form>
                            <Row>
                                <Col xs={12} md={7} lg={7}><br/>
                                    <h4>{i18n.t('global_config.title_general')}</h4>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.course_title')}</ControlLabel>
                                        <FormControl   type="text"
                                                       value={title}
                                                       placeholder=""
                                                       onChange={e => {this.setState({modifiedState: true, title: e.target.value})}}/>
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.description')}</ControlLabel>
                                        <FormControl id="descTA" componentClass="textarea" placeholder={i18n.t('global_config.description_placeholder')} value={description} onInput={e => {this.setState({description: e.target.value})}} />
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.author')}</ControlLabel>
                                        <FormControl   type="text"
                                                       value={author}
                                                       placeholder={i18n.t('global_config.anonymous')}
                                                       onChange={e => {this.setState({modifiedState: true, author: e.target.value})}}/>
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.language')}</ControlLabel><br/>
                                        <Select
                                            name="form-field-lang"
                                            value={language}
                                            options={languages}
                                            placeholder={i18n.t("global_config.no_lang")}
                                            onChange={e => {this.setState({modifiedState: true, language: e.value})}}
                                        />
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.rights')}</ControlLabel>
                                        <OverlayTrigger trigger="click" rootClose placement="top"
                                                        overlay={<Popover id="info_licenses" className="advancedPopover" title="Licencias">
                                                                    {i18n.t('global_config.rights_short_txt')}
                                                                    <a target="_blank" href={"https://creativecommons.org/licenses/?lang="+i18n.t('currentLang')}> [{i18n.t('Read_more')}] </a>
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
                                            onChange={e => {this.setState({rights: e.value})}} />
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.keywords')}</ControlLabel><br/>
                                        <ReactTags tags={keywords}
                                                   suggestions={suggestions()}
                                                   placeholder={i18n.t('global_config.keyw.Add_tag')}
                                                   delimiters={[188,13]}
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
                                            <div className="D(ib) C(#4e5b65)">{i18n.t('global_config.dif.'+difficulty)}</div>
                                            <div className="D(ib) Fl(end) C(#4e5b65)"></div>
                                            <div className="range-slider Pos(r) Ta(c) H(35px)">
                                                <div id="outsideInputBox" style={{position: 'absolute', boxSizing: 'border-box', width: '100%'}}>
                                                    <div id="insideInputBox" style={{marginLeft: '0%', width: difLevels.indexOf(difficulty)*25+'%', backgroundColor: 'rgb(95, 204, 199)'}}></div>
                                                </div>
                                                <input type="range" step="1" min="0" max="4" value={difLevels.indexOf(difficulty)} onChange={e =>{this.setState({modifiedState: true, difficulty: difLevels[e.target.value]}) }}/>
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
                                                  this.setState({modifiedState: true, age: {max: state.max, min: state.min}})
                                             }}
                                             step={1}
                                         />
                                    </FormGroup>
                                    <FormGroup >
                                      <ControlLabel>{i18n.t('global_config.typicalLearningTime')}</ControlLabel><br/>
                                      <InputGroup className="inputGroup">
                                        <FormControl  type="number"
                                                      value={typicalLearningTime.h}
                                                      min={0}
                                                      max={100}
                                                      placeholder="hour"
                                                      onChange={e => {this.setState({modifiedState: true, typicalLearningTime: {h:e.target.value, m:typicalLearningTime.m, s:typicalLearningTime.s}})}}/>
                                        <InputGroup.Addon>h</InputGroup.Addon>
                                      </InputGroup>
                                      <InputGroup className="inputGroup">
                                        <FormControl  type="number"
                                                      value={typicalLearningTime.m}
                                                      min={0}
                                                      max={59}
                                                      placeholder="min"
                                                      onChange={e => {this.setState({modifiedState: true, typicalLearningTime: {h:typicalLearningTime.h, m:e.target.value, s:typicalLearningTime.s}})}}/>
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
                                            onChange={e => {this.setState({modifiedState: true, context: e.value})}} />
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.aspect_ratio')}</ControlLabel><br/>
                                        <Radio name="radioGroup" inline checked={canvasRatio == 16/9 } onChange={e => {this.setState({modifiedState: true, canvasRatio: 4/3})}}>
                                            16/9
                                        </Radio>
                                        {' '}
                                        <Radio name="radioGroup" inline checked={canvasRatio == 4/3 } onChange={e => {this.setState({modifiedState: true, canvasRatio: 4/3})}}>
                                            4/3
                                        </Radio>
                                    </FormGroup>
                                    <FormGroup >
                                        <ControlLabel>{i18n.t('global_config.status')}</ControlLabel><br/>
                                        <Select
                                            name="form-field-name-status"
                                            value={status}
                                            options={statusOptions()}
                                            onChange={e => {this.setState({modifiedState: true, status: e.value}) }} />
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
                                <div style={{'textAlign': 'right'}}>
                                  <Button bsStyle="primary" id="insert_plugin_config_modal" onClick={e => {
                                      this.saveState();
                                  }}>{i18n.t("global_config.Accept")}</Button>{'   '}   
                                  <Button bsStyle="primary" id="insert_plugin_config_modal" onClick={e => {
                                    this.cancel();
                                  }}>{i18n.t("global_config.Discard")}</Button>
                                </div>
                            </Row>
                        </form>
                     </Grid>
                 </Modal.Body>
            </Modal>
            /* jshint ignore:end */
        );
    }

    handleDelete(i) {
        let tags = Object.assign([],this.state.keywords);
        tags.splice(i, 1);
        this.setState({modifiedState: true, keywords: tags});
     }

    handleAddition(tag) {
        let tags = Object.assign([],this.state.keywords);
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({modifiedState: true, keywords: tags});
    }

    handleDrag(tag, currPos, newPos) {
        let tags = Object.assign([],this.state.keywords);

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({modifiedState: true, keywords: tags});
    }


    // Guardar cambios
    saveState(){
      this.setState({modifiedState: false});
      this.props.changeGlobalConfig("STATE", this.state);
      this.props.close();
    }
    // Descartar cambios
    cancel(){
      this.setState({
        title: this.props.globalConfig.title || "",
        author: this.props.globalConfig.author || "",
        canvasRatio: this.props.globalConfig.canvasRatio || 16/9,
        age: this.props.globalConfig.age || {min:0, max:100},
        typicalLearningTime: this.props.globalConfig.typicalLearningTime || {h:0, m:0, s:0},
        difficulty: this.props.globalConfig.difficulty || 'easy',
        rights: this.props.globalConfig.rights || 1,
        description: this.props.globalConfig.description ||  '',
        language: this.props.globalConfig.language || undefined,
        keywords: this.props.globalConfig.keywords || [],
        version: this.props.globalConfig.version || '0.0.0',
        status: this.props.globalConfig.status || 'draft',
        context: this.props.globalConfig.context || 'school',
        modifiedState: false
      });

      //Descomentar para salir al descartar
      this.props.close();

    }

    // Si se modifica el título desde fuera
    componentWillReceiveProps(nextProps) {
      if (this.props.globalConfig.title !== nextProps.globalConfig.title) {
        this.setState({
            title: nextProps.globalConfig.title || ""
        });
      }
    }

}
