var Webpage= (function(){
    return new Dali.Plugin({
        getConfig: function(){
            return {
                name: 'Webpage',
                category: 'multimedia',
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
            return "<div> Url: <input type=\"text\" autofocus id=\"BasicImage_input\" value=\"" + state.url + "\"><br><button onclick=\"Webpage.showPreview()\">Show preview</button><iframe width=\"560\" height=\"315\"id=\"BasicImage_preview\" frameborder=\"0\" allowfullscreen src=\"" + state.url + "\" style=\"width: 180px; height: auto; visibility: " + state.thumbnailVisibility + ";\"  ></iframe></div>";
        },
        getRenderTemplate: function(state){
     
            return "<iframe width=\"560\" height=\"315\"  style=\"width: 100%; height: 100%; pointer-events: none; border: solid " + state.borderSize + "px green; z-index:0;\" src=\"" +state.url + "\"></iframe>"
        },
        handleToolbar: function(name, value){
            if(name === 'borderSize')
                Webpage.setState('borderSize', value);
        },
        showPreview: function(){
            var vid = $('#BasicImage_preview');
            var input = $('#BasicImage_input');
            Webpage.setState('url', input.val());
            Webpage.setState('thumbnailVisibility', 'visible');
            vid.attr('src', input.val());
            vid.css('visibility', 'visible');
        },
        parseURL: function(url){
            console.log(url)
            if (url == '') return url
            var patt1 = /Webpage.com\/watch\?v=(.*)/
            var patt2 = /Webpage.com\/embed\/(.*)/
            if (patt2.exec(url)){ console.log(url); return url;}
            var code = patt1.exec(url)
            if (code){
                console.log(code[1])
                return 'https://www.Webpage.com/embed/'+ code[1]
            }
            alert('No es un video de Webpage.')
            return ''
        }

    });
})();