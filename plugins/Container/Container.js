export function Container(base) {
    return {
        getConfig: function () {
            return {
                name: 'Container',
                displayName: Dali.i18n.t('Container.PluginName'),
                category: 'multimedia',
                icon: 'view_agenda'
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        _general: {
                            __name: "General",
                            icon: 'web',
                            buttons: {
                                boxes: {
                                    __name: "Número de cajas",
                                    type: 'number',
                                    value: base.getState().boxes,
                                    min: 1,
                                    autoManaged: false
                                }
                            }
                        }
                    }
                }
            };
        },
        getInitialState: function(){
            return {boxes: 1};
        },
        getRenderTemplate: function (state) {
            let template = "<div>";
            for (let i = 0; i < state.boxes; i++) {
                template += "<div><plugin plugin-data-key='" + i + "' /></div>";
            }
            template += "</div>";

            return template;
        },
        handleToolbar: function(name, value){
            base.setState(name, value);
        }
    };
}
