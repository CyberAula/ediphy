import React from "react";
import EnrichedPlayerPlugin from './components/EnrichedPlayerPluginEditor.js';
require('./EnrichedPlayer.scss');

export function EnrichedPlayer(base) {
    return {
        getConfig: function () {
            return {
                name: "EnrichedPlayer",
                flavor: "react",
                isRich: true,
                displayName: Dali.i18n.t("EnrichedPlayer.PluginName"),
                category: "multimedia",
                icon: "play_arrow"
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: Dali.i18n.t('EnrichedPlayer.Video'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Dali.i18n.t('EnrichedPlayer.URL'),
                                    type: 'text',
                                    value: base.getState().url,
                                    autoManaged: false
                                },
                                controls: {
                                    __name: Dali.i18n.t('EnrichedPlayer.Show_controls'),
                                    type: 'checkbox',
                                    checked: base.getState().controls,
                                    autoManaged: false
                                },
                            }
                        },
                        style: {
                            __name: Dali.i18n.t('EnrichedPlayer.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Dali.i18n.t('EnrichedPlayer.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100
                                },
                                borderWidth: {
                                    __name: Dali.i18n.t('EnrichedPlayer.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('EnrichedPlayer.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('EnrichedPlayer.border_color'),
                                    type: 'color',
                                    value: '#000000'
                                },
                                borderRadius: {
                                    __name: Dali.i18n.t('EnrichedPlayer.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50
                                },
                                opacity: {
                                    __name: Dali.i18n.t('EnrichedPlayer.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.05
                                }

                            }
                        }
                    }
                }
            };
        },
        getInitialState: function () {
            return {
                url: "https://www.youtube.com/watch?time_continue=156&v=yqCwDurUrw0",
                controls: true
            };
        },
        getRenderTemplate: function (state) {

            return (
                /* jshint ignore:start */
                <div style={{width:"100%", height:"100%"}}>
                    <EnrichedPlayerPlugin style={{width:"100%", height:"100%"}} state={state} postParseRichMarkInput={base.postParseRichMarkInput}></EnrichedPlayerPlugin>
                </div>
                /* jshint ignore:end */
            );
        },
        parseRichMarkInput: function(...value){
            let x = value[0]*100/value[2];
            return x;
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        }

    };
}
