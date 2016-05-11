Dali.Plugins["BasicPlugin"] = function (base){
    return{
        getConfig: function(){
            return {
                name: 'BasicPlugin',
                category: 'image',
                needsConfigModal: true,
                needsTextEdition: true,
                icon:'fa-star'
            }
        },
        getToolbar: function(){
            return [
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
        getInitialState: function() {
            return {url: '', borderSize: 0, thumbnailVisibility: 'hidden'};
        },
        getConfigTemplate: function(state) {
            return "<div> Url: <input type=\"text\" autofocus id=\"BasicImage_input\" value=\"" + state.url + "\"><br><button onclick=\"Dali.Plugins.get('BasicPlugin').showPreview()\">Show preview</button><img id=\"BasicImage_preview\" src=\"" + state.url + "\" style=\"width: 100px; height: 100px; visibility: " + state.thumbnailVisibility + ";\" onclick=\"Dali.Plugins.get('BasicPlugin').imageClick()\" /></div>";
        },
        getRenderTemplate: function(state){
            return "<div><img style=\"width: 100%; height: 100%; border: solid " + state.borderSize + "px green\" src=\"" + state.url + "\"/><span>" + state.text + "</span></div>";
        },
        handleToolbar: function(name, value){
            if(name === 'borderSize')
                base.setState('borderSize', value);
        },
        showPreview: function(){
            var img = $('#BasicImage_preview');
            var input = $('#BasicImage_input');
            base.setState('url', input.val());
            base.setState('thumbnailVisibility', 'visible');
            img.attr('src', input.val());
            img.css('visibility', 'visible');
        },
        imageClick: function() {
            alert("Miau!");
        }
    }
}