import React, { Component } from 'react';
import i18n from 'i18next';
import ViewToolbar from '../view_toolbar/ViewToolbar';
import PluginToolbar from '../plugin_toolbar/PluginToolbar';
import { isCanvasElement } from "../../../../common/utils";
import Ediphy from "../../../../core/editor/main";

export default class Toolbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    render() {
        console.log(this.props.exercises);
        return(
            (this.props.boxSelected === -1 && isCanvasElement(this.props.navItemSelected, Ediphy.Config.sections_have_content)) ?
                <ViewToolbar {...this.props}
                    open={this.state.open}
                    exercises={this.props.exercises[this.props.navItemSelected]}
                    toggleToolbar={()=>this.toggleToolbar()}/> :
                <PluginToolbar {...this.props}
                    open={this.state.open}
                    exercises={this.props.exercises[this.props.boxSelected]}
                    toggleToolbar={()=>this.toggleToolbar()}
                    openConfigModal={this.props.openConfigModal}
                />
        );
    }

    toggleToolbar() {
        this.setState({ open: !this.state.open });
    }
}
