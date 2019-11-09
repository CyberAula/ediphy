import PropTypes from 'prop-types';
import React, { Component } from 'react';

import CarouselButtons from '../carouselButtons/CarouselButtons';
import CarouselHeader from '../carouselHeader/CarouselHeader';
import FileTree from "../FileTree";

import { connect } from "react-redux";
import ErrorBoundary from "../../../containers/ErrorBoundary";

/**
 * Index wrapper container
 */
class EditorCarousel extends Component

{
    /**
     * Renders React Component
     * @returns {code}
     */
    render() {
        const { carouselFull, carouselShow } = this.props;
        return (
            <div id="colLeft" className="wrapperCarousel"
                style={{
                    maxWidth: carouselShow ? (carouselFull ? '100%' : '212px') : '80px',
                    overflowX: carouselFull ? 'hidden' : '',
                }}>
                <ErrorBoundary context={'carousel'}>
                    <CarouselHeader/>
                    <FileTree/>
                    <CarouselButtons/>
                </ErrorBoundary>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { carouselShow, carouselFull } = state.reactUI;
    return { carouselShow, carouselFull };
}

export default connect(mapStateToProps)(EditorCarousel);

EditorCarousel.propTypes = {
    /**
     * Indicates whether the index has been expanded or not
     */
    carouselShow: PropTypes.bool,
    /**
     * Indicates whether the index takes the whole screen's width or not
     */
    carouselFull: PropTypes.bool,
};
