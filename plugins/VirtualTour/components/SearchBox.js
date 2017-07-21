import React from 'react';
import ReactDOM from 'react-dom';

export default class SearchBox extends React.Component {
    constructor(props) {
        super(props);
               // This binding is necessary to make `this` work in the callback
        this.onPlacesChanged = this.onPlacesChanged.bind(this);
    }
    render() {
        /* jshint ignore:start */
        return (<input className="form-control searchBox" ref="input" placeholder={this.props.placeholder} type="text"/>);
        /* jshint ignore:end */
    }
    onPlacesChanged() {
        if (this.props.onPlacesChanged) {
            let places = this.searchBox.getPlaces();
            console.log(places);
            if (places && places.length > 0){
                let geom = places[0].geometry.location;
                let coords= {lat: geom.lat(), lng: geom.lng()};
                this.props.onPlacesChanged(coords);
            }
        }
    }
    componentDidMount() {
        /* jshint ignore:start */
        var input = ReactDOM.findDOMNode(this.refs.input);
        this.searchBox = new google.maps.places.SearchBox(input);
        this.searchBox.addListener('places_changed', this.onPlacesChanged);
        /* jshint ignore:end */

    }

    componentWillUnmount() {
        this.searchBox.removeListener('places_changed', this.onPlacesChanged);
    }
}