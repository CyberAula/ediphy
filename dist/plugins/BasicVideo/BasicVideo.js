Dali.Plugins["BasicVideo"] = function (base){
    return {
        getConfig: function () {
            return {
                name: 'BasicVideo',
                category: 'multimedia',
                needsConfigModal: false,
                needsTextEdition: false,
                aspectRatioButtonConfig: {name: "Aspect Ratio", location: ["main", "_sortable"], defaultValue: "checked"},
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
                                padding: {
                                    __name: 'Padding',
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    units: 'px',
                                    max: 100,
                                    autoManaged: false
                                },
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
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                    autoManaged: false
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
                            icon: 'link',
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
                borderSize: '0px',
                borderStyle: 'solid',
                borderRadius: '0%',
                padding: '0px',
                borderColor: '#000000',
                opacity: 1,
                thumbnailVisibility: 'hidden'
            };
        },
        getConfigTemplate: function (state) {
            return "<div> Url: <input type=\"text\" autofocus id=\"BasicImage_input\" value=\"" + state.url + "\"><br><button onclick=\"$dali$.showPreview()\">Show preview</button><iframe width=\"560\" height=\"315\"id=\"BasicImage_preview\" frameborder=\"0\" allowfullscreen src=\"" + state.url + "\" style=\"width: 180px; height: auto; visibility: " + state.thumbnailVisibility + ";\"  ></video></div>";
        },
        getRenderTemplate: function (state) {
            return "<video width=\"560\" height=\"315\" autoplay onclick=\"$dali$.click()\"" + ((state.controls == "checked") ? "controls=\"controls\" " : " ") + " frameBorder=\"0\" allowFullScreen style=\"width: 100%; height: 100%; pointer-events: 'none'; padding: " + state.padding + "; border: " + state.borderStyle + " " + state.borderSize + " " + state.borderColor + "; border-radius:" + state.borderRadius + "; opacity:" + state.opacity + "; z-index:0;\" src=\"" + state.url + "\"></video>";
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