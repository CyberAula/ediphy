var BasicVideo= (function(){
    return new Dali.Plugin({
        getConfig: function(){
            return {
                name: 'BasicVideo',
                category: 'multimedia',
                needsConfigModal: true,
                needsTextEdition: false,
                icon: 'fa-video-camera'
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
                    step: 0.1,
                    tab: 'Main',
                    accordion: 'Box'
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
                    accordion: 'Box'
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
        },  // TEST URL http://video.webmfiles.org/big-buck-bunny_trailer.webm
        // Posibilidad: http://modernizr.com/

        getSections: function(){
            return [
                {
                    tab: 'Main', 
                    accordion: ['Basic','Box']
                },
                {
                    tab: 'Other', 
                    accordion: ['Extra']
                },

            ];
        },
        getInitialState: function(){
            return {url: '', borderSize: 0, thumbnailVisibility: 'hidden'};
        },
        getConfigTemplate: function(state){
            return "<div> Url: <input type=\"text\" autofocus id=\"BasicImage_input\" value=\"" + state.url + "\"><br><button onclick=\"BasicVideo.showPreview()\">Show preview</button><iframe width=\"560\" height=\"315\"id=\"BasicImage_preview\" frameborder=\"0\" allowfullscreen src=\"" + state.url + "\" style=\"width: 180px; height: auto; visibility: " + state.thumbnailVisibility + ";\"  ></video></div>";
        },
        getRenderTemplate: function(state){
     
            return "<video width=\"560\" height=\"315\" controls frameborder=\"0\" allowfullscreen style=\"width: 100%; height: 100%; border: solid " + state.borderSize + "px green; z-index:0;\" src=\"" + state.url  + "\"></video>"
        },
        handleToolbar: function(name, value){
            if(name === 'borderSize')
                BasicVideo.setState('borderSize', value);
        },
        showPreview: function(){
            var vid = $('#BasicImage_preview');
            var input = $('#BasicImage_input');
            BasicVideo.setState('url', input.val());
            BasicVideo.setState('thumbnailVisibility', 'visible');
            vid.attr('src', input.val());
            vid.css('visibility', 'visible');
        },


    });
})();