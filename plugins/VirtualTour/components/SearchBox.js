import React from 'react';
import ReactDOM from 'react-dom';
import { FormGroup, InputGroup, Glyphicon, FormControl } from 'react-bootstrap';
export default class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.onPlacesChanged = this.onPlacesChanged.bind(this);
    }
    render() {
        /* jshint ignore:start */
        return (
            <FormGroup id={"map-" + this.props.id} className="searchBox">
                <InputGroup>
                    <FormControl type="text" ref={"input-" + this.props.id} placeholder={this.props.placeholder}/>
                    <InputGroup.Addon style={{ padding: "2px 7px" }}>
                        <i className="material-icons">search</i>
                        {/* <Glyphicon glyph="search" />*/}
                    </InputGroup.Addon>
                </InputGroup>
            </FormGroup>
        );
        /* jshint ignore:end */
    }
    onPlacesChanged() {
        if (this.props.onPlacesChanged) {
            let places = this.searchBox.getPlaces();
            if (places && places.length > 0) {
                let geom = places[0].geometry.location;
                let lat = Math.round(geom.lat() * 100000) / 100000;
                let lng = Math.round(geom.lng() * 100000) / 100000;
                let center = this.props.center;
                let num = this.props.num;
                let map = window.mapList[num];

                console.log('%cBEGIN***************' + num + '**************************', 'color: blue', 'PLACES');
                console.log('PRE-UPDATE STATE', 'PLACES', center.lat, center.lng, num);
                console.log('PRE-UPDATE STATE', 'PLACES', window.mapList[num] ? (window.mapList[num].center.lat() + ' ' + window.mapList[num].center.lng()) : '');
                /* jshint ignore:start */
                map.setCenter(new google.maps.LatLng(lat, lng));
                /* jshint ignore:end*/
                console.log('POST-UPDATE STATE', 'PLACES', center.lat, center.lng, num);
                console.log('POST-UPDATE STATE', 'PLACES', window.mapList[num] ? (window.mapList[num].center.lat() + ' ' + window.mapList[num].center.lng()) : '');
                console.log('%cEND***************' + num + '**************************', 'color: blue', 'PLACES');
                this.props.onPlacesChanged({ map: this.props.id, lat: lat, lng: lng });
            }
        }
    }
    componentDidMount() {
        /* jshint ignore:start */
        let input = ReactDOM.findDOMNode(this.refs["input-" + this.props.id]);
        this.searchBox = new google.maps.places.SearchBox(input);
        this.searchBoxListener = this.searchBox.addListener('places_changed', this.onPlacesChanged);
        /* jshint ignore:end */

    }

    componentWillUnmount() {
        /* jshint ignore:start */
        google.maps.event.removeListener(this.searchBoxListener);
        /* jshint ignore:end */
    }
}
