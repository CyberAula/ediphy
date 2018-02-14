import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import Answer from '../../core/scorm/components/editor/Answer';
import './_freeResponse.scss';

export function FreeResponse(base) {
    return {
        getConfig: function() {
            return {
                name: 'FreeResponse',
                displayName: Ediphy.i18n.t('FreeResponse.PluginName'),
                category: 'evaluation',
                icon: 'message',
                initialWidth: '60%',
                flavor: 'react',
                isComplex: true,
                defaultCorrectAnswer: true,
            };
        },
        getToolbar: function() {
            return {

            };
        },
        getInitialState: function() {
            return {

            };
        },
        getRenderTemplate: function(state, props) {

            return <div className={"exercisePlugin"} ><h1>Free Response</h1>
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="1" plugin-data-display-name={"Pregunta"} plugin-data-default="BasicText" pluginContainer={"Pregunta"} />
                        <textarea disabled className="form-control textAreaQuiz" placeholder={"Respuesta aquí"}/>
                    </div>
                </div>
            </div>;

        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },
    };
}
/* eslint-enable react/prop-types */
