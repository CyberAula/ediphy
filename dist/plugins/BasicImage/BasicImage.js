var BasicImage = (function(){
    return {
        init: function () {
            Dali.API.addMenuButton({
                name: 'BasicImage',
                category: 'image',
                callback: this.launch,
                needsConfig: true,
                needsToolbar: true
            });
        },
        launch: function(){
            Dali.API.openConfig('BasicImage').then(function (div) {
                $(div).load('plugins/BasicImage/BasicImage.html');
            });
        },
        render: function(){
            Dali.API.renderPlugin("<img style=\"width: 100%; height: 100%\" src=\"" + $('#BasicImage_preview').attr('src') + "\"/>",
                [
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
                        name: 'opacity',
                        humanName: 'Opacity2',
                        type: 'number',
                        value: 1,
                        min: 0,
                        max: 1,
                        step: 0.1,
                        autoManaged: false,
                        callback: changeOpacity
                    }
                ]
            );
        }
    }
})();

function changeOpacity(newValue){
    console.log(newValue);
}

function imageClick() {
    alert("Miau!");
}

function showPreview(){
    var img = $('#BasicImage_preview');
    var input = $('#BasicImage_input');
    img.attr('src', input.val());
    img.css('visibility', 'visible');
}