import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from "react-redux";

import EditorIndexTitle from '../editorIndexTitle/EditorIndexTitle';
import i18n from 'i18next';
import './_carouselHeader.scss';
import handleCanvas from "../../../handlers/handleCanvas";
import { updateUI } from "../../../../common/actions";

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
            <div style={{
                textAlign: this.props.carouselShow ? 'left' : 'center',
                flexFlow: this.props.carouselShow ? 'row' : 'column',
                display: 'flex',
            }}
            className={'carouselListTitle ' + (this.props.carouselShow ? 'toolbarSpread' : 'toolbarHide')}>
                <button className="btnToggleCarousel" onClick={() => this.onToggleWidth()}>
                    <i style={{ fontSize: this.props.carouselShow ? '16px' : '28px' }} className="material-icons">format_list_numbered</i>
                </button>
                {!this.props.carouselShow ? <br/> : null}

                <div className="navBarSpace" style={{ display: (this.props.carouselShow ? 'block' : 'none') }}>
                    <EditorIndexTitle
                        id="coursetit"
                        scrollW={widthScroll}
                        className="tituloCurso"
                        title={this.props.courseTitle}
                        courseTitle
                        onNameChanged={this.hC.onTitleChanged}
                    />
                </div>

                <div className="clear" />
            </div>
        );
    }

    onToggleWidth = () => {
        if(this.props.carouselShow) {
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
