export function Container(base) {
    return {
        getConfig: function () {
            return {
                name: 'Container',
                category: 'multimedia',
                icon: 'view_agenda'
            };
        },
        getLocales: function(){
            return {
                en : {
                    "Container" : {
                        "name" : "Container",
                    }
                },
                es : {
                      "Container" : {
                        "name" : "Contenedor",
                    }
                }
            };
        },
        getRenderTemplate: function (state) {
            return "<div><plugin plugin-data-key='Container'  /></div>";
        }
    };
}
