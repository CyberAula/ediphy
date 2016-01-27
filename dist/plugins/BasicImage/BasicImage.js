var BasicImage = (function(){
    var initialState = {url: ''};

    return {
        init: function () {
            Dali.API.addMenuButton(this.getConfig());
        },
        getConfig: function(){
            return {
                name: 'BasicImage',
                category: 'image',
                callback: this.openConfigModal,
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
                    callback: this.changeBorderSize
                }
            ]
        },
        openConfigModal: function(state){
            if(!state){
                state = initialState;
            }
            Dali.API.openConfig('BasicImage', true).then(function (div) {
                div.innerHTML = "<div> Url: <input type=\"text\" id=\"BasicImage_input\" value=\"" + state.url +"\"><br><button onclick=\"BasicImage.showPreview()\">Show preview</button><img id=\"BasicImage_preview\" src=\"\" style=\"width: 100px; height: 100px; visibility: hidden;\" onclick=\"imageClick()\" /></div>";
            });
        },
        render: function(firstTime){
            Dali.API.renderPlugin(firstTime, "<img style=\"width: 100%; height: 100%; border: solid 0px green\" src=\"" + $('#BasicImage_preview').attr('src') + "\"/>",
                this.getToolbar(), this.getConfig(), initialState
            );
        },
        showPreview: function(){
            var img = $('#BasicImage_preview');
            var input = $('#BasicImage_input');
            initialState.url = input.val();
            img.attr('src', input.val());
            img.css('visibility', 'visible');
        },
        changeBorderSize: function(newValue){
            Dali.API.renderPlugin(false, "<img style=\"width: 100%; height: 100%; border: solid " + newValue + "px green\" src=\"\"/>");
        }
    }
})();

function imageClick() {
    alert("Miau!");
}