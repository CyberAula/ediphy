
import React from 'react';
import ReactDOM from 'react-dom';
import GoogleMapReact from 'google-map-react';
import SearchBox from './SearchBox';
import { Gmaps } from 'react-gmaps';
import ReactResizeDetector from 'react-resize-detector';

const params = { v: '3.exp'/* , key: 'YOUR_API_KEY'*/ };
export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            draggable: false,
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
                    draggable={false}
                    zoom={zoom}
                    options={{
                        panControl: true,
                        mapTypeControl: this.state.controls, // ReactDOM.findDOMNode(this) ? this.findParentBySelector(ReactDOM.findDOMNode(this), '.pointerEventsEnabled') : this.state.draggable,
                        disableDoubleClickZoom: this.state.disableDoubleClickZoom,
                        scrollwheel: true,
                        gestureHandling: 'greedy',
                        zoomControl: this.state.controls, // ReactDOM.findDOMNode(this) ? this.findParentBySelector(ReactDOM.findDOMNode(this), '.pointerEventsEnabled') : this.state.draggable,
                        zoomControlOptions: this.state.controls ? {
                            position: google.maps.ControlPosition.RIGHT_CENTER,
                            style: google.maps.ZoomControlStyle.SMALL,
                        } : null,
                    }}
                    // onChildMouseUp={() => {this.setState({ draggable: true });}}
                    // onChildMouseDown={() => {this.setState({ draggable: false });}}
                    onChildMouseMove={() => {let bool = this.findParentBySelector(ReactDOM.findDOMNode(this), '.pointerEventsEnabled'); this.setState({ draggable: false, disableDoubleClickZoom: true, controls: bool });}}
                    onChildMouseEnter={() => {let bool = this.findParentBySelector(ReactDOM.findDOMNode(this), '.pointerEventsEnabled'); this.setState({ draggable: false, disableDoubleClickZoom: true, controls: bool });}}
                    onChildMouseLeave={() => {let bool = this.findParentBySelector(ReactDOM.findDOMNode(this), '.pointerEventsEnabled'); this.setState({ draggable: bool, disableDoubleClickZoom: !bool, controls: bool });}}
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

        );
    }
    componentWillUpdate() {

    }

    collectionHas(a, b) { // helper function (see below)
        for (let i = 0, len = a.length; i < len; i++) {
            if (a[i] === b) {
                return true;
            }
        }
        return false;
    }

    findParentBySelector(elm, selector) {
        const all = document.querySelectorAll(selector);
        let cur = elm.parentNode;
        while (cur && !this.collectionHas(all, cur)) {// keep going up until you find a match
            cur = cur.parentNode;// go up
        }
        return cur;// will return null if not found
    }

}
