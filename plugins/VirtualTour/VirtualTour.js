import React from "react";
import GoogleMapReact from 'google-map-react';
import i18n from 'i18next';
require('./_virtualTour.scss');

export function VirtualTour(base) {
    return {
        getConfig: function () {
            return {
                name: 'VirtualTour',
                displayName: Dali.i18n.t('VirtualTour.PluginName'),
                category: 'multimedia',
                needsConfigModal: false,
                flavor: "react",
                needsTextEdition: false,
                icon: 'map',
                initialWidth: '25%',
                initialHeight: '200px',
                initialHeightSlide: '60%',
                isRich: true,
                marksType: [{name: 'Posición', key: 'value'}],
                defaultMarkValue: '40.452,-3.727'
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        _basic: {
                            __name: Dali.i18n.t('VirtualTour.map'),
                            icon: 'link',
                            buttons: {
                                 lat: {
                                    __name: 'Center Latitude',
                                    type: 'number',
                                    step:".001",
                                    value: base.getState().lat,
                                    autoManaged: false
                                },
                                lng: {
                                    __name: 'Center Longitude',
                                    type: 'number',
                                    step:".001",
                                    value: base.getState().lng,
                                    autoManaged: false
                                },
                                zoom: {
                                    __name: 'Zoom',
                                    type: 'number',
                                    step:"any",
                                    min:0,
                                    max:100,
                                    value: base.getState().zoom,
                                    autoManaged: false
                                }
                            }
                        },
                        style: {
                            __name: Dali.i18n.t('VirtualTour.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Dali.i18n.t('VirtualTour.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100
                                },
                                backgroundColor: {
                                    __name: Dali.i18n.t('VirtualTour.background_color'),
                                    type: 'color',
                                    value: '#ffffff'
                                },
                                borderWidth: {
                                    __name: Dali.i18n.t('VirtualTour.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('VirtualTour.border_style'),
                                    type: 'radio',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('VirtualTour.border_color'),
                                    type: 'color',
                                    value: '#000000'
                                },
                                borderRadius: {
                                    __name:  Dali.i18n.t('VirtualTour.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Dali.i18n.t('VirtualTour.opacity'),
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
                lat: 40.452,
                lng: -3.727,
                zoom: 11
            };
        },
        getRenderTemplate: function (state) {
            /* jshint ignore:start */
            const Mark = ({ text }) => <i style={{width:"100%",height:"100%"}} className="material-icons">room</i>;
            let marks = state.__marks;
            let markElements = Object.keys(marks).map((id) =>{
                let value = marks[id].value;
                let position;
                if (value && value.split(',').length === 2){
                    position = value.split(',');
                } else{
                    position = [0,0];
                }

                return ( <Mark
                            key={id}
                            lat={position[0] /*40.452*/}
                            lng={position[1] /*-3.726848*/}
                            text={id}
                        />)
                // return(<a key={id} style={{position: 'absolute', top: position[0] + "%",left: position[1] + "%"}} href="#"><i style={{width:"100%",height:"100%"}} className="material-icons">room</i></a>)
            });

            let lat = state.lat && parseFloat(state.lat) ? parseFloat(state.lat):0;
            let lng = state.lng && parseFloat(state.lng) ? parseFloat(state.lng):0;
            let zoom = state.zoom && !isNaN(parseFloat(state.zoom)) ? parseFloat(state.zoom):10;
            let center = {lat: lat, lng: lng};

            return (
                <div className="virtualMap" >
                    <div className="dropableRichZone" style={{width:'100%', height:'100%'}}>
                        <GoogleMapReact
                            center={center}
                            zoom={zoom}
                            resetBoundsOnResize = {true}
                            onClick={(obj)=>{ console.log(obj.x, obj.y, obj.lat, obj.lng, obj.event);}}>
                            {markElements}
                        </GoogleMapReact>
                    </div>
                </div>
            );
            /* jshint ignore:end */
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        },
        parseRichMarkInput: function(...value){
            let x = value[0]*100/value[2];
            let y = value [1]*100/value[3];
            let finalValue = y.toFixed(2)+","+x.toFixed(2);

            return finalValue;
        },
        validateValueInput: function(value){
            let regex =  /(^-*\d+(?:\.\d*)?),(-*\d+(?:\.\d*)?$)/g ;
            let match = regex.exec(value);
            if(match && match.length === 3) {
                let x = Math.round(parseFloat(match[1]) * 100) / 100;
                let y = Math.round(parseFloat(match[2]) * 100) / 100;
                if (isNaN(x) || isNaN(y) ) {
                    return {isWrong: true, message: i18n.t("VirtualTour.message_mark_xy")};
                }
                value = x + ',' + y;
            } else {
                return {isWrong: true, message: i18n.t("VirtualTour.message_mark_xy")};
            }
            return {isWrong: false, value: value};
        }

    };
}
