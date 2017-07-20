import React from "react";
import GoogleMapReact from 'google-map-react';

require('./../_virtualTour.scss');

export function VirtualTour(base) {
    return {
        getRenderTemplate: function (state,id) {
            let marks = state.__marks;
            let box_id = id;
            /* jshint ignore:start */
            const Mark = ({ text }) => (<i style={{width:"100%",height:"100%"}} className="material-icons">room</i>);
            let markElements = Object.keys(marks).map((e) =>{
                let position = marks[e].value.split(',');
                return ( <Mark
                    key={e}
                    lat={position[0] /*40.452*/}
                    lng={position[1] /*-3.726848*/}
                    text={e}
                />)
            });
            let lat = state.lat && parseFloat(state.lat) ? parseFloat(state.lat):0;
            let lng = state.lng && parseFloat(state.lng) ? parseFloat(state.lng):0;
            let zoom = state.zoom && !isNaN(parseFloat(state.zoom)) ? parseFloat(state.zoom):10;
            let center = {lat: lat, lng: lng};
            return(
                <div className="virtualMap" >
                    <div style={{width:'100%', height:'100%'}}>
                        <GoogleMapReact
                            center={center}
                            zoom={zoom}
                            resetBoundsOnResize = {true}>
                            {markElements}
                        </GoogleMapReact>
                    </div>
                </div>);
            /* jshint ignore:end */
        },
        onMarkClicked(element,value){
            base.triggerMark(element,value, false);
        }
    };
}
