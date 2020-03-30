import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import i18n from 'i18next';
import RangeSlider from './rangeSlider/RangeSlider';
import Select from 'react-select';
import { WithOutContext as ReactTags } from 'react-tag-input';
import { suggestions, statusOptions, contextOptions, languages, difLevels, rightsOptions } from './globalOptions';
import Alert from './../../common/alert/Alert';
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
const img_place_holder = "data:image/png;base64,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";
import {
    changeGlobalConfig,
    updateUI,
    uploadEdiphyResourceAsync,
    uploadVishResourceAsync,
} from "../../../../common/actions";
import { connect } from "react-redux";
// Styles
import 'react-select/dist/react-select.css';
import { UI } from "../../../../common/UI.es6";
import { Keywords } from "./StylesTags";
import {
    ConfigAllowance,
    ConfigAspectRatio,
    ConfigDescription, ConfigDifficulty, ConfigInlineLabel,
    ConfigInputGroup,
    ConfigMiniIcon, GlobalConfigModal,
    InsideInputBox,
    OutsideInputBox,
} from "./Styles";

/**
 * Global course configuration modal
 */
class GlobalConfig extends Component {
  state = {
      title: this.props.globalConfig.title,
      author: this.props.globalConfig.author || "",
      canvasRatio: this.props.globalConfig.canvasRatio || 16 / 9,
      age: this.props.globalConfig.age || { min: 0, max: 0 },
      typicalLearningTime: this.props.globalConfig.typicalLearningTime || { h: 0, m: 0, s: 0 },
      difficulty: this.props.globalConfig.difficulty,
      rights: this.props.globalConfig.rights || 1,
      description: this.props.globalConfig.description || '',
      thumbnail: this.props.globalConfig.thumbnail || img_place_holder,
      language: this.props.globalConfig.language,
      keywords: this.props.globalConfig.keywords || [],
      version: this.props.globalConfig.version || '0.0.0',
      status: this.props.globalConfig.status || 'draft',
      context: this.props.globalConfig.context,
      hideGlobalScore: this.props.globalConfig.hideGlobalScore || false,
      minTimeProgress: this.props.globalConfig.minTimeProgress || 3,
      visorNav: { ...(this.props.globalConfig.visorNav || {}),
          player: this.props.globalConfig.visorNav.player === undefined ? true : this.props.globalConfig.visorNav.player,
          sidebar: this.props.globalConfig.visorNav.sidebar === undefined ? true : this.props.globalConfig.visorNav.sidebar,
          keyBindings: this.props.globalConfig.visorNav.player === undefined ? true : this.props.globalConfig.visorNav.keyBindings,
          fixedPlayer: this.props.globalConfig.visorNav.fixedPlayer === undefined ? true : this.props.globalConfig.visorNav.player },
      allowClone: this.props.globalConfig.allowClone ? true : this.props.globalConfig.allowClone === undefined,
      allowComments: this.props.globalConfig.allowComments ? true : this.props.globalConfig.allowComments === undefined,
      allowDownload: this.props.globalConfig.allowDownload ? true : this.props.globalConfig.allowDownload === undefined,
      modifiedState: false,
      showAlert: false,
      everPublished: this.props.globalConfig.everPublished,

  };

  /**
     * Renders React component
     * @returns {code}
     */
  render() {
      const { title, author, canvasRatio, age, hideGlobalScore, typicalLearningTime, minTimeProgress, difficulty, rights, visorNav, description, language, keywords, status, context, allowDownload, allowClone, allowComments } = this.state;
      const { reactUI } = this.props;
      return (
          <GlobalConfigModal className="pageModal"
              show={reactUI.showGlobalConfig}
              backdrop={'static'} bsSize="large"
              aria-labelledby="contained-modal-title-lg"
              onHide={() => {
                  // If anything has changed after last save show an alert, otherwise just leave
                  if (this.state.modifiedState) {
                      this.setState({ showAlert: true });
                  } else {
                      this.cancel();
                  }
              }}>
              <Modal.Header closeButton>
                  <Modal.Title><span id="previewTitle">{i18n.t('globalConfig.title')}</span></Modal.Title>
              </Modal.Header>
              <Alert className="pageModal"
                  show={this.state.showAlert}
                  hasHeader
                  title={i18n.t("messages.save_changes")}
                  closeButton
                  cancelButton
                  acceptButtonText={'OK'}
                  onClose={(accept) => {
                      // If Accept button clicked, state is saved, otherwise close without saving
                      if(accept) {
                          this.saveState();
                      } else {
                          this.cancel();
                      }
                      // Anyway close the alert
                      this.setState({ showAlert: false });
                      // this.props.close();
                  }}>
                  {i18n.t("globalConfig.prompt")}
              </Alert>
              <Modal.Body className="gcModalBody" style={{ overFlowY: 'auto' }}>
                  <Grid>
                      <form>
                          <Row>
                              <Col xs={12} md={7} lg={7}><br/>
                                  <h4>{i18n.t('globalConfig.title_general')}</h4>
                                  <FormGroup>
                                      <ControlLabel>{i18n.t('globalConfig.avatar')}</ControlLabel>
                                      <div className="cont_avatar">
                                          <img src={this.state.thumbnail} className="avatar" alt={"avatar"}/>
                                          <div>
                                              <Button bsStyle="primary" className="avatarButtons" onClick={()=>{
                                                  this.props.toggleFileUpload('avatar', 'image/*');
                                              }}>{i18n.t('globalConfig.avatar_import')}</Button><br/>
                                              <Button bsStyle="primary" className="avatarButtons" onClick={()=>{
                                                  this.getCurrentPageAvatar();
                                              }}>{i18n.t('globalConfig.avatar_screenshot')}</Button><br/>
                                              <Button bsStyle="default" className="avatarButtons" disabled={ this.state.thumbnail === img_place_holder } onClick={()=>{
                                                  this.setState({ thumbnail: img_place_holder });
                                              }}>{i18n.t('globalConfig.avatar_delete_img')}</Button>
                                          </div>
                                      </div>
                                  </FormGroup>
                                  <FormGroup>
                                      <ControlLabel>{i18n.t('globalConfig.course_title')}</ControlLabel>
                                      <FormControl type="text"
                                          value={title}
                                          placeholder={i18n.t('globalConfig.course_title')}
                                          onChange={e => {this.setState({ modifiedState: true, title: e.target.value });}}/>
                                  </FormGroup>
                                  <ConfigDescription>
                                      <ControlLabel>{i18n.t('globalConfig.description')}</ControlLabel>
                                      <FormControl id="descTA"
                                          componentClass="textarea"
                                          placeholder={i18n.t('globalConfig.description_placeholder')}
                                          value={description}
                                          onChange={e => {this.setState({ modifiedState: true, description: e.target.value });}} />
                                  </ConfigDescription>
                                  <FormGroup >
                                      <ControlLabel>{i18n.t('globalConfig.author')}</ControlLabel>
                                      <FormControl type="text"
                                          value={author}
                                          placeholder={i18n.t('globalConfig.anonymous')}
                                          onChange={e => {this.setState({ modifiedState: true, author: e.target.value });}}/>
                                  </FormGroup>
                                  <FormGroup >
                                      <ControlLabel>{i18n.t('globalConfig.language')}</ControlLabel><br/>
                                      <Select
                                          name="form-field-lang"
                                          value={language}
                                          options={languages()}
                                          placeholder={i18n.t("globalConfig.no_lang")}
                                          onChange={e => {this.setState({ modifiedState: true, language: e.value });}}
                                      />
                                  </FormGroup>
                                  <FormGroup >
                                      <ControlLabel>{i18n.t('globalConfig.rights')}</ControlLabel>
                                      <OverlayTrigger trigger="click" rootClose placement="top"
                                          overlay={<Popover id="info_licenses" className="advancedPopover" title="Licencias">
                                              {i18n.t('globalConfig.rights_short_txt')}
                                              <a target="_blank" href={"https://creativecommons.org/licenses/?lang=" + i18n.t('currentLang')}> [{i18n.t('Read_more')}] </a>
                                          </Popover>}>
                                          <ConfigMiniIcon><i className="material-icons">help</i></ConfigMiniIcon>
                                      </OverlayTrigger>
                                      <br/>
                                      <Select disabled={status === 'final' || this.state.everPublished} className={(status === 'final' || this.state.everPublished) ? 'select-disabled' : ''} title={(status === 'final' || this.state.everPublished) ? i18n.t("messages.forbidden") : undefined}
                                          name="form-field-name-rights"
                                          value={rights}
                                          options={rightsOptions()}
                                          onChange={e => {this.setState({ modifiedState: true, rights: e.value });}} />
                                  </FormGroup>
                                  <Keywords>
                                      <ControlLabel>{i18n.t('globalConfig.keywords')}</ControlLabel><br/>
                                      <ReactTags tags={(keywords || []).map((text, id) => (typeof text === "string") ? { id: id.toString(), text } : text)}
                                          suggestions={suggestions()}
                                          placeholder={i18n.t('globalConfig.keyw.Add_tag')}
                                          delimiters={[188, 13]}
                                          handleDelete={this.handleDelete}
                                          handleAddition={this.handleAddition}
                                          handleDrag={this.handleDrag} />
                                  </Keywords>
                                  <FormGroup >
                                      <ControlLabel>{i18n.t('globalConfig.recom_age')}</ControlLabel>
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

                              </Col>
                              <Col className="advanced-block" xs={12} md={5} lg={5}><br/>
                                  <h4>{i18n.t('globalConfig.title_advanced')}</h4>
                                  <FormGroup >
                                      <ControlLabel>{i18n.t('globalConfig.difficulty')}</ControlLabel><br/>
                                      <div className=" W(100%)">
                                          <div className="D(ib) C(#4e5b65)">{i18n.t('globalConfig.dif.' + difficulty)}</div>
                                          <div className="D(ib) Fl(end) C(#4e5b65)" />
                                          <ConfigDifficulty className="range-slider Pos(r) Ta(c) H(35px)">
                                              <OutsideInputBox style={{ position: 'absolute', boxSizing: 'border-box', width: '100%' }}>
                                                  <InsideInputBox style={{ marginLeft: '0%', width: difLevels.indexOf(difficulty) * 25 + '%', backgroundColor: 'rgb(95, 204, 199)' }} />
                                              </OutsideInputBox>
                                              <input type="range" step="1" min="0" max="4" value={difLevels.indexOf(difficulty)} onChange={e =>{this.setState({ modifiedState: true, difficulty: difLevels[e.target.value] }); }}/>
                                          </ConfigDifficulty>
                                      </div>
                                  </FormGroup>

                                  <FormGroup >
                                      <ControlLabel>{i18n.t('globalConfig.typicalLearningTime')}</ControlLabel><br/>
                                      <ConfigInputGroup>
                                          <FormControl type="number"
                                              value={typicalLearningTime.h}
                                              min={0}
                                              max={100}
                                              placeholder="h"
                                              onChange={e => {this.setState({ modifiedState: true, typicalLearningTime: { h: e.target.value, m: typicalLearningTime.m, s: typicalLearningTime.s } });}}/>
                                          <InputGroup.Addon>h</InputGroup.Addon>
                                      </ConfigInputGroup>
                                      <ConfigInputGroup>
                                          <FormControl type="number"
                                              value={typicalLearningTime.m}
                                              min={0}
                                              max={59}
                                              placeholder="m"
                                              onChange={e => {this.setState({ modifiedState: true, typicalLearningTime: { h: typicalLearningTime.h, m: e.target.value, s: typicalLearningTime.s } });}}/>
                                          <InputGroup.Addon>m</InputGroup.Addon>
                                      </ConfigInputGroup>
                                  </FormGroup>

                                  <FormGroup >
                                      <ConfigInlineLabel>{i18n.t('globalConfig.hideGlobalScore')}</ConfigInlineLabel>
                                      <ToggleSwitch onChange={()=>{this.setState({ modifiedState: true, hideGlobalScore: !this.state.hideGlobalScore });}} checked={!hideGlobalScore}/>

                                  </FormGroup>
                                  <FormGroup >
                                      <ControlLabel>{i18n.t('globalConfig.minTimeProgress')}</ControlLabel><br/>
                                      <ConfigInputGroup>
                                          <FormControl type="number"
                                              value={minTimeProgress}
                                              min={1}
                                              max={500}
                                              placeholder="s"
                                              onChange={e => {this.setState({ modifiedState: true, minTimeProgress: e.target.value });}}/>
                                          <InputGroup.Addon>s</InputGroup.Addon>
                                      </ConfigInputGroup>

                                  </FormGroup>

                                  <FormGroup >
                                      <ControlLabel>{i18n.t('globalConfig.context')}</ControlLabel><br/>
                                      <Select
                                          name="form-field-name-context"
                                          value={context}
                                          options={contextOptions()}
                                          onChange={e => {this.setState({ modifiedState: true, context: e.value });}} />
                                  </FormGroup>
                                  <FormGroup >
                                      <ControlLabel>{i18n.t('globalConfig.aspect_ratio')}</ControlLabel><br/>
                                      <ConfigAspectRatio>
                                          <Radio name="radioGroup" inline checked={canvasRatio === 16 / 9 } onChange={() => {this.setState({ modifiedState: true, canvasRatio: 16 / 9 });}}>
                                                16/9
                                          </Radio>
                                          <Radio name="radioGroup" inline checked={canvasRatio === 4 / 3 } onChange={() => {this.setState({ modifiedState: true, canvasRatio: 4 / 3 });}}>
                                                4/3
                                          </Radio>
                                      </ConfigAspectRatio>

                                  </FormGroup>
                                  <ConfigAllowance>
                                      <ControlLabel>{i18n.t('globalConfig.visor_nav.title')}</ControlLabel><br/>
                                      <ToggleSwitch onChange={()=>{this.setState({ modifiedState: true, visorNav: { ...visorNav, player: !visorNav.player, fixedPlayer: !visorNav.player } });}} checked={visorNav.player}/>
                                      { i18n.t('globalConfig.visor_nav.player') } <br/>
                                      <ToggleSwitch onChange={()=>{this.setState({ modifiedState: true, visorNav: { ...visorNav, sidebar: !visorNav.sidebar } });}} checked={visorNav.sidebar}/>
                                      { i18n.t('globalConfig.visor_nav.sidebar') } <br/>
                                      <ToggleSwitch onChange={()=>{this.setState({ modifiedState: true, visorNav: { ...visorNav, fixedPlayer: !visorNav.fixedPlayer } });}} disabled={!visorNav.player} checked={visorNav.fixedPlayer}/>
                                      { i18n.t('globalConfig.visor_nav.fixedPlayer') } <br/>
                                      <ToggleSwitch onChange={()=>{this.setState({ modifiedState: true, visorNav: { ...visorNav, keyBindings: !visorNav.keyBindings } });}} checked={visorNav.keyBindings}/>
                                      { i18n.t('globalConfig.visor_nav.keybindings') }
                                  </ConfigAllowance>
                                  <FormGroup >
                                      <ControlLabel>{i18n.t('globalConfig.status')}</ControlLabel><br/>
                                      <Select
                                          name="form-field-name-status"
                                          value={status}
                                          options={statusOptions()}
                                          onChange={e => {this.setState({ modifiedState: true, status: e.value }); }} />
                                  </FormGroup>
                                  {(process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc') ? <ConfigAllowance>
                                      <ControlLabel>{i18n.t('globalConfig.permissions.title')}</ControlLabel><br/>
                                      <ToggleSwitch onChange={()=>{this.setState({ modifiedState: true, allowClone: !allowClone });}} checked={allowClone}/>
                                      { i18n.t('globalConfig.permissions.allow_clone') }<br/>
                                      <ToggleSwitch onChange={()=>{this.setState({ modifiedState: true, allowComments: !allowComments });}} checked={allowComments}/>
                                      { i18n.t('globalConfig.permissions.allow_comments') }<br/>
                                      <ToggleSwitch onChange={()=>{this.setState({ modifiedState: true, allowDownload: !allowDownload });}} checked={allowDownload}/>
                                      { i18n.t('globalConfig.permissions.allow_download') }
                                  </ConfigAllowance> : null }
                              </Col>
                          </Row>
                      </form>
                  </Grid>
              </Modal.Body>
              <Modal.Footer>
                  <Button bsStyle="default" id="cancel_insert_plugin_config_modal" onClick={e => {
                      this.cancel(); e.preventDefault();
                  }}>{i18n.t("globalConfig.Discard")}</Button>
                  <Button bsStyle="primary" id="insert_plugin_config_modal" onClick={e => {
                      this.saveState(); e.preventDefault();
                  }}>{i18n.t("globalConfig.Accept")}</Button>{'   '}
              </Modal.Footer>
          </GlobalConfigModal>
      );
  }

    uploadFunction = (query, keywords, callback) => {
        let uploadFunction = (process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc') ? uploadVishResourceAsync : uploadEdiphyResourceAsync;
        this.props.dispatch(uploadFunction(query, keywords, callback));
    };

    /** *
     * Keyword deleted callback
     * @param i position of the keyword
     */
    handleDelete = (i) => {
        let tags = Object.assign([], this.state.keywords);
        tags.splice(i, 1);
        this.setState({ modifiedState: true, keywords: tags });
    };

    /**
     * Keyword added callback
     * @param tag Keyword name
     */
    handleAddition = (tag) => {
        let tags = Object.assign([], this.state.keywords);
        tags.push(tag.text);
        this.setState({ modifiedState: true, keywords: tags });
    };

    /**
     * Keyword moved callback
     * @param tag Tag moving
     * @param currPos Current position
     * @param newPos New position
     */
    handleDrag = (tag, currPos, newPos) => {
        let tags = Object.assign([], this.state.keywords);
        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag.text);
        // re-render
        this.setState({ modifiedState: true, keywords: tags });
    };

    /**
     * Save configuration changes
     */
    saveState = () => {
        this.setState({ modifiedState: false });
        this.props.dispatch(changeGlobalConfig("STATE", this.state));
        this.close();
    };

    close = () => {
        this.props.dispatch(updateUI(UI.showGlobalConfig, !this.props.reactUI.showGlobalConfig));
    };

    getCurrentPageAvatar = () => {
        let element;
        if (document.getElementsByClassName('scrollcontainer').length > 0) {
            element = document.getElementsByClassName('scrollcontainer')[0];
        } else {
            element = document.getElementById('maincontent');
        }

        let clone = element.cloneNode(true);

        let style = clone.style;
        style.width = '600px';
        style.position = 'relative';
        clone.className = clone.className + ' safeZone';
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
                extra_canvas.toBlob(blob => {
                    let file = new File([blob], "avatar.png", { type: "image/png" });
                    this.uploadFunction(file, "", (thumbnail)=>{
                        this.setState({ modifiedState: true, thumbnail });
                    }, "image/png");
                });
                // Uncomment this lines to download the image directly
                // let a = document.createElement('a');
                // a.href = a.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                // a.click();
                document.body.removeChild(clone);
                // this.setState({ modifiedState: true, thumbnail: extra_canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream") });
            },
            useCORS: true });
    };

    /* fileChanged = (event) => {
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

                gc.setState({ modifiedState: true, thumbnail: canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream") });
            };
            img.src = data;
        };
        reader.readAsDataURL(file);
    };*/

    /**
     * Discard configuration changes
     */
    cancel = () => {
        this.setState({
            title: this.props.globalConfig.title,
            author: this.props.globalConfig.author || "",
            canvasRatio: this.props.globalConfig.canvasRatio || 16 / 9,
            age: this.props.globalConfig.age || { min: 0, max: 0 },
            typicalLearningTime: this.props.globalConfig.typicalLearningTime || { h: 0, m: 0, s: 0 },
            difficulty: this.props.globalConfig.difficulty,
            rights: this.props.globalConfig.rights || 1,
            description: this.props.globalConfig.description || '',
            language: this.props.globalConfig.language || undefined,
            keywords: this.props.globalConfig.keywords || [],
            thumbnail: this.props.globalConfig.thumbnail || img_place_holder,
            version: this.props.globalConfig.version || '0.0.0',
            status: this.props.globalConfig.status || 'draft',
            context: this.props.globalConfig.context,
            allowComments: this.props.globalConfig.allowComments,
            allowClone: this.props.globalConfig.allowClone,
            allowDownload: this.props.globalConfig.allowDownload,
            hideGlobalScore: this.props.globalConfig.hideGlobalScore || false,
            minTimeProgress: this.props.globalConfig.minTimeProgress || 3,
            visorNav: this.props.globalConfig.visorNav || { player: true, sidebar: true, keyBindings: true },
            modifiedState: false,
            everPublished: this.props.globalConfig.everPublished,
        });

        //  Comment the following line if you don't want to exit when changes are discarded
        this.close();

    };

    /**
     * If title is changed from outside
     * @param nextProps
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        let fileModalResult = this.props.reactUI.fileModalResult;
        let nextFileModalResult = nextProps.reactUI.fileModalResult;
        let nextGlobalConfig = nextProps.globalConfig;
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
        if (fileModalResult &&
          nextFileModalResult &&
          nextFileModalResult.value !== fileModalResult.value &&
          nextFileModalResult.value &&
          nextFileModalResult.id === 'avatar') {
            this.setState({
                thumbnail: nextFileModalResult.value, modifiedState: true,
            });
        }

        if (!this.props.reactUI.showGlobalConfig && nextProps.reactUI.showGlobalConfig) {
            this.setState({
                title: nextGlobalConfig.title || "",
                author: nextGlobalConfig.author || "",
                canvasRatio: nextGlobalConfig.canvasRatio || 16 / 9,
                age: nextGlobalConfig.age || { min: 0, max: 0 },
                typicalLearningTime: nextGlobalConfig.typicalLearningTime || { h: 0, m: 0, s: 0 },
                difficulty: nextGlobalConfig.difficulty,
                rights: nextGlobalConfig.rights || 1,
                description: nextGlobalConfig.description || '',
                thumbnail: nextGlobalConfig.thumbnail || img_place_holder,
                language: nextGlobalConfig.language,
                keywords: nextGlobalConfig.keywords || [],
                version: nextGlobalConfig.version || '0.0.0',
                status: nextGlobalConfig.status || 'draft',
                context: nextGlobalConfig.context,
                allowComments: nextGlobalConfig.allowComments ? true : nextGlobalConfig.allowComments === undefined,
                allowClone: nextGlobalConfig.allowClone ? true : nextGlobalConfig.allowClone === undefined,
                allowDownload: nextGlobalConfig.allowDownload ? true : nextGlobalConfig.allowDownload === undefined,
                hideGlobalScore: nextGlobalConfig.hideGlobalScore || false,
                minTimeProgress: nextGlobalConfig.minTimeProgress || 3,
                visorNav: { ...(nextGlobalConfig.visorNav || {}),
                    player: nextGlobalConfig.visorNav.player === undefined ? true : nextGlobalConfig.visorNav.player,
                    sidebar: nextGlobalConfig.visorNav.sidebar === undefined ? true : nextGlobalConfig.visorNav.sidebar,
                    keyBindings: nextGlobalConfig.visorNav.keyBindings === undefined ? true : nextGlobalConfig.visorNav.keyBindings,
                    fixedPlayer: nextGlobalConfig.visorNav.fixedPlayer === undefined ? true : nextGlobalConfig.visorNav.fixedPlayer,
                },
                modifiedState: false,
                showAlert: false,
                everPublished: nextGlobalConfig.everPublished,

            });
        }
    }

}

export default connect(mapStateToProps)(GlobalConfig);
function mapStateToProps(state) {
    return {
        reactUI: state.reactUI,
    };
}
GlobalConfig.propTypes = {
    /**
     * Redux actions trigger
     */
    dispatch: PropTypes.func,
    /**
     * Configuration course dictionary. Object identical to Redux state ***globalConfig*** .
     */
    globalConfig: PropTypes.object.isRequired,
    /**
     * Callback for opening the file upload modal
     */
    toggleFileUpload: PropTypes.func.isRequired,
    /**
     * Last files uploaded to server or searched in modal
     */
    fileModalResult: PropTypes.object,
    /**
     * User Interface params
     */
    reactUI: PropTypes.object,
};
