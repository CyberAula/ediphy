
import React from 'react';
import ReactDOM from 'react-dom';
import GoogleMapReact from 'google-map-react';
import SearchBox from './SearchBox';
import { Gmaps } from 'react-gmaps';
import { findParentBySelector } from '../../../common/utils';

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            draggable: true,
            controls: false,
            disableDoubleClickZoom: true,
        };
        // this.onMapCreated = this.onMapCreated.bind(this);
    }

    render() {
        let { config, num } = this.props.state;
        let { lat, lng, zoom } = config;
        let center = { lat: lat, lng: lng };
        return(
            <div id={this.props.id} className="dropableRichZone" style={{ width: '100%', height: '100%' }}>
                <GoogleMapReact center={center}
                    draggable={Boolean(this.state.draggable)}
                    zoom={zoom}
                    options={{
                        draggable: this.state.draggable,
                        panControl: true,
                        disableDoubleClickZoom: this.state.disableDoubleClickZoom,
                        scrollwheel: true,
                        gestureHandling: 'greedy',
                        zoomControlOptions: this.state.controls ? {
                            position: window.google.maps.ControlPosition.RIGHT_CENTER,
                            style: window.google.maps.ZoomControlStyle.SMALL,
                        } : null,
                    }}
                    onChildMouseEnter={() => {let bool = findParentBySelector(ReactDOM.findDOMNode(this), '.pointerEventsEnabled'); this.setState({ draggable: false, disableDoubleClickZoom: true, controls: bool });}}
                    onChildMouseLeave={() => {let bool = findParentBySelector(ReactDOM.findDOMNode(this), '.pointerEventsEnabled'); this.setState({ draggable: bool, disableDoubleClickZoom: !bool, controls: bool });}}
                    onChange={e => {
                        this.props.update(e.center.lat, e.center.lng, e.zoom, false);

                    }}
                    onGoogleApiLoaded={({ map, maps }) => {
                        map.setOptions({ draggable: false, mapTypeControl: false, zoomControl: false });
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
                        this.props.update(places.lat, places.lng, 15, true);

                    }}/> : null}

            </div>

        );
    }
    componentWillUpdate() {

    }
}
