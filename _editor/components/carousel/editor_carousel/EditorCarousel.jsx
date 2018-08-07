import PropTypes from 'prop-types';
import React, { Component } from 'react';

import CarouselButtons from '../carousel_buttons/CarouselButtons';
import CarouselHeader from '../carousel_header/CarouselHeader';
import CarouselList from '../carousel_list/CarouselList';

/**
 * Index wrapper container
 */
export default class EditorCarousel extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
    }

    /**
     * Renders React Component
     * @returns {code}
     */
    render() {
        return (
            <div id="colLeft" className="wrapperCarousel"
                style={{
                    maxWidth: this.props.carouselShow ? (this.props.carouselFull ? '100%' : '212px') : '80px',
                    overflowX: this.props.carouselFull ? 'hidden' : '',
                }}>
                <CarouselHeader carouselFull={this.props.carouselFull}
                    carouselShow={this.props.carouselShow}
                    courseTitle={this.props.title}
                    onTitleChanged={this.props.onTitleChanged}
                    onToggleFull={this.props.onToggleFull}
                    onToggleWidth={this.props.onToggleWidth} />
                <CarouselList id={0} carouselShow={this.props.carouselShow} />
                <CarouselButtons carouselShow={this.props.carouselShow} />
            </div>
        );
    }

}

EditorCarousel.propTypes = {
    /**
     * Document title
     */
    title: PropTypes.string,
    /**
     * Indicates whether the index has been expanded or not
     */
    carouselShow: PropTypes.bool,
    /**
     * Indicates whether the index takes the whole screen's width or not
     */
    carouselFull: PropTypes.bool,
    /**
     * Expands the index to make it take 100% of the width
     */
    onToggleFull: PropTypes.func.isRequired,
    /**
     * Modifies the index's width
     */
    onToggleWidth: PropTypes.func.isRequired,

};
