export function ContainerReact() {
    return {
        getRenderTemplate: function(state) {
            let template = '<div><plugin plugin-data-key="reactcontainer" plugin-data-resizable  /></div>';

            return template;

        },
    };
}
