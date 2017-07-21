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
        <FormGroup  className="searchBox">
            <InputGroup>
                <InputGroup.Addon style={{padding: "2px 7px"}}>
                    <i className="material-icons">search</i>
                    {/*<Glyphicon glyph="search" />*/}
                </InputGroup.Addon>
                <FormControl type="text" ref={"input-"+this.props.id} placeholder={this.props.placeholder}/>
            </InputGroup>
        </FormGroup>
         );
        /* jshint ignore:end */
    }
    onPlacesChanged() {
        if (this.props.onPlacesChanged) {
            let places = this.searchBox.getPlaces();
             if (places && places.length > 0){
                 let geom = places[0].geometry.location;
                 this.props.onPlacesChanged({lat: geom.lat(), lng: geom.lng()});
            }
        }
    }
    componentDidMount() {
        /* jshint ignore:start */
        var input = ReactDOM.findDOMNode(this.refs["input-"+this.props.id]);
        this.searchBox = new google.maps.places.SearchBox(input);
        this.searchBox.addListener('places_changed', this.onPlacesChanged);
        /* jshint ignore:end */

    }

    componentWillUnmount() {
        if (this.searchBox) {
            try {
                this.searchBox.removeListener('places_changed', this.onPlacesChanged);
            } catch(e){

            }
        }
    }
}