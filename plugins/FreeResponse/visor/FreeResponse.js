import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import './../_freeResponse.scss';
/* eslint-disable react/prop-types */

export function FreeResponse() {
    return {
        getRenderTemplate: function(state, id, props) {
            return <div className={"exercisePlugin"} ><h1>Free Response</h1>
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Pregunta"}/>
                        <textarea autoCapitalize autoGrow spellCheck placeholder={"Respuesta aquí"} className="form-control textAreaQuiz textAreaQuizVisor"/>
                    </div>
                </div>
            </div>;
        },
    };
}
/* eslint-enable react/prop-types */
