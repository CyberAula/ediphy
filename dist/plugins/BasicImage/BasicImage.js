Dali.Plugins["BasicImage"] = function (base){
    return {
        init: function(){
            base.registerExtraFunction(this.imageClick);
            base.registerExtraFunction(this.printState);
        },
        getConfig: function(){
            return {
                name: 'BasicImage',
                category: 'image',
                needsConfigModal: false,
                needsTextEdition: false,
                aspectRatioButtonConfig: {name: "Aspect Ratio", location: ["main", "basic"], defaultValue: "checked"},
                icon: 'fa-picture-o'
            };
        },
        getToolbar: function(){
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
                                    value: 'http://nemanjakovacevic.net/wp-content/uploads/2013/07/placeholder.png'
                                }
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
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                    autoManaged: false
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
        getInitialState: function(){
            return {url: 'http://nemanjakovacevic.net/wp-content/uploads/2013/07/placeholder.png', aspectRatio:'unchecked', borderSize: 0, borderSize: 0, borderStyle:'solid', borderRadius: 0, borderColor: '#000000', thumbnailVisibility: 'hidden'};
        },
        getConfigTemplate: function(state){
            return "<div> Url: <input type=\"text\" autofocus id=\"BasicImage_input\" value=\"" + state.url + "\"><br><button onclick=\"$dali$.showPreview()\">Show preview</button><img id=\"BasicImage_preview\" src=\"" + state.url + "\" style=\"width: 100px; height: 100px; visibility: " + state.thumbnailVisibility + ";\" onclick=\"$dali$.imageClick()\" /></div>";
        },
        getRenderTemplate: function(state){
            return "<div style=\"width: 100%; height: 100%\"><img onclick=\"$dali$.showPreview()\" style=\"width: 100%; height: 100%; border-radius: "+state.borderRadius+"%; border: "+ state.borderSize + "px "+ state.borderStyle +" "+ state.borderColor +";\" src=\"" + state.url + "\"/></div>";
        },
        handleToolbar: function(name, value){
            if(name=='aspectRatio') {
                base.setState(name, base.getState().aspectRatio == 'checked' ? 'unchecked' : 'checked');
            }
            else {
                base.setState(name, value);
            }
        },
        showPreview: function(){
            var img = $('#BasicImage_preview');
            var input = $('#BasicImage_input');

            //BasicImage.setState('url', input.val());
            base.setState('thumbnailVisibility', 'visible');
            // img.attr('src', input.val());
            img.css('visibility', 'visible');
        },
        imageClick: function() {
            alert("Miaua!");
        },
        printState: function() {
            console.log(this);
        }
    }
};