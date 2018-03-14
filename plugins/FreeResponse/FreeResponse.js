import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import i18n from 'i18next';
import './_freeResponse.scss';
/* eslint-disable react/prop-types */

export function FreeResponse(base) {
    return {
        getConfig: function() {
            return {
                name: 'FreeResponse',
                displayName: i18n.t('FreeResponse.PluginName'),
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

            return <div className={"exercisePlugin freeResponsePlugin"} > {/* <h1>Free Response</h1>*/}
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="1" plugin-data-display-name={i18n.t('FreeResponse.Question') } plugin-data-default="BasicText" plugin-data-text={i18n.t("FreeResponse.Statement")} pluginContainer={'Question'} />
                        <textarea disabled className="form-control textAreaQuiz" placeholder={i18n.t('FreeResponse.PlaceholderEditor')}/>
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
