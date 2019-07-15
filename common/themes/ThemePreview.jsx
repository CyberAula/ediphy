import React from 'react';
import PropTypes from 'prop-types';
import ThemeCSS from "../../common/themes/ThemeCSS";
import { loadBackgroundStylePreview } from "./background_loader";
import { Animated } from "react-animated-css";
import { TRANSITIONS } from "./transitions/transitions";

export default class ThemePreview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: true,
        };
    }

    UNSAFE_componentWillUpdate(nextProps, nextState, nextContext) {
        if(this.props.styleConfig.transition !== nextProps.styleConfig.transition) {
            this.setState({ visible: false }, () => setTimeout(() => this.setState({ visible: true }), 0));
        }
    }

    render() {
        const transition = TRANSITIONS[this.props.styleConfig.transition].transition;
        return(
            <Animated animationIn={transition.in} animationOut={transition.out} isVisible={this.state.visible}>
                <div id={"previewZone"} className={"style_preview_container previewZone"}
                    style={{
                        width: '400px',
                        height: '220px',
                        border: '1px solid gray',
                        marginBottom: '20px' }}>
                    <ThemeCSS
                        theme={this.props.theme}
                        toolbar={false}
                        styleConfig={this.props.styleConfig}
                        isPreview
                    />
                    <div className={"style_preview_content " + this.props.theme }
                        style={loadBackgroundStylePreview(this.props.theme)}>
                        <div className={"title"}>
                            <div className={"cab"}>
                                <h2>Slide</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </Animated>
        );
    }

}

ThemePreview.propTypes = {
    /**
     * Object containing style configuration
     */
    styleConfig: PropTypes.object,
    /**
     * Identifier of the current theme
     */
    theme: PropTypes.string,
};
