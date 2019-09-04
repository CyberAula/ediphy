import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { FormGroup, InputGroup, FormControl } from 'react-bootstrap';
export default class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.onPlacesChanged = this.onPlacesChanged.bind(this);
    }
    render() {
        return (
            <FormGroup id={"map-" + this.props.id} className="searchBox">
                <InputGroup>
                    <FormControl type="text" ref={"input-" + this.props.id} placeholder={this.props.placeholder}/>
                    <InputGroup.Addon style={{ padding: "0.2em 0.5em " }}>
                        <i className="material-icons">search</i>
                    </InputGroup.Addon>
                </InputGroup>
            </FormGroup>
        );
    }
    onPlacesChanged() {
        if (this.props.onPlacesChanged) {
            let places = this.searchBox.getPlaces();
            if (places && places.length > 0) {
                let geom = places[0].geometry.location;
                let lat = Math.round(geom.lat() * 100000) / 100000;
                let lng = Math.round(geom.lng() * 100000) / 100000;
                let map = window.mapList[this.props.id];
                map.fitBounds(places[0].geometry.viewport);
                map.setCenter(new google.maps.LatLng(lat, lng));
                this.props.onPlacesChanged({ map: this.props.id, lat: lat, lng: lng });
            }
        }
    }
    componentDidMount() {
        if(!window.google || !navigator.onLine) {
            return;
        }
        let input = ReactDOM.findDOMNode(this.refs["input-" + this.props.id]);
        this.searchBox = new google.maps.places.SearchBox(input);
        this.searchBoxListener = this.searchBox.addListener('places_changed', this.onPlacesChanged);

    }

    componentWillUnmount() {
        window.google.maps.event.removeListener(this.searchBoxListener);
    }
}

SearchBox.propTypes = {
    /**
   * ID of the box
   */
    id: PropTypes.string.isRequired,
    /**
   * Placeholder text of the search box
   */
    placeholder: PropTypes.string,
    /**
   * New place selected callback
   */
    onPlacesChanged: PropTypes.func.isRequired,
    /**
   * Number of map created
   */
};
