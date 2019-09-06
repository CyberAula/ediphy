import React from "react";
import i18n from 'i18next';
import Map from './components/Map';
import MarkEditor from "../../_editor/components/richPlugins/markEditor/MarkEditor";
import Mark from '../../common/components/mark/Mark';
require('./_virtualTour.scss');
window.mapList = [];
/* eslint-disable react/prop-types */

export function VirtualTour(base) {
    return {
        init: function() {
            /*
            console.log('init',window.google)
            if (!window.google) {
                let src = "https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyAOOAHADllUMGULOz5FQu3rIhM0RtwxP7Q";
                $('<script>').attr('src', src).appendTo('head');
            }*/
        },
        getConfig: function() {
            return {
                name: 'VirtualTour',
                displayName: Ediphy.i18n.t('VirtualTour.PluginName'),
                category: 'objects',
                needsConfigModal: false,
                flavor: "react",
                needsTextEdition: false,
                icon: 'map',
                initialWidth: '25%',
                initialWidthSlide: '45%',
                initialHeight: '250px',
                initialHeightSlide: '60%',
                isRich: true,
                marksType: {
                    name: i18n.t('VirtualTour.Coords'),
                    key: 'value',
                    format: '[Lat,Lng]',
                    default: '40.452,-3.727',
                    defaultColor: '#000002',
                },
                needsPointerEventsAllowed: true,
                // limitToOneInstance: true,
            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        style: {
                            __name: Ediphy.i18n.t('VirtualTour.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('VirtualTour.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
                                backgroundColor: {
                                    __name: Ediphy.i18n.t('VirtualTour.background_color'),
                                    type: 'color',
                                    value: '#ffffff',
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('VirtualTour.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('VirtualTour.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('VirtualTour.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('VirtualTour.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('VirtualTour.opacity'),
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
        getRenderTemplate: function(state, props) {
            if (!window.google) {
                let src = "https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyAOOAHADllUMGULOz5FQu3rIhM0RtwxP7Q";
                $('<script>').attr('src', src).appendTo('head');
            }
            let id = props.id;
            let marks = props.marks || {};
            if (!window.google || !window.navigator.onLine) {
                return (<div className="dropableRichZone noInternetConnectionBox" style={{ width: '100%', height: '100%', minHeight: '50px' }}>
                    <div className="middleAlign">
                        <i className="material-icons dark">signal_wifi_off</i><br/>
                        {i18n.t('messages.no_internet')}
                    </div>
                </div>);
            }
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
                return (
                    <MarkEditor key={idKey} time={1.5} boxId={id} mark={idKey} base={base} onRichMarkMoved={props.onRichMarkMoved} state={state} lat={position[0]} lng={position[1]}>
                        <Mark idBox={props.id} idKey={idKey} title={title} color={color} />
                    </MarkEditor>);

            });

            return (
                <div className="virtualMap" onDragLeave={e=>{e.stopPropagation();}}>
                    <Map placeholder={i18n.t("VirtualTour.Search")}
                        state={state}
                        id={id}
                        searchBox
                        update={(lat, lng, zoom)=>{
                            if (state.config.lat.toPrecision(4) !== lat.toPrecision(4) || state.config.lng.toPrecision(4) !== lng.toPrecision(4) || state.config.zoom.toPrecision(4) !== zoom) {
                                props.update('config', { lat, lng, zoom });
                            }
                        }}>
                        {markElements}
                    </Map>
                </div>);
        },
        getDefaultMarkValue(state) {
            let cfg = state.config;
            return Math.round(cfg.lat * 100000) / 100000 + ',' + Math.round(cfg.lng * 100000) / 100000;
        },
        parseRichMarkInput: function(x, y, width, height, toolbarState, boxId) {
            let state = toolbarState;
            if (!window.google || !window.navigator.onLine || !window.mapList[boxId || state.num]) {
                return '0,0';
            }
            let clickX = x + 12;
            let clickY = y + 26;

            let maps = window.google.maps;
            let map = window.mapList[boxId || state.num];
            let topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
            let bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
            let scale = Math.pow(2, map.getZoom());

            let worldPoint = new maps.Point((clickX) / scale + bottomLeft.x, (clickY) / scale + topRight.y);
            let latLng = map.getProjection().fromPointToLatLng(worldPoint);
            let lat = Math.round(latLng.lat() * 100000) / 100000;
            let lng = Math.round(latLng.lng() * 100000) / 100000;

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
        pointerEventsCallback: function() {
            return;
        },

    };
}
/* eslint-enable react/prop-types */
