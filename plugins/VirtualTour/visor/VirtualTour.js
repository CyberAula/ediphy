import React from "react";
import GoogleMapReact from 'google-map-react';

require('./../_virtualTour.scss');
window.mapsVisor = [];
export function VirtualTour(base) {
    return {
        getRenderTemplate: function (state,id) {
            let marks = state.__marks;
            let box_id = id;
            /* jshint ignore:start */
            let markElements = Object.keys(marks).map((e) =>{
                let Mark = ({ text }) => (<a style={{position: 'absolute'}}
                                             onClick={()=>{this.onMarkClicked(box_id, marks[e].value)}}
                                             href="#">
                                                <i style={{width:"100%",height:"100%", cursor: 'pointer', position: 'absolute', top:'-26px', left:'-12px'}}  className="material-icons">room</i>
                </a>);
                let position = marks[e].value.split(',');
                return (<Mark key={e} text={e} lat={position[0]} lng={position[1]}/>);

            });
            let lat = state.config.lat && parseFloat(state.config.lat) ? parseFloat(state.config.lat):0;
            let lng = state.config.lng && parseFloat(state.config.lng) ? parseFloat(state.config.lng):0;
            let zoom = state.config.zoom && !isNaN(parseFloat(state.config.zoom)) ? parseFloat(state.config.zoom):10;
            let center = {lat: lat, lng: lng};
            return(
                <div className="virtualMap" >
                    <div style={{width:'100%', height:'100%'}}>
                        <GoogleMapReact
                            center={center}
                            zoom={zoom}
                            options={{
                                panControl: true,
                                mapTypeControl: true,
                                scrollwheel: true,
                                gestureHandling: 'greedy'
                            }}
                            onGoogleApiLoaded={({map, maps}) => {
                                window.mapsVisor[state.num] = map;
                            }}
                            resetBoundsOnResize={true}
                            yesIWantToUseGoogleMapApiInternals={true}>
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
