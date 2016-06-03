Dali.Plugins["BasicText"] = function (base) {
    return {
        getConfig: function () {
            return {
                name: 'BasicText',
                category: 'text',
                needsConfigModal: false,
                needsTextEdition: true,
                icon: 'fa-align-left'
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: "Basic",
                            buttons: {}
                        }
                    }
                },
                font: {
                    __name: "Font",
                    accordions: {
                        size: {
                            __name: "Size",
                            buttons: {
                                fontSize: {
                                    __name: 'Font Size (ems)',
                                    type: 'number',
                                    units: 'em',
                                    value: 1,
                                    min: 1,
                                    max: 10
                                }
                            }
                        },
                        color: {
                            __name: "Color",
                            buttons: {
                                color: {
                                    __name: 'Font color',
                                    type: 'text',
                                    value: 'black'
                                }
                            }
                        }
                    }
                },
                box: {
                    name: "Box",
                    accordions: {
                        layout: {
                            __name: "Layout",
                            buttons: {
                                opacity: {
                                    __name: 'Opacity',
                                    type: 'number',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.1
                                },
                                padding: {
                                    __name: 'Padding (px)',
                                    type: 'number',
                                    units: 'px',
                                    value: 0,
                                    min: 0
                                }
                            }
                        }
                    }
                },
                other: {
                    __name: "Other",
                    accordions: {
                        extra: {
                            __name: "Extra",
                            buttons: {}
                        }
                    }
                }
            }
        }
    }
}