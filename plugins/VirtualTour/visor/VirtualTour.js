import React from "react";
import GoogleMapReact from 'google-map-react';
import Mark from '../../../common/components/mark/Mark';
import i18n from 'i18next';
import { MiddleAlign, NoInternetBox } from "../Styles";
import { MapPlugin } from "VirtualTour/Styles";

window.mapsVisor = [];
/* eslint-disable react/prop-types */

export function VirtualTour() {
    return {
        init: function() {
            if (!window.google) {
                let src = "https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyAOOAHADllUMGULOz5FQu3rIhM0RtwxP7Q";
                $('<script>').attr('src', src).appendTo('head');
            }
        },
        getRenderTemplate: function(state, props) {
            if (!window.google || !window.navigator.onLine) {
                return (<NoInternetBox>
                    <MiddleAlign>
                        <i className="material-icons" style={{ color: '#555555' }}>signal_wifi_off</i><br/>
                        {i18n.t('messages.no_internet')}
                    </MiddleAlign>
                </NoInternetBox>);
            }

            let marks = props.marks || {};
            let boxId = props.id;

            let markElements = Object.keys(marks).map((e) =>{
                let position = marks[e].value.split(',');
                let title = marks[e].title;
                let color = marks[e].color;
                let isPopUp = marks[e].connectMode === "popup";
                let isVisor = true;
                return(
                    <Mark key={e} lat={position[0]} lng={position[1]} color={color}
                        idKey={e}
                        title={title}
                        isPopUp={isPopUp}
                        isVisor={isVisor}
                        markConnection={marks[e].connection}
                        markValue={marks[e].value}
                        boxID={boxId}
                        onMarkClicked={props.onMarkClicked}/>
                );
            });
            let lat = state.config.lat && parseFloat(state.config.lat) ? parseFloat(state.config.lat) : 0;
            let lng = state.config.lng && parseFloat(state.config.lng) ? parseFloat(state.config.lng) : 0;
            let zoom = state.config.zoom && !isNaN(parseFloat(state.config.zoom)) ? parseFloat(state.config.zoom) : 10;
            let center = { lat: lat, lng: lng };
            return(
                <MapPlugin className="virtualMap" >
                    <div style={{ width: '100%', height: '100%' }}>
                        <GoogleMapReact
                            center={center}
                            zoom={zoom}
                            options={{
                                panControl: true,
                                mapTypeControl: true,
                                scrollwheel: true,
                                fullscreenControl: false,
                                gestureHandling: 'greedy',
                            }}
                            onGoogleApiLoaded={({ map }) => {
                                window.mapsVisor[state.num] = map;
                            }}
                            resetBoundsOnResize
                            yesIWantToUseGoogleMapApiInternals>
                            {markElements}
                        </GoogleMapReact>
                    </div>
                </MapPlugin>);
        },

    };
}
/* eslint-enable react/prop-types */
