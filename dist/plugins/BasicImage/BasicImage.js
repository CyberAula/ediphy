var BasicImage = (function(){
    return new Dali.Plugin({
        init: function(){
            BasicImage.registerExtraFunction(this.imageClick);
            BasicImage.registerExtraFunction(this.printState);
        },
        getConfig: function(){
            return {
                name: 'BasicImage',
                category: 'image',
                needsConfigModal: true,
                needsTextEdition: false
            };
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
                    step: 0.1
                },
                {
                    name: 'borderSize',
                    humanName: 'Border Size',
                    type: 'number',
                    value: 0,
                    min: 0,
                    max: 10,
                    autoManaged: false,
                },
                {
                    name: 'test',
                    humanName: 'Test',
                    type: 'text',
                    isAttribute: true
                }
            ]
        },
        getInitialState: function(){
            return {url: '', borderSize: 0, thumbnailVisibility: 'hidden'};
        },
        getConfigTemplate: function(state){
            return "<div> Url: <input type=\"text\" autofocus id=\"BasicImage_input\" value=\"" + state.url + "\"><br><button onclick=\"BasicImage.showPreview()\">Show preview</button><img id=\"BasicImage_preview\" src=\"" + state.url + "\" style=\"width: 100px; height: 100px; visibility: " + state.thumbnailVisibility + ";\" onclick=\"BasicImage.imageClick()\" /></div>";
        },
        getRenderTemplate: function(state){
            return "<img style=\"width: 100%; height: 100%; border: solid " + state.borderSize + "px green\" src=\"" + state.url + "\"/>";
        },
        handleToolbar: function(name, value){
            if(name === 'borderSize')
                BasicImage.setState('borderSize', value);
        },
        showPreview: function(){
            var img = $('#BasicImage_preview');
            var input = $('#BasicImage_input');
            BasicImage.setState('url', input.val());
            BasicImage.setState('thumbnailVisibility', 'visible');
            img.attr('src', input.val());
            img.css('visibility', 'visible');
        },
        imageClick: function() {
            alert("Miau!");
        },
        printState: function() {
            console.log(this);
        }
    });
})();