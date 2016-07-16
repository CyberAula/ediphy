Dali.Plugins["BasicVideo"] = function (base){
    return {
        getConfig: function () {
            return {
                name: 'BasicVideo',
                category: 'multimedia',
                needsConfigModal: false,
                needsTextEdition: false,
                icon: 'play_arrow'
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: "Video",
                            icon: 'build',
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
                            __name: "Estilo caja",
                            icon: 'style',
                            buttons: {
                                borderSize: {
                                    __name: 'Grosor de borde',
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                    units: 'px',
                                    autoManaged: false
                                },
                                borderStyle: {
                                    __name: 'Estilo de borde',
                                    type: 'text',
                                    value: 'solid',
                                    autoManaged: false,
                                    list: 'borderStyle',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']
                                },
                                borderColor: {
                                    __name: 'Color de borde',
                                    type: 'color',
                                    value: '#000000',
                                    autoManaged: false
                                },
                                borderRadius: {
                                    __name: 'Radio',
                                    type: 'number',
                                    value: '0',
                                    min: '0',
                                    max: '50',
                                    units: '%',
                                    autoManaged: false
                                },
                                opacity: {
                                    __name: 'Opacidad',
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.05
                                }
                                
                            }
                        },
                        '~extra': {
                            __name: "Alias",
                            icon: 'more_horiz',
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
            return "<video width=\"560\" height=\"315\" autoplay onclick=\"$dali$.click()\"" + ((state.controls == "checked") ? "controls=\"controls\" " : " ") + " frameBorder=\"0\" allowFullScreen style=\"width: 100%; height: 100%; pointer-events: 'none'; border: " + state.borderStyle + " " + state.borderSize + "px " + state.borderColor + "; z-index:0;\" src=\"" + state.url + "\"></video>";
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        },
        showPreview: function () {
            var vid = $('#BasicImage_preview');
            var input = $('#BasicImage_input');
             base.setState('thumbnailVisibility', 'visible');
             vid.css('visibility', 'visible');
        },
        click: function(){
            alert("Guau");
        }
    }
}