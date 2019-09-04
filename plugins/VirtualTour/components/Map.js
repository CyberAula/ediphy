import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import GoogleMapReact from 'google-map-react';

import SearchBox from './SearchBox';
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
            <div id={this.props.id} key={"map-" + this.props.id} className="dropableRichZone" style={{ width: '100%', height: '100%', minHeight: 50, minWidth: 50 }}>
                <GoogleMapReact center={center}
                    draggable={ !!(this.state.draggable) } key={'map_' + this.props.id}
                    zoom={zoom}
                    options={{
                        draggable: (this.state.draggable),
                        panControl: true,
                        disableDoubleClickZoom: this.state.disableDoubleClickZoom,
                        scrollwheel: true,
                        fullscreenControl: false,
                        gestureHandling: 'greedy',
                        zoomControlOptions: this.state.controls ? {
                            position: window.google.maps.ControlPosition.RIGHT_CENTER,
                            style: window.google.maps.ZoomControlStyle.SMALL,
                        } : null,
                    }}
                    onChildMouseEnter={() => {let bool = findParentBySelector(ReactDOM.findDOMNode(this), '.pointerEventsEnabled'); this.setState({ draggable: bool, disableDoubleClickZoom: true, controls: bool });}}
                    onChildMouseLeave={() => {let bool = findParentBySelector(ReactDOM.findDOMNode(this), '.pointerEventsEnabled'); this.setState({ draggable: bool, disableDoubleClickZoom: !bool, controls: bool });}}
                    onChange={e => {
                        this.props.update(e.center.lat, e.center.lng, e.zoom, false);

                    }}
                    onGoogleApiLoaded={({ map }) => {
                        map.setOptions({ draggable: this ? findParentBySelector(ReactDOM.findDOMNode(this), '.wholebox') : true, mapTypeControl: false, zoomControl: false });
                        window.mapList[this.props.id] = map;
                    }}
                    resetBoundsOnResize
                    yesIWantToUseGoogleMapApiInternals>
                    {this.props.children}
                </GoogleMapReact>
                {this.props.searchBox ? <SearchBox
                    num={num}
                    id={this.props.id}
                    placeholder={this.props.placeholder} /> : null}

            </div>

        );
    }
}
Map.propTypes = {
    /**
   * Placeholder text for the search box
   */
    placeholder: PropTypes.string,
    /**
   * Plugin state
   */
    state: PropTypes.object.isRequired,
    /**
   * Box id
   */
    id: PropTypes.string,
    /**
   * Whether or not it has a search box
   */
    searchBox: PropTypes.bool,
    /**
   * Update callback
   */
    update: PropTypes.func.isRequired,
    /**
     * Marks
     */
    children: PropTypes.any,
};
