import React, { Component, PropTypes } from 'react';
import { withMediaProps } from 'react-media-player';
import Transition from 'react-motion-ui-pack';

class ScaleX extends Component {

    render() {
        return (
            /* jshint ignore:start */
            <Transition
                component="g"
                enter={{ scaleX: 1 }}
                leave={{ scaleX: 0 }}
            >
                {this.props.children}
            </Transition>
            /* jshint ignore:end */
        );
    }
}

class PlayPause extends Component {
    /* jshint ignore:start */
    _handlePlayPause = () => {
        this.props.media.playPause();
    }
    /* jshint ignore:end */
    render() {
        const { media: { isPlaying }, className } = this.props;
        return (
            /* jshint ignore:start */
            <svg
                role="button"
                width="36px"
                height="36px"
                viewBox="0 0 36 36"
                className={className}
                onClick={this._handlePlayPause}
            >
                <circle fill="#373D3F" cx="18" cy="18" r="18"/>
                <ScaleX>
                    { isPlaying &&
                    <g key="pause" style={{ transformOrigin: '0% 50%' }}>
                        <rect x="12" y="11" fill="#CDD7DB" width="4" height="14"/>
                        <rect x="20" y="11" fill="#CDD7DB" width="4" height="14"/>
                    </g>
                    }
                </ScaleX>
                <ScaleX>
                    { !isPlaying &&
                    <polygon
                        key="play"
                        fill="#CDD7DB"
                        points="14,11 26,18 14,25"
                        style={{ transformOrigin: '100% 50%' }}
                    />
                    }
                </ScaleX>
            </svg>
            /* jshint ignore:end */
        );
    }
    /* jshint ignore:end */
}

export default withMediaProps(PlayPause);
