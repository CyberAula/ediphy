/* Broken*/
export function ContainerJS(base) {
    return {
        getConfig: function() {
            return {

                name: 'ContainerJS',
                displayName: Ediphy.i18n.t('ContainerJS.PluginName'),
                category: 'evaluation',
                icon: 'view_agenda',
            };
        },
        getToolbar: function(state) {
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
                                    value: state.boxes,
                                    min: 1,
                                    autoManaged: false,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return { boxes: 1 };
        },
        getRenderTemplate: function(state) {
            let template = "<div><h1>ContainerJS</h1>";
            for (let i = 0; i < state.boxes; i++) {
                template += "<div><plugin plugin-data-key='" + i + "' plugin-data-resizable='true' plugin-container='Contenedor" + (i + 1) + "' plugin-data-display-name='Contenedor" + (i + 1) + "' plugin-data-default='BasicText'/></div>";
            }
            template += "</div>";
            return template;
        },
    };
}
/* eslint-enable react/prop-types */
