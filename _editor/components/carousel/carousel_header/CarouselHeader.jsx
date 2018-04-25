import PropTypes from 'prop-types';
import React, { Component } from 'react';

import EditorIndexTitle from '../editor_index_title/EditorIndexTitle';

import './_carouselHeader.scss';

/**
 * Carousel's header, containing the course's title and the expand/collapse buttons
 */
export default class CarouselHeader extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
    }

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        return (
            <div style={{
                textAlign: this.props.carouselShow ? 'left' : 'center',
                flexFlow: this.props.carouselShow ? 'row' : 'column',
                display: 'flex',
            }}
            className={'carouselListTitle ' + (this.props.carouselShow ? 'toolbarSpread' : 'toolbarHide')}>
                <button className="btnToggleCarousel" onClick={() => this.props.onToggleWidth()}>
                    <i style={{ fontSize: this.props.carouselShow ? '16px' : '28px' }} className="material-icons">format_list_numbered</i>
                </button>
                {!this.props.carouselShow ? <br/> : null}

                <div className="navBarSpace" style={{ display: (this.props.carouselShow ? 'block' : 'none') }}>
                    <EditorIndexTitle className="tituloCurso" title={this.props.courseTitle} courseTitle onNameChanged={this.props.onTitleChanged} />
                </div>

                <button className="btnFullCarousel" style={{ position: this.props.carouselShow ? 'absolute' : 'initial' }} onClick={e => {
                    this.props.onToggleFull();
                    e.stopPropagation();
                }}>
                    <i style={{
                        fontSize: this.props.carouselShow ? '16px' : '32px',
                    }}
                    className="material-icons">{!this.props.carouselFull ? 'keyboard_arrow_right' : 'keyboard_arrow_left'}
                    </i>
                </button>

                <div className="clear" />
            </div>
        );
    }
}

CarouselHeader.propTypes = {
    /**
     * Indicates whether the index takes the whole screen's width or not
     */
    carouselFull: PropTypes.bool,
    /**
     * Indicates whether the index has been expanded or not
     */
    carouselShow: PropTypes.bool,
    /**
     * Title of the course as specified on the global settings
     */
    courseTitle: PropTypes.string,
    /**
     * Modifies the course's title
     */
    onTitleChanged: PropTypes.func.isRequired,
    /**
     * Expands the index to make it take 100% of the width
     */
    onToggleFull: PropTypes.func.isRequired,
    /**
     * Modifies the index's width
     */
    onToggleWidth: PropTypes.func.isRequired,
};
