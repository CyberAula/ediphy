var Youtube= (function(){
    return new Dali.Plugin({
        getConfig: function(){
            return {
                name: 'Youtube',
                category: 'multimedia',
                needsConfigModal: false,
                needsTextEdition: false,
                 icon: 'fa-youtube'
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
                    value:'https://www.youtube.com/watch?v=S9M3c1_yl-E'

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
        },
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
            return {url: 'https://www.youtube.com/watch?v=S9M3c1_yl-E', borderSize: 0, thumbnailVisibility: 'hidden'};
        },
        getConfigTemplate: function(state){
            return "<div> Url: <input type=\"text\" autofocus id=\"BasicImage_input\" value=\"" + state.url + "\"><br><button onclick=\"Youtube.showPreview()\">Show preview</button><iframe width=\"560\" height=\"315\"id=\"BasicImage_preview\" frameborder=\"0\" allowfullscreen src=\"" + Youtube.parseURL(state.url) + "\" style=\"width: 180px; height: auto; visibility: " + state.thumbnailVisibility + ";\"  ></iframe></div>";
        },
        getRenderTemplate: function(state){
     
            return "<iframe width=\"560\" height=\"315\" controls frameborder=\"0\" allowfullscreen style=\"width: 100%; height: 100%; pointer-events: none; border: solid " + state.borderSize + "px green; z-index:0;\" src=\"" + Youtube.parseURL(state.url) + "\"></iframe>"
        },
        handleToolbar: function(name, value){
            //if(name == 'url'){
                Youtube.setState(name, Youtube.parseURL(value));
           // }else{
                  Youtube.setState(name, value);
           // }
         
        },
        showPreview: function(){
            var vid = $('#BasicImage_preview');
            var input = $('#BasicImage_input');
            //Youtube.setState('url', Youtube.parseURL(input.val()));
            Youtube.setState('thumbnailVisibility', 'visible');
            //vid.attr('src', Youtube.parseURL(input.val()));
            vid.css('visibility', 'visible');
        },
        parseURL: function(url){
            console.log(url)
            if (url == '') return url
            var patt1 = /youtube.com\/watch\?v=(.*)/
            var patt2 = /youtube.com\/embed\/(.*)/
            var patt3 = /youtu.be\/(.*)/
            if (patt2.exec(url)){
             return url;
            }
            var code = patt1.exec(url)
            if (code){
                return 'https://www.youtube.com/embed/'+ code[1]
            }
            var code2 = patt3.exec(url)
            if (code2){
                return 'https://www.youtube.com/embed/'+ code2[1]
            }
            alert('No es un video de Youtube.')
            return ''
        }

    });
})();