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
        getRenderTemplate: function (state) {
            return "<div><plugin plugin-data-key='Container'  /></div>";
        }
    };
}
