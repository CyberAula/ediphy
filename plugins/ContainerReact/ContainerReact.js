import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
export function ContainerReact(base) {
    return {
        getConfig: function() {
            return {
                name: 'ContainerReact',
                displayName: Dali.i18n.t('ContainerReact.PluginName'),
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
            console.log(props);
            // return '<div><plugin plugin-data-key="reactcontainer" plugin-data-display-name="' + Dali.i18n.t('ContainerReact.content_box_name') + '" plugin-data-resizable plugin-data-default="BasicText" /></div>';
            return <PluginPlaceholder {...props} plugin-data-id={"ee"} />;
        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },
    };
}
