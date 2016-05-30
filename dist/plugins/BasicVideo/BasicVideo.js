Dali.Plugins["BasicVideo"] = function (base){
    return {
        getConfig: function () {
            return {
                name: 'BasicVideo',
                category: 'multimedia',
                needsConfigModal: false,
                needsTextEdition: false,
                icon: 'fa-video-camera'
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: "Basic",
                            buttons: {
                                url: {
                                    __name: 'URL',
                                    type: 'text',
                                    autoManaged: false,
                                    value: 'http://video.webmfiles.org/big-buck-bunny_trailer.webm'
                                },
                                aspectRatio: {
                                    __name: 'Aspect Ratio',
                                    type: 'checkbox',
                                    value: 'unchecked',
                                    checked: 'false',
                                    autoManaged: false
                                },
                                allowFullScreen: {
                                    __name: 'Allow FullScreen',
                                    type: 'checkbox',
                                    value: 'unchecked',
                                    checked: 'false',
                                    autoManaged: false
                                },
                                controls: {
                                    __name: 'Show Controls',
                                    type: 'checkbox',
                                    value: 'unchecked',
                                    checked: 'false',
                                    autoManaged: false
                                },
                            }
                        },
                        style: {
                            __name: "Style",
                            buttons: {
                                opacity: {
                                    __name: 'Opacity',
                                    type: 'number',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.1
                                },
                                borderSize: {
                                    __name: 'Border Size',
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                    autoManaged: false
                                },
                                borderColor: {
                                    __name: 'Border Color',
                                    type: 'color',
                                    value: '#000000',
                                    autoManaged: false
                                },
                                borderRadius: {
                                    __name: 'Border Radius',
                                    type: 'number',
                                    value: '0',
                                    min: '0',
                                    max: '50',
                                    autoManaged: false
                                },
                                borderStyle: {
                                    __name: 'Border Style',
                                    type: 'text',
                                    value: 'solid',
                                    autoManaged: false,
                                    list: 'borderStyle',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']
                                },
                            }
                        }
                    }
                },
                other: {
                    __name: "Other",
                    accordions: {
                        extra: {
                            __name: "Extra",
                            buttons: {
                                test: {
                                    __name: 'Test',
                                    type: 'text',
                                    isAttribute: true
                                }
                            }
                        }
                    }
                }
            }
        },
        // TEST URL http://video.webmfiles.org/big-buck-bunny_trailer.webm
        // Posibilidad: http://modernizr.com/
        getInitialState: function () {
            return {
                url: 'http://video.webmfiles.org/big-buck-bunny_trailer.webm',
                aspectRatio: 'unchecked',
                borderSize: 0,
                borderSize: 0,
                borderStyle: 'solid',
                borderRadius: 0,
                borderColor: '#000000',
                thumbnailVisibility: 'hidden'
            };
        },
        getConfigTemplate: function (state) {
            return "<div> Url: <input type=\"text\" autofocus id=\"BasicImage_input\" value=\"" + state.url + "\"><br><button onclick=\"$dali$.showPreview()\">Show preview</button><iframe width=\"560\" height=\"315\"id=\"BasicImage_preview\" frameborder=\"0\" allowfullscreen src=\"" + state.url + "\" style=\"width: 180px; height: auto; visibility: " + state.thumbnailVisibility + ";\"  ></video></div>";
        },
        getRenderTemplate: function (state) {
            return "<video width=\"560\" height=\"315\" onclick=\"$dali$.click()\"" + ((state.controls == "checked") ? "controls=\"controls\" " : " ") + " frameBorder=\"0\" allowFullScreen style=\"width: 100%; height: 100%; pointer-events: 'none'; border: " + state.borderStyle + " " + state.borderSize + "px " + state.borderColor + "; z-index:0;\" src=\"" + state.url + "\"></video>";
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        },
        showPreview: function () {
            var vid = $('#BasicImage_preview');
            var input = $('#BasicImage_input');
            // base.setState('url', input.val());
            base.setState('thumbnailVisibility', 'visible');
            // vid.attr('src', input.val());
            vid.css('visibility', 'visible');
        },
        click: function(){
            alert("Guau");
        }
    }
}