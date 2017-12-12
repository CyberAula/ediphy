import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
export function ContainerReact(base) {
    return {
        getConfig: function() {
            return {
                name: 'ContainerReact',
                displayName: Ediphy.i18n.t('ContainerReact.PluginName'),
                category: 'text',
                icon: 'view_agenda',
                initialWidth: '60%',
                flavor: 'react',
            };
        },
        getToolbar: function() {
            return {};
        },
        getInitialState: function() {
            return {};
        },
        getRenderTemplate: function(state, props) {
            return <div><div className={"col-xs-12"}>Ejercicio</div>
                <div className={"col-xs-12"}><PluginPlaceholder {...props} key="1" plugin-data-display-name={"Pregunta"} plugin-data-default="BasicText" pluginContainer={"Pregunta"} /></div>
                <div className={"col-xs-2 h3"}>1</div><div className={"col-xs-10"}><PluginPlaceholder {...props} key="1" plugin-data-display-name={"Respuesta 1"} plugin-data-default="BasicText" pluginContainer={"Respuesta1"} /></div>
                <div className={"col-xs-2 h3"}>2</div><div className={"col-xs-10"}><PluginPlaceholder {...props} key="2" plugin-data-display-name={"Respuesta 2"} plugin-data-default="BasicText" pluginContainer={"Respuesta2"} /></div>

            </div>;

        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },
    };
}
