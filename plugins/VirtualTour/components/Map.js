
import React from 'react';
import GoogleMapReact from 'google-map-react';
import SearchBox from './SearchBox';
import { Gmaps } from 'react-gmaps';
import ReactResizeDetector from 'react-resize-detector';

const params = { v: '3.exp'/* , key: 'YOUR_API_KEY'*/ };
export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            draggable: true,
            disableDoubleClickZoom: false,
        };
        // this.onMapCreated = this.onMapCreated.bind(this);
    }

    render() {
        let { config, num } = this.props.state;
        let { lat, lng, zoom } = config;
        let center = { lat: lat, lng: lng };
        return(
            /* jshint ignore:start */
            <div id={this.props.id} className="dropableRichZone" style={{ width: '100%', height: '100%' }}>
                <GoogleMapReact center={center}
                    draggable={false}
                    zoom={zoom}
                    options={{
                        panControl: true,
                        mapTypeControl: false,
                        disableDoubleClickZoom: this.state.disableDoubleClickZoom,
                        scrollwheel: true,
                        gestureHandling: 'greedy',
                        zoomControl: false,
                        zoomControlOptions: {
                            position: google.maps.ControlPosition.RIGHT_CENTER,
                            style: google.maps.ZoomControlStyle.SMALL,
                        },
                    }}
                    onChildMouseUp={() => {this.setState({ draggable: true });}}
                    onChildMouseDown={() => {this.setState({ draggable: false });}}
                    onChildMouseEnter={() => {this.setState({ disableDoubleClickZoom: true });}}
                    onChildMouseLeave={() => {this.setState({ disableDoubleClickZoom: false });}}
                    onChange={e => {
                        this.props.update(e.center.lat, e.center.lng, e.zoom, false);

                    }}
                    onGoogleApiLoaded={({ map, maps }) => {
                        window.mapList[num] = map;
                    }}
                    resetBoundsOnResize
                    yesIWantToUseGoogleMapApiInternals>
                    {this.props.children}
                </GoogleMapReact>
                {this.props.searchBox ? <SearchBox
                    num={num}
                    center={center}
                    id={this.props.id}
                    placeholder={this.props.placeholder}
                    onPlacesChanged={(places) => {
                        /* places.lat = Math.round(places.lat * 100000) / 100000;
                    places.lng = Math.round(places.lng * 100000) / 100000;
                    let map = window.mapList[num];
                    map.setCenter(new google.maps.LatLng( places.lat, places.lng));*/
                        this.props.update(places.lat, places.lng, 15, true);

                    }}/> : null}

            </div>
            /* jshint ignore:end */

        );
    }

}
