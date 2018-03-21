import React, { Component } from 'react';
import i18n from 'i18next';
import ViewToolbar from '../view_toolbar/ViewToolbar';
import PluginToolbar from '../plugin_toolbar/PluginToolbar';
import { isCanvasElement } from "../../../../common/utils";
import Ediphy from "../../../../core/editor/main";
import {
    Tooltip,
    FormControl,
    OverlayTrigger,
    Popover,
    InputGroup,
    FormGroup,
    Radio,
    ControlLabel,
    Checkbox,
    Button,
    PanelGroup,
    Panel,
} from 'react-bootstrap';
export default class Toolbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    render() {
        let exercises = {};
        let toolbar = null;
        let title = "";
        let noBoxSelected = this.props.boxSelected === -1 && isCanvasElement(this.props.navItemSelected, Ediphy.Config.sections_have_content);
        let noPageSelected = false;
        if (!this.props.exercises[this.props.navItemSelected]) {
            noPageSelected = true;
        } else if(noBoxSelected) {
            exercises = this.props.exercises[this.props.navItemSelected];
            toolbar = <ViewToolbar {...this.props}
                open={this.state.open}
                exercises={exercises}
                toggleToolbar={()=>this.toggleToolbar()} />;

            title = (this.props.viewToolbars[this.props.navItemSelected].viewName || "");
        } else {
            exercises = this.props.exercises[this.props.navItemSelected].exercises[this.props.boxSelected];
            toolbar = <PluginToolbar {...this.props}
                open={this.state.open}
                exercises={exercises}
                toggleToolbar={()=>this.toggleToolbar()}
                openConfigModal={this.props.openConfigModal} />;
            let tb = this.props.pluginToolbars[this.props.box.id];
            let apiPlugin = Ediphy.Plugins.get(tb.pluginId);
            let config;
            if(apiPlugin) {
                config = apiPlugin.getConfig();
            } else {
                config = {};
            }
            title = (config.displayName || "");

        }
        let open = (!noPageSelected && this.state.open);
        return (
            <div id="wrap"
                className="wrapper"
                style={{
                    right: '0px',
                    top: this.props.top,
                }}>
                <div className="pestana"
                    onClick={() => {
                        this.toggleToolbar();
                    }}/>
                <div id="tools"
                    style={{
                        width: open ? '250px' : '40px',
                    }}
                    className="toolbox">
                    <OverlayTrigger placement="left"
                        overlay={
                            <Tooltip className={open ? 'hidden' : ''}
                                id="tooltip_props">
                                {i18n.t('Properties')}
                            </Tooltip>
                        }>
                        <div onClick={() => {
                            this.toggleToolbar();
                        }}
                        style={{ display: this.props.carouselShow ? 'block' : 'block' }}
                        className={open ? 'carouselListTitle toolbarSpread' : 'carouselListTitle toolbarHide'}>
                            <div className="toolbarTitle">
                                <i className="material-icons">settings</i>
                                <span className="toolbarTitletxt">
                                    {i18n.t('Properties')}
                                </span>
                            </div>
                            <div className="pluginTitleInToolbar">
                                {title}
                            </div>
                        </div>
                    </OverlayTrigger>
                    <div id="insidetools" style={{ display: open ? 'block' : 'none' }}>
                        <div className="toolbarTabs">
                            {toolbar}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    toggleToolbar() {
        this.setState({ open: !this.state.open });
    }
}
