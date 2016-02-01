var BasicText = (function(){
    var initialState = {text: ''};
    var isUpdating = false;

    return {
        //Mandatory
        init: function () {
            Dali.API.addMenuButton(this.getConfig());
        },
        getConfig: function(){
            return {
                name: 'BasicText',
                category: 'text',
                callback: this.render.bind(this),
                needsConfigModal: false,
                needsTextEdition: true
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
                    name: 'fontSize',
                    humanName: 'Font Size (ems)',
                    type: 'number',
                    units: 'em',
                    value: 1,
                    min: 1,
                    max: 10,
                    autoManaged: true
                }
            ]
        },
        //Mandatory
        updateTextChanges: function(html){
            initialState.text = html;
            this.render();
        },
        //Mandatory
        render: function(){
            Dali.API.renderPlugin(
                "<p>" + initialState.text + "</p>",
                this.getToolbar(),
                this.getConfig(),
                initialState,
                isUpdating
            );
            isUpdating = true;
        }
    }
})();
