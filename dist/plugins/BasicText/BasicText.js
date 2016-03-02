var BasicText = (function(){
    return new Dali.Plugin({
        getConfig: function(){
            return {
                name: 'BasicText',
                category: 'text',
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
                    step: 0.1
                },
                {
                    name: 'fontSize',
                    humanName: 'Font Size (ems)',
                    type: 'number',
                    units: 'em',
                    value: 1,
                    min: 1,
                    max: 10
                },
                {
                    name: 'color',
                    humanName: 'Font color',
                    type: 'text',
                    value: 'black'
                },
                {
                    name: 'padding',
                    humanName: 'Padding (px)',
                    type: 'number',
                    units: 'px',
                    value: 0,
                    min: 0
                }
            ]
        },
        getInitialState: function(){
            return {text: " "};
        },
        getRenderTemplate: function(state){
            return state.text;
        }
    });
})();
