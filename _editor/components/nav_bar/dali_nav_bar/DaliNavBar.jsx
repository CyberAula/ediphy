import React, { Component } from 'react';
import { Col, Input, Dropdown, MenuItem } from 'react-bootstrap';
import DaliIndexTitle from '../../carrousel/dali_index_title/DaliIndexTitle';
import GlobalConfig from '../global_config/GlobalConfig';
import i18n from 'i18next';
import { isSection } from '../../../../common/utils';
import Dali from './../../../../core/main';
import { toggleFullScreen, isFullScreenOn, fullScreenListener } from '../../../../common/common_tools';
require('./_navBar.scss');

/**
 * Upper navigation bar component
 */
export default class DaliNavBar extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);

        /**
         * Component's initial state
         */
        this.state = {
            showGlobalConfig: false,
            isFullScreenOn: isFullScreenOn(),

        };
        /**
         * Binded function
         */
        this.checkFullScreen = this.checkFullScreen.bind(this);

    }
    /**
     * Click on plugin category callback
     */
    openPlugin(category) {
        this.props.setcat(category);
    }

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        let disablePlugins = (this.props.navItemsIds.length === 0 || (this.props.navItemSelected === 0 && this.props.containedViewSelected === 0));
        let modalTitle = "";
        let modalShow = false;
        return (
            <Col id="iconBar">
                <div className="grad1" />
                <div className="navBarSpace">
                    <DaliIndexTitle className="tituloCurso"
                        title={this.props.globalConfig.title}
                        onNameChanged={this.props.onTitleChanged}/>
                </div>

                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'text' ? 'navButtonPlug active' : 'navButtonPlug' }
                    title='Text' disabled={false /* disablePlugins*/}
                    onClick={() => {this.openPlugin('text');}}><i
                        className="material-icons">text_fields</i><br/> <span
                        className="hideonresize">{i18n.t("Text")}</span></button>
                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'image' ? 'navButtonPlug active' : 'navButtonPlug' }
                    title='Images' disabled={false /* disablePlugins*/}
                    onClick={() => { this.openPlugin('image');}}><i className="material-icons">image</i><br/><span
                        className="hideonresize"> {i18n.t("Images")}</span></button>
                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'multimedia' ? 'navButtonPlug active' : 'navButtonPlug' }
                    title={i18n.t("Multimedia")} disabled={false /* disablePlugins*/}
                    onClick={() => {this.openPlugin('multimedia');}}><i className="material-icons">play_circle_filled</i><br/> <span
                        className="hideonresize">{i18n.t("Multimedia")}</span></button>
                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'animations' ? ' navButtonPlug active' : 'navButtonPlug' }
                    title={i18n.t("Animations")} disabled={false /* disablePlugins*/}
                    style={{ display: 'none' }}
                    onClick={() => {this.openPlugin('animations');}}><i className="material-icons">toys</i><br/> <span
                        className="hideonresize">{i18n.t("Animations")}</span></button>
                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'exercises' ? 'navButtonPlug active' : 'navButtonPlug' }
                    title={i18n.t("Exercises")} disabled={false /* disablePlugins*/}
                    style={{ display: 'none' }}
                    onClick={() => {this.openPlugin('exercises'); }}><i className="material-icons">school</i><br/> <span
                        className="hideonresize">{i18n.t("Exercises")}</span></button>

                <Dropdown id="dropdown-menu" style={{ float: 'right' }}>
                    <Dropdown.Toggle noCaret className="navButton">
                        <i className="material-icons">more_vert</i><br/>
                        <span className="hideonresize" style={{ fontSize: '12px' }}>Menu</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu id="topMenu" className="pageMenu super-colors topMenu">
                        <MenuItem disabled={this.props.undoDisabled} eventKey="1">
                            <button className="dropdownButton" title={i18n.t('messages.export_to_HTML')}
                                disabled={ (this.props.navItemSelected === 0) || this.props.undoDisabled}
                                onClick={() => this.props.export() }><i className="material-icons">file_download</i>
                                {i18n.t('messages.export_to_HTML')}
                            </button>
                        </MenuItem>
                        <MenuItem disabled={this.props.undoDisabled} eventKey="2">
                            <button className="dropdownButton" title={i18n.t('messages.export_to_SCORM')}
                                disabled={(this.props.navItemSelected === 0) || this.props.undoDisabled}
                                onClick={() => this.props.scorm() }><i className="material-icons">class</i>
                                {i18n.t('messages.export_to_SCORM')}
                            </button>
                        </MenuItem>
                        <MenuItem disabled={false} eventKey="3">
                            <button className="dropdownButton" title={i18n.t('messages.global_config')}
                                disabled={false}
                                onClick={() => this.setState({ showGlobalConfig: true })}><i className="material-icons">settings</i>
                                {i18n.t('messages.global_config')}
                            </button>
                        </MenuItem>
                        <MenuItem divider/>
                        <MenuItem eventKey="5">
                            <button className="dropdownButton" title={i18n.t('Open_Catalog')}
                                onClick={() => {
                                    this.props.onVishCatalogToggled();
                                }}><i className="material-icons">grid_on</i>
                                {i18n.t('Open_Catalog')}
                            </button>
                        </MenuItem>
                        <MenuItem divider/>
                        <MenuItem eventKey="5">
                            <button className="dropdownButton"
                                onClick={(e) => {
                                    this.props.serverModalOpen();
                                    this.props.opens();
                                }}>
                                <i className="material-icons">folder_open</i>
                                {i18n.t('Open')}
                            </button>
                        </MenuItem>
                    </Dropdown.Menu>
                </Dropdown>

                <div className="navButtons">
                    <button className="navButton"
                        title={i18n.t("messages.fullscreen")}
                        onClick={() => {
                            toggleFullScreen();
                            this.setState({ isFullScreenOn: isFullScreenOn() });
                        }}>
                        {this.state.isFullScreenOn ?
                            (<i className="material-icons">fullscreen_exit</i>) :
                            (<i className="material-icons">fullscreen</i>)}
                        <br/>
                        <span className="hideonresize">{i18n.t('fullscreen')}</span>
                    </button>
                    <button className="navButton"
                        title="Undo"
                        disabled={this.props.undoDisabled}
                        onClick={() => this.props.undo()}>
                        <i className="material-icons">undo</i>
                        <br/>
                        <span className="hideonresize">{i18n.t('Undone')}</span>
                    </button>
                    <button className="navButton"
                        title="Redo"
                        disabled={this.props.redoDisabled}
                        onClick={() => this.props.redo()}>
                        <i className="material-icons">redo</i>
                        <br/>
                        <span className="hideonresize">{i18n.t('Redone')}</span>
                    </button>
                    <button className="navButton"
                        title={i18n.t('Save')}
                        disabled={this.props.undoDisabled }
                        onClick={() => {
                            this.props.save();
                            this.props.serverModalOpen();
                        }}>
                        <i className="material-icons">save</i>
                        <br/>
                        <span className="hideonresize">{i18n.t('Save')}</span>
                    </button>
                    <button className="navButton"
                        title={i18n.t('Preview')}
                        disabled={((this.props.navItemSelected === 0 || (this.props.navItemSelected && !Dali.Config.sections_have_content && isSection(this.props.navItemSelected))))}
                        onClick={() =>
                        { if (this.props.boxSelected !== 0) {
                            this.props.onTextEditorToggled(this.props.boxSelected, false);
                        }
                        this.props.visor();
                        }}><i className="material-icons">visibility</i>
                        <br/>
                        <span className="hideonresize">{i18n.t('Preview')}</span>
                    </button>
                </div>
                <GlobalConfig show={this.state.showGlobalConfig}
                    globalConfig={this.props.globalConfig}
                    changeGlobalConfig={this.props.changeGlobalConfig}
                    close={()=>{this.setState({ showGlobalConfig: false });}}/>
            </Col>
        );
    }

    /**
     * Add fullscreen listeners
     */
    componentDidMount() {
        fullScreenListener(this.checkFullScreen, true);
    }

    /**
     * Remove fullscreen listeners
     */
    componentWillUnmount() {
        fullScreenListener(this.checkFullScreen, false);
    }

    /**
     * Check if browser is in fullscreen mode and update state
     */
    checkFullScreen() {
        this.setState({ isFullScreenOn: isFullScreenOn() });
    }
}
