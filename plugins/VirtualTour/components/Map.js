
import React from 'react';
import ReactDOM from 'react-dom';
import GoogleMapReact from 'google-map-react';
import SearchBox from './SearchBox';
import googleMapLoader from './../googleMapLoader';

export default class Map extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {lat, lng, zoom, num} = this.props.state;
        let center = {lat: lat, lng: lng};
        return(
            /* jshint ignore:start */
            <div id={this.props.id} className="dropableRichZone" style={{width: '100%', height: '100%'}}>
            <GoogleMapReact
                center={center}
                zoom={zoom}
                options={{
                    panControl: true,
                    mapTypeControl: true,
                    scrollwheel: true,
                    gestureHandling: 'greedy',
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_CENTER,
                        style: google.maps.ZoomControlStyle.SMALL
                    }
                }}
                onChange={e => {
                    this.props.update(e.center.lat, e.center.lng, e.zoom, false)

                }}
                onGoogleApiLoaded={({map, maps}) => {
                    window.mapList[num] = /*window.mapList[num] ? window.mapList[num] : */map;
                }}
                googleMapLoader={googleMapLoader}
                resetBoundsOnResize={true}
                yesIWantToUseGoogleMapApiInternals={true}>
                    {this.props.children}
            </GoogleMapReact>
            <SearchBox
                num={num}
                id={this.props.id}
                placeholder={this.props.placeholder}
                onPlacesChanged={(places) => {
                    places.lat = Math.round(places.lat * 100000) / 100000;
                    places.lng = Math.round(places.lng * 100000) / 100000;
                    this.props.update(places.lat, places.lng ,15, true)

                }}/>
            </div>
            /* jshint ignore:end */

        );
    }

}