Dali.Plugins["Container"] = function (base){
    return {
        getConfig: function () {
            return {
                name: 'Container',
                category: 'multimedia',
                icon: 'view_agenda'
            }
        },
        getRenderTemplate: function (state) {
            return "<div><plugin plugin-data-key='Container'  /></div>";
        }
    }
}