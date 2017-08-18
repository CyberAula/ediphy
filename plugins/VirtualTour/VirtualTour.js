import React from "react";
import i18n from 'i18next';
import Map from './components/Map';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ClickNHold from '../../_editor/components/rich_plugins/click_n_hold/ClickNHold';
require('./_virtualTour.scss');
window.mapList = [];
export function VirtualTour(base) {
    return {
        getConfig: function() {
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
                    default: '40.452,-3.727',
                    defaultColor: '#222222',
                }],
                needsPointerEventsAllowed: true,
            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        /* __basic: {
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
                                    max: 100,
                                },
                                backgroundColor: {
                                    __name: Dali.i18n.t('VirtualTour.background_color'),
                                    type: 'color',
                                    value: '#ffffff',
                                },
                                borderWidth: {
                                    __name: Dali.i18n.t('VirtualTour.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('VirtualTour.border_style'),
                                    type: 'radio',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('VirtualTour.border_color'),
                                    type: 'color',
                                    value: '#000000',
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
                                    step: 0.01,
                                },
                            },
                        },
                    },
                },
            };
        },
        getRichMarkInput: function(state, MarkInput) {
            let div = <div><span>x,y</span><input onChange={(event) => {
                MarkInput(event.target.value);
            }} /></div>;
            return div;
        },
        getInitialState: function() {
            return {
                config: {
                    lat: 40.452,
                    lng: -3.727,
                    zoom: 11,
                },
                num: window.mapList.length,
            };
        },
        getRenderTemplate: function(state) {
            if(window.mapList[state.num]) {
                let map = window.mapList[state.num];
                let maps = window.google.maps;
                let lati = state.lat;
                let lngi = state.lng;
                // map.setCenter(new maps.LatLng(lati, lngi));
                // map.setZoom(state.zoom);
                // console.log('existing', 'map', map.center.lat(), map.center.lng(), 'state', lati, lngi);
            } else {
                // console.log('didntexist');
            }

            let id = "map-" + Date.now();
            let marks = state.__marks;

            let Mark = ({ idKey, title, color }) => (
                <ClickNHold time={1.5} mark={idKey} base={base}>
                    <OverlayTrigger key={idKey} text={title} placement="top" overlay={<Tooltip id={idKey}>{title}</Tooltip>}>
                        <a className="mapMarker" href="#">
                            <i style={{ color: color }} key="i" className="material-icons">room</i>
                        </a>
                    </OverlayTrigger>
                </ClickNHold>);

            let markElements = Object.keys(marks).map((idKey) => {
                let value = marks[idKey].value;
                let title = marks[idKey].title;
                let color = marks[idKey].color;
                let position;
                if (value && value.split(',').length === 2) {
                    position = value.split(',');
                } else {
                    position = [0, 0];
                }
                return (<Mark key={idKey} idKey={idKey} title={title} color={color} lat={position[0]} lng={position[1]}/>);

            });

            window.num = state.num;
            let num = state.num;
            // console.log(num, 'num');
            return (
                <div className="virtualMap" onDragLeave={e=>{e.stopPropagation();}}>
                    <Map placeholder={i18n.t("VirtualTour.Search")}
                        state={state}
                        id={id}
                        searchBox
                        update={(lat, lng, zoom, render)=>{
                            // console.log('%cBEGIN***************' + num + '**************************', 'color: green', 'CHANGE');
                            // console.log('PRE-UPDATE STATE', 'CHANGE', base.getState().config.lat, base.getState().config.lng, num);
                            // console.log(state.config.lat, state.config.lng);
                            // console.log('PRE-UPDATE STATE', 'CHANGE', window.mapList[num] ? (window.mapList[num].center.lat() + ' ' + window.mapList[num].center.lng()) : '');
                            base.setState('config', { lat: lat, lng: lng, zoom: zoom });
                            // if (render) base.render("UPDATE_TOOLBAR");
                            // console.log('POST-UPDATE STATE', 'CHANGE', base.getState().config.lat, base.getState().config.lng, num);
                            // console.log('POST-UPDATE STATE', 'CHANGE', window.mapList[num] ? (window.mapList[num].center.lat() + ' ' + window.mapList[num].center.lng()) : '');
                            // console.log('%cEND***************' + num + '**************************', 'color: green', 'CHANGE');

                        }}>
                        {markElements}
                    </Map>
                </div>);
        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },
        parseRichMarkInput: function(...value) {
            // base.render("UPDATE_BOX");
            // Mouse position relative to the box + offset for the bottom-center of the marker
            let state = value[5];
            let clickX = value[0] + 12;
            let clickY = value[1] + 26;
            let latCenter = state.config.lat;
            let lngCenter = state.config.lng;
            // console.log('state', state);
            let zoom = state.config.zoom;
            let num = state.num;

            let maps = google.maps;
            // console.log('HHHHHHHHHHHHHHHHHHHHH');
            // console.log(window.mapList[num].center.lat(), latCenter);
            // console.log('%cBEGIN***************' + num + '**************************', 'color: #bada55', 'MARKER PLACE');
            // console.log('PRE-UPDATE STATE', 'MARKER PLACE', base.getState().config.lat, base.getState().config.lng, num);
            // console.log('PRE-UPDATE STATE', 'MARKER PLACE', window.mapList[num] ? (window.mapList[num].center.lat() + ' ' + window.mapList[num].center.lng()) : '');
            let map = window.mapList[state.num];
            // base.setState('config',{lat: window.mapList[num].center.lat(), lng: window.mapList[num].center.lng(), zoom: window.mapList[num].getZoom()});

            // map.setCenter(new maps.LatLng(latCenter, lngCenter));
            // map.setZoom(zoom);
            // console.log('POST-UPDATE STATE', 'MARKER PLACE', base.getState().config.lat, base.getState().config.lng, num);
            // console.log('POST-UPDATE STATE', 'MARKER PLACE', window.mapList[num] ? (window.mapList[num].center.lat() + ' ' + window.mapList[num].center.lng()) : '');

            let topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
            let bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
            let scale = Math.pow(2, map.getZoom());

            let worldPoint = new maps.Point((clickX) / scale + bottomLeft.x, (clickY) / scale + topRight.y);
            let latLng = map.getProjection().fromPointToLatLng(worldPoint);
            let lat = Math.round(latLng.lat() * 100000) / 100000;
            let lng = Math.round(latLng.lng() * 100000) / 100000;
            // console.log('%cEND***************' + num + '**************************', 'color: #bada55', 'MARKER PLACE');

            return lat + ',' + lng;

        },

        validateValueInput: function(value) {
            let regex = /(^-*\d+(?:\.\d*)?),(-*\d+(?:\.\d*)?$)/g;
            let match = regex.exec(value);
            if (match && match.length === 3) {
                let x = Math.round(parseFloat(match[1]) * 100000) / 100000;
                let y = Math.round(parseFloat(match[2]) * 100000) / 100000;
                if (isNaN(x) || isNaN(y)) {
                    return { isWrong: true, message: i18n.t("VirtualTour.message_mark_xy") };
                }
                value = x + ',' + y;
            } else {
                return { isWrong: true, message: i18n.t("VirtualTour.message_mark_xy") };
            }
            return { isWrong: false, value: value };
        },
        pointerEventsCallback: function(bool, toolbarState) {
            if (window.mapList[toolbarState.num || (toolbarState.state ? toolbarState.state.num : 9999)]) {
                switch(bool) {
                case 'mouseenter':
                    window.mapList[toolbarState.num].setOptions({ draggable: false });
                    return;
                case 'mouseleave_true':
                    window.mapList[toolbarState.num].setOptions({ draggable: true, mapTypeControl: true, zoomControl: true });
                    return;
                case 'mouseleave_false':
                    window.mapList[toolbarState.num].setOptions({ draggable: false });
                    return;
                case 'disableAll':
                    window.mapList[toolbarState.state.num].setOptions({ draggable: false, mapTypeControl: false, zoomControl: false });
                    return;
                case 'enableAll':
                    window.mapList[toolbarState.state.num].setOptions({ draggable: true, mapTypeControl: true, zoomControl: true });
                    return;
                }
            }
        },

    };
}
