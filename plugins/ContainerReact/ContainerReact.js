import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
export function ContainerReact(base) {
    return {
        getConfig: function() {
            return {
                name: 'ContainerReact',
                displayName: Ediphy.i18n.t('ContainerReact.PluginName'),
                category: 'evaluation',
                icon: 'view_agenda',
                initialWidth: '60%',
                flavor: 'react',
                isComplex: true,
            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        _general: {
                            __name: "General",
                            icon: 'web',
                            buttons: {
                                nBoxes: {
                                    __name: "Número de cajas",
                                    type: 'number',
                                    value: base.getState().nBoxes,
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
            return {
                nBoxes: 3,
            };
        },
        getRenderTemplate: function(state, props) {
            let answers = [];
            for (let i = 0; i < state.nBoxes; i++) {
                answers.push(<div key={i + 1} className={"row"}><div className={"col-xs-2 h3"}>{i + 1}</div><div className={"col-xs-10"}><PluginPlaceholder {...props} key={i + 1} plugin-data-display-name={"Respuesta " + (i + 1)} plugin-data-default="BasicText" pluginContainer={"Respuesta" + (i + 1)} /></div></div>);
            }
            return <div><h1>Ejercicio</h1>
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="1" plugin-data-display-name={"Pregunta"} plugin-data-default="BasicText" pluginContainer={"Pregunta"} />
                    </div>
                </div>
                {answers}
            </div>;

        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },
    };
}
/* eslint-enable react/prop-types */
