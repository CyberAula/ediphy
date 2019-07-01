import PropTypes from 'prop-types';
import React, { Component } from 'react';

import EditorIndexTitle from '../editor_index_title/EditorIndexTitle';
import i18n from 'i18next';
import './_carouselHeader.scss';

/**
 * Carousel's header, containing the course's title and the expand/collapse buttons
 */
export default class CarouselHeader extends Component {
    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        let courseTitle = this.props.courseTitle || i18n.t('course_title');
        let widthScroll = Math.max(courseTitle.length / 11 * 100, 100);
        // let widthScroll = this.props.courseTitle.length / 10 * 100;
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
                    <EditorIndexTitle id="coursetit" scrollW={widthScroll} className="tituloCurso" title={this.props.courseTitle} courseTitle onNameChanged={this.props.onTitleChanged}/>
                </div>

                <div className="clear" />
            </div>
        );
    }
}

CarouselHeader.propTypes = {
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
     * Modifies the index's width
     */
    onToggleWidth: PropTypes.func.isRequired,
};
