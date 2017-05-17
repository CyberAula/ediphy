import React from "react";

export function HotspotImages(base) {
    return {
        getConfig: function () {
            return {
                name: 'HotspotImages',
                displayName: 'HotspotImages',
                category: 'image',
                needsConfigModal: false,
                flavor: "react",
                needsTextEdition: false,
                icon: 'image',
                isRich: true,
                marksType: [{name: 'Valor', key: 'value'}]
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: Dali.i18n.t('HotspotImages.source'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: 'URL',
                                    type: 'vish_provider',
                                    value: base.getState().url,
                                    autoManaged: false
                                }
                            }
                        },
                        style: {
                            __name: Dali.i18n.t('HotspotImages.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Dali.i18n.t('HotspotImages.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100
                                },
                                backgroundColor: {
                                    __name: Dali.i18n.t('HotspotImages.background_color'),
                                    type: 'color',
                                    value: '#ffffff'
                                },
                                borderWidth: {
                                    __name: Dali.i18n.t('HotspotImages.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('HotspotImages.border_style'),
                                    type: 'radio',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('HotspotImages.border_color'),
                                    type: 'color',
                                    value: '#000000'
                                },
                                borderRadius: {
                                    __name:  Dali.i18n.t('HotspotImages.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Dali.i18n.t('HotspotImages.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01
                                }
                            }
                        }
                    }
                }
            };
        },
        getInitialState: function () {
            return {
                url: 'http://nemanjakovacevic.net/wp-content/uploads/2013/07/placeholder.png'
            };
        },
        getRenderTemplate: function (state) {
            /* jshint ignore:start */
            let marks = state.__marks;
            let markElements = Object.keys(marks).map((id) =>{
                let value = marks[id].value;
                let position;
                if (value && value.split(',').length === 2){
                    position = value.split(',');
                } else{
                    position = [0,0];
                }

                return(<a key={id} style={{position: 'absolute', top:position[0] +"px",left: position[1]+"px"}} href="#"><i style={{width:"100%",height:"100%"}} className="material-icons">room</i></a>)
            });

            return (
                <div >
                        <img style={{height:"100%",width:"100%"}} src={state.url}/>
                        {markElements}
                </div>
            );
            /* jshint ignore:end */
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        }
    };
}
