Dali.Plugins["Youtube"] = function (base) {
    return {
        getConfig: function () {
            return {
                name: 'Youtube',
                category: 'multimedia',
                needsConfigModal: false,
                needsTextEdition: false,
                aspectRatioButtonConfig: {name: "Aspect Ratio", location: ["main", "_sortable"], defaultValue: "checked"},
                icon: 'slideshow'
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
                                    value: 'https://www.youtube.com/watch?v=S9M3c1_yl-E'
                                },
                                /*aspectRatio: {
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
                                },*/
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
                                    units: 'px',
                                    max: 10,
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
                                    units: '%',
                                    value: '0',
                                    min: '0',
                                    max: '50',
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
        getSections: function () {
            return [
                {
                    tab: 'Main',
                    accordion: ['Basic', 'Box']
                },
                {
                    tab: 'Other',
                    accordion: ['Extra']
                },

            ];
        }
        ,
        getInitialState: function () {
            return {
                url: 'https://www.youtube.com/watch?v=S9M3c1_yl-E',
                borderSize: '0px',
                thumbnailVisibility: 'hidden',
                borderStyle:'solid', 
                borderRadius: '0%', 
                borderColor: '#000000', 
                backgroundColor: '#ffffff',
                padding: '0px',
                opacity: 1
            };
        }
        ,
        getConfigTemplate: function (state) {
            return "<div> Url: <input type=\"text\" autofocus id=\"BasicImage_input\" value=\"" + state.url + "\"><br><button onclick=\"$dali$.showPreview()\">Show preview</button><iframe width=\"560\" height=\"315\"id=\"BasicImage_preview\" frameborder=\"0\" allowfullscreen src=\"" + this.parseURL(state.url) + "\" style=\"width: 180px; height: auto; visibility: " + state.thumbnailVisibility + ";\"></iframe></div>";
        
        }
        ,
        getRenderTemplate: function (state) {
            return "<iframe width=\"560\" height=\"315\" controls frameBorder=\"0\" allowFullScreen style=\"width: 100%; height: 100%;  padding:" + state.padding + "; border-radius:" + state.borderRadius + "; opacity: " + state.opacity + "; border:" + state.borderSize + " " + state.borderStyle + " " + state.borderColor + "; z-index:0;\" src=\"" + this.parseURL(state.url) + "\"></iframe>"
        }
        ,
        handleToolbar: function (name, value) {
            if (name == 'url') {
                base.setState(name, base.parseURL(value));
            } else {
                base.setState(name, value);
            }
        }
        ,
        showPreview: function () {
            var vid = $('#BasicImage_preview');
            var input = $('#BasicImage_input');
             base.setState('thumbnailVisibility', 'visible');
             vid.css('visibility', 'visible');
        },
        parseURL: function (url) {
            if (url == ''){ 
                return url; 
            }
            var patt1 = /youtube.com\/watch\?v=(.*)/;
            var patt2 = /youtube.com\/embed\/(.*)/;
            var patt3 = /youtu.be\/(.*)/;
            if (patt2.exec(url)) {
                return url;
            }
            var code = patt1.exec(url);
            if (code) {
                return 'https://www.youtube.com/embed/' + code[1];
            }
            var code2 = patt3.exec(url);
            if (code2) {
                return 'https://www.youtube.com/embed/' + code2[1];
            }
            alert('No es un video de youtube.');
            return '';
        }

    }
}