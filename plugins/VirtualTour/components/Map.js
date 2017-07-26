
import React from 'react';
import ReactDOM from 'react-dom';
import GoogleMapReact from 'google-map-react';
import SearchBox from './SearchBox';
import googleMapLoader from './../googleMapLoader';

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map:null
        }
        // This binding is necessary to make `this` work in the callback
        // this.onPlacesChanged = this.onPlacesChanged.bind(this);
    }
    render(){
        const {lat, lng, zoom, num} = this.props.state;
        let center = {lat: lat, lng: lng};

        console.log(this.props)
        return(
            /* jshint ignore:start */
            <div id={this.props.id} className="dropableRichZone" style={{width: '100%', height: '100%'}}>
            <GoogleMapReact
                id="jdugdfugfd"
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
                    this.props.onChange(e, num);
                }}
                onGoogleApiLoaded={({map, maps}) => {
                    console.log('onGoogleApiLoaded', map.center.lat(), map.center.lng())
                    console.log('loaded')

                    window.mapList[num] = window.mapList[num] ? window.mapList[num] : map;

                    /*
                    if (!this.state.map){
                        this.setState({map: window.mapList[num] ? window.mapList[num] : map});
                        window.mapList[num] = map;

                    }*/
                    // this.state.map = window.mapList[num] ? window.mapList[num] : map; //window.mapList[num] ? window.mapList[num] : this.state.map;
                }}
                googleMapLoader={googleMapLoader}
                resetBoundsOnResize={true}
                yesIWantToUseGoogleMapApiInternals={true}>
                {this.props.children}
            </GoogleMapReact>
            <SearchBox
                id={this.props.id}
                placeholder={this.props.placeholder}
                onPlacesChanged={(places) => {
                    this.props.onPlacesChanged(places);
                }}/></div>
            /* jshint ignore:end */

        );
    }
}