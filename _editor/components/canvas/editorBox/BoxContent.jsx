import React from 'react';
import Ediphy from "../../../../core/editor/main";
import { Box } from "./Styles";
let html2json = require('html2json').html2json;

/* eslint-disable react/prop-types */

export default class BoxContent extends React.Component {
    render() {
        let reactContent = Ediphy.Plugins.get(this.props.toolbar.pluginId).getRenderTemplate(this.props.toolbar.state, this.props.props);
        return (
            <Box style={this.props.style} className={"boxStyle"} ref={"content"}>
                {this.props.config.flavor === "react" ? reactContent :
                    this.props.renderChildren(html2json(Ediphy.Plugins.get(this.props.toolbar.pluginId).getRenderTemplate(this.props.toolbar.state, this.props.props))) }
            </Box>);
    }
}

