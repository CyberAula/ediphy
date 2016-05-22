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
                needsConfigModal: true,
                needsTextEdition: false,
                icon: 'fa-picture-o'
            };
        },
        getToolbar: function(){
            return [
                 {
                    name: 'url',
                    humanName: 'URL',
                    type: 'text',
                    tab: 'Main',
                    accordion: 'Basic',
                    autoManaged: false,
                    value:'http://nemanjakovacevic.net/wp-content/uploads/2013/07/placeholder.png'
                },
                {
                    name: 'opacity',
                    humanName: 'Opacity',
                    type: 'number',
                    value: 1,
                    min: 0,
                    max: 1,
                    step: 0.1,
                    tab: 'Main',
                    accordion: 'Style'
                },
                {
                    name: 'aspectRatio',
                    humanName: 'Aspect Ratio',
                    type: 'checkbox',
                    value: 'unchecked',
                    checked:'false',
                    autoManaged: false,
                    tab: 'Main',
                    accordion: 'Basic'
                },
                {
                    name: 'borderSize',
                    humanName: 'Border Size',
                    type: 'number',
                    value: 0,
                    min: 0,
                    max: 10,
                    autoManaged: false,
                    tab: 'Main',
                    accordion: 'Style'
                },
                {
                    name: 'test',
                    humanName: 'Test',
                    type: 'text',
                    isAttribute: true,
                    tab: 'Other',
                    accordion: 'Extra'
                },
                {
                    name: 'borderColor',
                    humanName: 'Border Color',
                    type: 'color',
                    value: '#000000',
                    tab: 'Main',
                    autoManaged: false,
                    accordion: 'Style'
                },
                {
                    name: 'borderRadius',
                    humanName: 'Border Radius',
                    type: 'number',
                    value: '0',
                    min:'0',
                    max:'50',
                    autoManaged: false,
                    tab: 'Main',
                    accordion: 'Style'
                },
                {
                    name: 'borderStyle',
                    humanName: 'Border Style',
                    type: 'text',
                    value: 'solid',
                    autoManaged: false,
                    list:'borderStyle',
                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                    tab: 'Main',
                    accordion: 'Style'
                }
            ]
        },
        getSections: function(){
            return [
                {
                    tab: 'Main', 
                    accordion: ['Basic', 'Style']
                },
                {
                    tab: 'Other', 
                    accordion: ['Extra']
                },
            ];
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