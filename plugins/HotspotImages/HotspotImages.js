import React from "react";
import i18n from 'i18next';
export function HotspotImages(base) {
    return {
        getConfig: function () {
            return {
                name: 'HotspotImages',
                displayName: Dali.i18n.t('HotspotImages.PluginName'),
                category: 'image',
                needsConfigModal: false,
                flavor: "react",
                needsTextEdition: false,
                icon: 'image',
                // initialWidth: '25%',
                isRich: true,
                marksType: [{name: i18n.t("HotspotImages.pos"), key: 'value', format: '[x,y]', default: '0,0'}]
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
        getRichMarkInput :function(state,MarkInput){
            /* jshint ignore:start */
            let div = <div><span>x,y</span><input onChange={(event)=>{MarkInput(event.target.value);}}></input></div>;
            return div;
            /* jshint ignore:end */
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


                return(<a key={id} style={{position: 'absolute', top: position[0] + "%",left: position[1] + "%"}} href="#"><i style={{width:"100%",height:"100%", top:'-26px',position:'absolute',left:'-12px'}} className="material-icons">room</i></a>)
            });

            return (
                <div >
                        <img className="dropableRichZone" style={{height:"100%",width:"100%"}} src={state.url}/>
                        {markElements}
                </div>
            );
            /* jshint ignore:end */
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        },
        parseRichMarkInput: function(...value){
            let x = (value[0]+12)*100/value[2];
            let y = (value [1]+26)*100/value[3];
            let finalValue = y.toFixed(2)+","+x.toFixed(2);

            return finalValue;
        },
        validateValueInput: function(value){
            let regex =  /(^-*\d+(?:\.\d*)?),(-*\d+(?:\.\d*)?$)/g ;
            let match = regex.exec(value);
            if(match && match.length === 3) {
                let x = Math.round(parseFloat(match[1]) * 100) / 100;
                let y = Math.round(parseFloat(match[2]) * 100) / 100;
                if (isNaN(x) || isNaN(y)/* || x > 100 || y > 100 || x < -100 || y < -100*/) {
                    return {isWrong: true, message: i18n.t("HotspotImages.message_mark_xy")};
                }
                value = x + ',' + y;
            } else {
                return {isWrong: true, message: i18n.t("HotspotImages.message_mark_xy")};
            }
            return {isWrong: false, value: value};
        }




    };
}
