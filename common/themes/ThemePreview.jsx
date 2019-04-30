import React from 'react';
import PropTypes from 'prop-types';
import ThemeCSS from "../../common/themes/ThemeCSS";

export default class ThemePreview extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props);
        return(
            <div className={"style_preview_container safeZone"} style={{ width: '400px', height: '220px', border: '1px solid gray', marginBottom: '20px' }}>
                <ThemeCSS
                    theme={this.props.theme}
                    toolbar={false}
                    styleConfig={this.props.styleConfig}
                />
                <div className={"style_preview_content " + this.props.theme } style={{ fontSize: '7px' }}>
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
