import React from "react";
import VideoPlugin from './components/VideoPlugin.js';

export function BasicVideo2(base) {
    return {
        getConfig: function () {
            return {
                name: "BasicVideo2",
                flavor: "react",
                displayName: Dali.i18n.t("BasicVideo2.PluginName"),
                category: "multimedia",
                icon: "play_arrow"
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        style: {
                            __name: Dali.i18n.t("BasicVideo2.style"),
                            icon: "palette",
                            order: [
                                "margins",
                                "paddings",
                                "borderWidth",
                                "borderStyle",
                                "borderColor",
                                "borderRadius",
                                "opacity"
                            ],
                            accordions: {
                                margins: {
                                    __name: Dali.i18n.t("BasicVideo2.margin"),
                                    buttons: {
                                        left: {
                                            __name: Dali.i18n.t("BasicVideo2.left"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px"
                                        },
                                        right: {
                                            __name: Dali.i18n.t("BasicVideo2.right"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px"
                                        },
                                        top: {
                                            __name: Dali.i18n.t("BasicVideo2.top"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px"
                                        },
                                        bottom: {
                                            __name: Dali.i18n.t("BasicVideo2.bottom"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px"
                                        }
                                    },
                                },
                                paddings: {
                                    __name: Dali.i18n.t("BasicVideo2.padding"),
                                    buttons: {
                                        left: {
                                            __name: Dali.i18n.t("BasicVideo2.left"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px"
                                        },
                                        right: {
                                            __name: Dali.i18n.t("BasicVideo2.right"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px"
                                        },
                                        top: {
                                            __name: Dali.i18n.t("BasicVideo2.top"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px"
                                        },
                                        bottom: {
                                            __name: Dali.i18n.t("BasicVideo2.bottom"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px"
                                        }
                                    },
                                }
                            },
                            buttons: {
                                borderWidth: {
                                    __name: Dali.i18n.t("BasicVideo2.border_width"),
                                    type: "number",
                                    value: "0px",
                                    min: 0,
                                    max: 10,
                                    units: "px"
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t("BasicVideo2.border_style"),
                                    type: "select",
                                    value: "solid",
                                    options: ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "initial", "inherit"]
                                },
                                borderColor: {
                                    __name: Dali.i18n.t("BasicVideo2.border_color"),
                                    type: "color",
                                    value: "#000000"
                                },
                                borderRadius: {
                                    __name: Dali.i18n.t("BasicVideo2.border_radius"),
                                    type: "number",
                                    value: "0%",
                                    min: "0",
                                    max: "50",
                                    step: "5",
                                    units: "%"
                                },
                                opacity: {
                                    __name: Dali.i18n.t("BasicVideo2.opacity"),
                                    type: "range",
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01
                                }
                            }
                        }
                    }
                }
            };
        },
        getInitialState: function () {
            return {
                url: "https://www.youtube.com/watch?time_continue=156&v=yqCwDurUrw0",
                controls: true,
                autoplay: false
            };
        },
        getRenderTemplate: function (state) {
            return (
                /* jshint ignore:start */
                <VideoPlugin state={state}></VideoPlugin>
                /* jshint ignore:end */
            );
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        }

    };
}
