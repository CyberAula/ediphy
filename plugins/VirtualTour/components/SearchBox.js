import React from 'react';
import ReactDOM from 'react-dom';
import {FormGroup, InputGroup, Glyphicon, FormControl} from 'react-bootstrap';
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
                <FormControl type="text" ref={"input-" + this.props.id}  placeholder={this.props.placeholder}/>
                <InputGroup.Addon style={{padding: "2px 7px"}}>
                    <i className="material-icons">search</i>
                    {/*<Glyphicon glyph="search" />*/}
                </InputGroup.Addon>
            </InputGroup>
        </FormGroup>
         );
        /* jshint ignore:end */
    }
    onPlacesChanged() {
        if (this.props.onPlacesChanged) {
            console.log(this.searchBox)
            let places = this.searchBox.getPlaces();
            console.log(places)
             if (places && places.length > 0){
                 let geom = places[0].geometry.location;
                 this.props.onPlacesChanged({map: this.props.id, lat: geom.lat(), lng: geom.lng()});
            }
        }
    }
    componentDidMount() {
        /* jshint ignore:start */
        console.log(this.props.id, 'searchboxid')
        var input = ReactDOM.findDOMNode(this.refs["input-"+this.props.id]);
        this.searchBox = new google.maps.places.SearchBox(input);
        this.searchBoxListener = this.searchBox.addListener('places_changed', this.onPlacesChanged);
        console.log(this.searchBox)
        // this.searchBox.addListener('places_changed', this.onPlacesChanged);
        /* jshint ignore:end */

    }

    componentWillUnmount() {
        google.maps.event.removeListener(this.searchBoxListener);

        if (this.searchBoxListener) {
            try {
                // this.props.maps.event.removeListener(this.searchBoxListener);
                // this.searchBox.removeListener('places_changed', this.onPlacesChanged);
            } catch(e){
                console.error(e)
            }
        }
    }
}