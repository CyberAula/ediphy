Dali.Plugins["Webpage"] = function (base){
    return {
        getConfig: function () {
            return {
                name: 'Webpage',
                category: 'multimedia',
                needsConfigModal: false,
                needsTextEdition: false,
                icon: 'public'
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: "URL",
                            icon: 'build',
                            buttons: {
                                url: {
                                    __name: '',
                                    type: 'text',
                                    autoManaged: false,
                                    value: 'http://www.adams.es/'
                                }
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
        getInitialState: function () {
            return {url: 'http://www.adams.es/', borderSize: '0px', thumbnailVisibility: 'hidden', padding: '0px', borderStyle: 'none', borderColor: '#ffffff', borderRadius: '0%', opacity : 1};
        },
        getConfigTemplate: function (state) {
            return "<div> Url: <input type=\"text\" autofocus id=\"BasicImage_input\" value=\"" + state.url + "\"><br><button onclick=\"$dali$.showPreview()\">Show preview</button><iframe width=\"560\" height=\"315\"id=\"BasicImage_preview\" frameborder=\"0\" allowfullscreen src=\"" + state.url + "\" style=\"width: 180px; height: auto; visibility: " + state.thumbnailVisibility + ";\"></iframe></div>";
        },
        getRenderTemplate: function (state) {
            return "<iframe width=\"560\" height=\"315\" style=\"width: 100%; height: 100%; padding: " + state.padding + "; border-radius: " + state.borderRadius + "; border: " + state.borderSize + " " + state.borderStyle + " " + state.borderColor + "; opacity: " + state.opacity + "; z-index:0;\" src=\"" + state.url + "\"></iframe>";
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        },
        showPreview: function () {
            var vid = $('#BasicImage_preview');
            var input = $('#BasicImage_input');
             base.setState('thumbnailVisibility', 'visible');
             vid.css('visibility', 'visible');
        }
    }
}
