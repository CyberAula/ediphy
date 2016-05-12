Dali.Plugins["BasicText"] = function (base){
    return {
        getConfig: function () {
            return {
                name: 'BasicText',
                category: 'text',
                needsConfigModal: false,
                needsTextEdition: true,
                icon: 'fa-align-left'
            };
        },
        getToolbar: function () {
            return [
                {
                    name: 'opacity',
                    humanName: 'Opacity',
                    type: 'number',
                    value: 1,
                    min: 0,
                    max: 1,
                    step: 0.1,
                    tab: 'Box',
                    accordion: 'Layout'
                },
                {
                    name: 'fontSize',
                    humanName: 'Font Size (ems)',
                    type: 'number',
                    units: 'em',
                    value: 1,
                    min: 1,
                    max: 10,
                    tab: 'Font',
                    accordion: 'Size'
                },
                {
                    name: 'color',
                    humanName: 'Font color',
                    type: 'text',
                    value: 'black',
                    tab: 'Font',
                    accordion: 'Color'
                },
                {
                    name: 'padding',
                    humanName: 'Padding (px)',
                    type: 'number',
                    units: 'px',
                    value: 0,
                    min: 0,
                    tab: 'Box',
                    accordion: 'Layout'
                }
            ]
        },
        getSections: function () {
            return [
                {
                    tab: 'Main',
                    accordion: ['Basic']
                },
                {
                    tab: 'Font',
                    accordion: ['Size', 'Color']
                },
                {
                    tab: 'Box',
                    accordion: ['Layout']
                },
                {
                    tab: 'Other',
                    accordion: ['Extra']
                },

            ];
        },
        getInitialState: function () {
            return {text: "Text goes here"};
        },
        getRenderTemplate: function (state) {
            return state.text;
        }
    }
}