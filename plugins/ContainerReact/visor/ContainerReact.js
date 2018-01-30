import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
export function ContainerReact() {
    return {
        getRenderTemplate: function(state, id, props) {
            console.log(props);
            return <div><h1 >Ejercicio</h1>
                <div className={"row"}><div className={"col-xs-12"}><VisorPluginPlaceholder {...props} key="1" plugin-data-display-name={"Pregunta"} plugin-data-default="BasicText" pluginContainer={"Pregunta"} /></div></div>
                <div className={"row"}><div className={"col-xs-2 h3"}>1</div><div className={"col-xs-10"}><VisorPluginPlaceholder {...props} key="1" plugin-data-display-name={"Respuesta 1"} plugin-data-default="BasicText" pluginContainer={"Respuesta1"} /></div></div>
                <div className={"row"}><div className={"col-xs-2 h3"}>2</div><div className={"col-xs-10"}><VisorPluginPlaceholder {...props} key="2" plugin-data-display-name={"Respuesta 2"} plugin-data-default="BasicText" pluginContainer={"Respuesta2"} /></div></div>
            </div>;

        },
    };
}
