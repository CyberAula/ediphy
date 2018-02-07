import React, { Component } from 'react';
import i18n from 'i18next';
import ViewToolbar from '../view_toolbar/ViewToolbar';
import PluginToolbar from '../plugin_toolbar/PluginToolbar';
import { isCanvasElement } from "../../../../common/utils";
import Ediphy from "../../../../core/editor/main";

export default class Toolbar extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

        /**
         * Component's initial state
         * @type {{open: boolean}}
         */
        this.state = {
            open: false,
        };
    }

    render() {
        return(
            (this.props.boxSelected === -1 && isCanvasElement(this.props.navItemSelected, Ediphy.Config.sections_have_content)) ?
                <ViewToolbar {...this.props}
                    open={this.state.open}
                    toggleToolbar={()=>this.toggleToolbar()}/> :
                <PluginToolbar {...this.props}
                    open={this.state.open}
                    toggleToolbar={()=>this.toggleToolbar()}
                />
        );
    }

    toggleToolbar() {
        this.setState({ open: !this.state.open });
    }
}
