var BasicImage = (function(){
    var initialState = {url: '', borderSize: 0};
    var isUpdating = true;

    return {
        //Mandatory
        init: function () {
            Dali.API.addMenuButton(this.getConfig());
        },
        getConfig: function(){
            return {
                name: 'BasicImage',
                category: 'image',
                callback: this.openConfigModal.bind(this),
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
                    step: 0.1,
                    autoManaged: true
                },
                {
                    name: 'borderSize',
                    humanName: 'Border Size',
                    type: 'number',
                    value: 0,
                    min: 0,
                    max: 10,
                    autoManaged: false,
                    callback: this.changeBorderSize.bind(this)
                },
                {
                    name: 'test',
                    humanName: 'Test',
                    type: 'text',
                    autoManaged: true,
                    isAttribute: true
                }
            ]
        },
        //Mandatory
        openConfigModal: function(state){
            if(!state){
                state = initialState;
                isUpdating = false;
            }
            Dali.API.openConfig('BasicImage').then(function (div) {
                div.innerHTML = "<div> Url: <input type=\"text\" id=\"BasicImage_input\" value=\"" + state.url +"\"><br><button onclick=\"BasicImage.showPreview()\">Show preview</button><img id=\"BasicImage_preview\" src=\"\" style=\"width: 100px; height: 100px; visibility: hidden;\" onclick=\"BasicImage.imageClick()\" /></div>";
            });
        },
        //Mandatory
        render: function(){
            Dali.API.renderPlugin(
                "<img style=\"width: 100%; height: 100%; border: solid " + initialState.borderSize + "px green\" src=\"" + initialState.url + "\"/>",
                this.getToolbar(),
                this.getConfig(),
                initialState,
                isUpdating
            );
            isUpdating = true;
        },
        showPreview: function(){
            var img = $('#BasicImage_preview');
            var input = $('#BasicImage_input');
            initialState.url = input.val();
            img.attr('src', input.val());
            img.css('visibility', 'visible');
        },
        //Mandatory format
        changeBorderSize: function(newValue){
            initialState.borderSize = newValue;
            this.render();
        },
        imageClick: function() {
            alert("Miau!");
        }
    }
})();