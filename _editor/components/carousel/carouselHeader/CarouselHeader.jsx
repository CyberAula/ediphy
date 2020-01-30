import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from "react-redux";

import EditorIndexTitle from '../editorIndexTitle/EditorIndexTitle';
import i18n from 'i18next';
import handleCanvas from "../../../handlers/handleCanvas";
import { updateUI } from "../../../../common/actions";
import { CarouselTitleContainer, CarouselListTitle } from "./Styles";

/**
 * Carousel's header, containing the course's title and the expand/collapse buttons
 */
class CarouselHeader extends Component {
    // Initialize handlers
    hC = handleCanvas(this);

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        let courseTitle = this.props.courseTitle || i18n.t('course_title');
        let widthScroll = Math.max(courseTitle.length / 11 * 100, 100);
        // let widthScroll = this.props.courseTitle.length / 10 * 100;
        return (
            <CarouselListTitle style={{
                textAlign: this.props.carouselShow ? 'left' : 'center',
                flexFlow: this.props.carouselShow ? 'row' : 'column',
            }}
            carouselShow={this.props.carouselShow}>
                <button className="btnToggleCarousel" style={{ display: 'flex', alignItems: 'center' }} onClick={() => this.onToggleWidth()}>
                    <i style={{ fontSize: '24px', marginLeft: '4px' }} className="material-icons">{this.props.carouselShow ? 'keyboard_arrow_left' : 'menu'}</i>
                </button>
                {!this.props.carouselShow ? <br /> : null}

                <CarouselTitleContainer show={this.props.carouselShow}>
                    <EditorIndexTitle
                        id="coursetit"
                        scrollW={widthScroll}
                        title={this.props.courseTitle}
                        courseTitle
                        onNameChanged={this.hC.onTitleChanged}
                    />
                </CarouselTitleContainer>

                <div className="clear" />
            </CarouselListTitle>
        );
    }

    onToggleWidth = () => {
        if (this.props.carouselShow) {
            this.props.dispatch(updateUI({
                carouselShow: false,
                carouselFull: false,
            }));
        } else {
            this.props.dispatch(updateUI({ carouselShow: true }));
        }
    };
}

function mapStateToProps(state) {
    const { carouselFull, carouselShow } = state.reactUI;
    const courseTitle = state.undoGroup.present.globalConfig.title;
    return { carouselFull, carouselShow, courseTitle };
}

export default connect(mapStateToProps)(CarouselHeader);

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
     * Redux action dispatcher
     */
    // eslint-disable-next-line react/no-unused-prop-types
    dispatch: PropTypes.func.isRequired,
};
