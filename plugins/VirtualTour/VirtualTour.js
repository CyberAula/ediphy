import React from "react";
import i18n from 'i18next';
import Map from './components/Map';
require('./_virtualTour.scss');
var map,maps;
window.mapKeys={};
window.mapList = [];
window.mapsList = [];
export function VirtualTour(base) {
    return {
        init: function (A,B,C) {
            console.log('INIT')
        },
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
                initialHeight: '250px',
                initialHeightSlide: '60%',
                isRich: true,
                marksType: [{
                    name: i18n.t('VirtualTour.Coords'),
                    key: 'value',
                    format: '[Lat,Lng]',
                    default: '40.452,-3.727'
                }],
                needsPointerEventsAllowed: true
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        /*__basic: {
                         __name: Dali.i18n.t('VirtualTour.map'),
                         icon: 'zoom_out_map',
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
                         },*/
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
                                    __name: Dali.i18n.t('VirtualTour.radius'),
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
        getRichMarkInput: function (state, MarkInput) {
            /* jshint ignore:start */
            let div = <div><span>x,y</span><input onChange={(event) => {
                MarkInput(event.target.value);
            }}></input></div>;
            return div;
            /* jshint ignore:end */
        },
        getInitialState: function () {
            return {
                lat: 40.452,
                lng: -3.727,
                zoom: 11,
                num: window.mapList.length
            };
        },
        getRenderTemplate: function (state) {
            /* jshint ignore:start */
            if(window.mapList[state.num] /*&& window.mapsList[state.num]*/){
                let map = window.mapList[state.num];
                let maps = window.google.maps; //window.mapsList[state.num];
                let lati = state.lat;
                let lngi = state.lng;
                map.setCenter(new maps.LatLng(lati, lngi));
                map.setZoom(state.zoom);
                console.log('existing', map.center.lat(), map.center.lng());
            } else {
                console.log('didntexist');
            }

            let id = "map-" + Date.now();
            const Mark = ({text}) => (
                <a style={{position: 'absolute'}}
                   href="#">
                    <i style={{width: "100%", height: "100%", position: 'absolute', top: '-26px', left: '-12px'}}
                       className="material-icons">room</i>
                </a>);
            let marks = state.__marks;
            let markElements = Object.keys(marks).map((id) => {
                let value = marks[id].value;
                let position;
                if (value && value.split(',').length === 2) {
                    position = value.split(',');
                } else {
                    position = [0, 0];
                }
                return (<Mark key={id} text={id} lat={position[0]} lng={position[1]}/>);
            });


            window.num = state.num;
            return (
                <div className="virtualMap" onClick={e=>{e.stopPropagation()}} onDragLeave={e=>{e.stopPropagation()}}>
                        <Map placeholder={i18n.t("VirtualTour.Search")}
                             setState={(key,value)=>{base.setState(key,value)}}
                             state={state}
                             id={id}
                             onChange={(e,num) => {
                                 console.log('onChange', num, e)
                                 let lat = e.center.lat;
                                 let lng = e.center.lng;
                                 let zoom = e.zoom;
                                 base.setState('lat', lat);
                                 base.setState('lng', lng);
                                 base.setState('zoom', zoom);
                                 let map = window.mapList[num];
                                 if (map) {
                                     map.setCenter(new google.maps.LatLng(lat, lng));
                                     map.setZoom(zoom);
                                 }
                                // base.render("UPDATE_TOOLBAR");
                             }}
                             onPlacesChanged={(places) => {
                                 console.log('onplaceschanged', id, places.map)
                                 let lat = Math.round(places.lat * 100000) / 100000;
                                 let lng = Math.round(places.lng * 100000) / 100000;
                                 let zoom = 15;
                                 base.setState("lat", lat);
                                 base.setState("lng", lng);
                                 base.setState("zoom", zoom);
                                 let map = window.mapList[num];
                                 if (map) {
                                     map.setCenter(new google.maps.LatLng(lat, lng));
                                     map.setZoom(zoom);
                                 }
                                 // base.render("UPDATE_TOOLBAR");
                             }}>
                            {markElements}
                        </Map>
                </div>);
            /* jshint ignore:end */
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        },
        parseRichMarkInput: function (...value) {

            // Mouse position relative to the box + offset for the bottom-center of the marker
            let clickX = value[0] + 12;
            let clickY = value[1] + 26;
            let latCenter = base.getState().lat;
            let lngCenter = base.getState().lng;
            console.log(base.getState());
            let zoom = base.getState().zoom;

            let maps = /*window.mapsList[base.getState().num] ||*/ google.maps;
            let map = window.mapList[base.getState().num];
            map.setCenter(new maps.LatLng(latCenter, lngCenter));
            map.setZoom(zoom);
            console.log(map, map === window.mapList[base.getState().num])
            let topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
            let bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
            let scale = Math.pow(2, map.getZoom());
            let worldPoint = new maps.Point((clickX) / scale + bottomLeft.x, (clickY) / scale + topRight.y);
            let latLng = map.getProjection().fromPointToLatLng(worldPoint);
            let lat = Math.round(latLng.lat() * 100000) / 100000;
            let lng = Math.round(latLng.lng() * 100000) / 100000;

            return lat + ',' + lng;
        },

        validateValueInput: function (value) {
            let regex = /(^-*\d+(?:\.\d*)?),(-*\d+(?:\.\d*)?$)/g;
            let match = regex.exec(value);
            if (match && match.length === 3) {
                let x = Math.round(parseFloat(match[1]) * 100000) / 100000;
                let y = Math.round(parseFloat(match[2]) * 100000) / 100000;
                if (isNaN(x) || isNaN(y)) {
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