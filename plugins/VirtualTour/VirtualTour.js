import React from "react";
import i18n from 'i18next';
import Map from './components/Map';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import MarkEditor from "../../_editor/components/rich_plugins/mark_editor/MarkEditor";
require('./_virtualTour.scss');
window.mapList = [];
export function VirtualTour(base) {
    return {
        init: function() {
            let src = "https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyAOOAHADllUMGULOz5FQu3rIhM0RtwxP7Q";
            $('<script>').attr('src', src).appendTo('head');
        },
        getConfig: function() {
            return {
                name: 'VirtualTour',
                displayName: Ediphy.i18n.t('VirtualTour.PluginName'),
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
                limitToOneInstance: true,
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
        getRenderTemplate: function(state) {

            let id = "map-" + Date.now();
            let marks = state.__marks;
            if (!window.google || !navigator.onLine) {
                return (<div className="dropableRichZone noInternetConnectionBox" style={{ width: '100%', height: '100%' }}>
                    <div className="middleAlign">
                        <i className="material-icons dark">signal_wifi_off</i><br/>
                        {i18n.t('messages.no_internet')}
                    </div>
                </div>);
            }

            let Mark = ({ idKey, title, color }) => (
                <MarkEditor time={1.5} mark={idKey} base={base} state={state}>
                    <OverlayTrigger key={idKey} text={title} placement="top" overlay={<Tooltip id={idKey}>{title}</Tooltip>}>
                        <a className="mapMarker" href="#">
                            <i style={{ color: color }} key="i" className="material-icons">room</i>
                        </a>
                    </OverlayTrigger>
                </MarkEditor>);

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
            return (
                <div className="virtualMap" onDragLeave={e=>{e.stopPropagation();}}>
                    <Map placeholder={i18n.t("VirtualTour.Search")}
                        state={state}
                        id={id}
                        searchBox
                        update={(lat, lng, zoom, render)=>{
                            base.setState('config', { lat: lat, lng: lng, zoom: zoom });
                        }}>
                        {markElements}
                    </Map>
                </div>);
        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },
        parseRichMarkInput: function(...value) {
            let state = value[5];
            if (!window.google || !navigator.onLine || !window.mapList[state.num]) {
                return '0,0';
            }
            let clickX = value[0] + 12;
            let clickY = value[1] + 26;
            let latCenter = state.config.lat;
            let lngCenter = state.config.lng;
            let zoom = state.config.zoom;
            let num = state.num;

            let maps = window.google.maps;
            let map = window.mapList[state.num];
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
        pointerEventsCallback: function(bool, toolbarState) {
            if (!window.google || !navigator.onLine) {return;}
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
