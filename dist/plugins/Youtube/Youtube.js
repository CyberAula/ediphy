Dali.Plugins["Youtube"] = function (base){
    return {
        getConfig: function () {
            return {
                name: 'Youtube',
                category: 'multimedia',
                needsConfigModal: false,
                needsTextEdition: false,
                icon: 'fa-youtube'
            };
        },
        getToolbar: function () {
            return [
                {
                    name: 'url',
                    humanName: 'URL',
                    type: 'text',
                    tab: 'Main',
                    accordion: 'Basic',
                    autoManaged: false,
                    value: 'https://www.youtube.com/watch?v=S9M3c1_yl-E'
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
        },
        getInitialState: function () {
            return {url: 'https://www.youtube.com/watch?v=S9M3c1_yl-E', borderSize: 0, thumbnailVisibility: 'hidden'};
        },
        getConfigTemplate: function (state) {
            return "<div> Url: <input type=\"text\" autofocus id=\"BasicImage_input\" value=\"" + state.url + "\"><br><button onclick=\"$dali$.showPreview()\">Show preview</button><iframe width=\"560\" height=\"315\"id=\"BasicImage_preview\" frameborder=\"0\" allowfullscreen src=\"" + this.parseURL(state.url) + "\" style=\"width: 180px; height: auto; visibility: " + state.thumbnailVisibility + ";\"></iframe></div>";
        },
        getRenderTemplate: function (state) {
            return "<iframe width=\"560\" height=\"315\" controls frameBorder=\"0\" allowFullScreen style=\"width: 100%; height: 100%; pointer-events: none; border: solid " + state.borderSize + "px green; z-index:0;\" src=\"" + this.parseURL(state.url) + "\"></iframe>"
        },
        handleToolbar: function (name, value) {
            //if(name == 'url'){
            base.setState(name, base.parseURL(value));
            // }else{
            base.setState(name, value);
            // }

        },
        showPreview: function () {
            var vid = $('#BasicImage_preview');
            var input = $('#BasicImage_input');
            //base.setState('url', base.parseURL(input.val()));
            base.setState('thumbnailVisibility', 'visible');
            //vid.attr('src', base.parseURL(input.val()));
            vid.css('visibility', 'visible');
        },
        parseURL: function (url) {
            if (url == '') return url
            var patt1 = /youtube.com\/watch\?v=(.*)/
            var patt2 = /youtube.com\/embed\/(.*)/
            var patt3 = /youtu.be\/(.*)/
            if (patt2.exec(url)) {
                return url;
            }
            var code = patt1.exec(url)
            if (code) {
                return 'https://www.youtube.com/embed/' + code[1]
            }
            var code2 = patt3.exec(url)
            if (code2) {
                return 'https://www.youtube.com/embed/' + code2[1]
            }
            alert('No es un video de youtube.')
            return ''
        }

    }
}