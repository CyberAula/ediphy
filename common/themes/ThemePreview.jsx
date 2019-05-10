import React from 'react';
import PropTypes from 'prop-types';
import ThemeCSS from "../../common/themes/ThemeCSS";
import { loadBackgroundStylePreview } from "./background_loader";

export default class ThemePreview extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div id={"previewZone"} className={"style_preview_container previewZone"} style={{ width: '400px', height: '220px', border: '1px solid gray', marginBottom: '20px' }}>
                <ThemeCSS
                    theme={this.props.theme}
                    toolbar={false}
                    styleConfig={this.props.styleConfig}
                    isPreview
                />
                <div className={"style_preview_content " + this.props.theme } style={loadBackgroundStylePreview(this.props.theme)}>
                    <div className={"title"}>
                        <div className={"cab"}>
                            <h2>Slide</h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
