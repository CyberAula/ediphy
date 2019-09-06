import React from 'react';
import PropTypes from 'prop-types';

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './transition_picker.scss';

import { THEMES } from '../../../../common/themes/themeLoader';
import { TRANSITIONS } from "../../../../common/themes/transitions/transitions";

export default class TransitionPicker extends React.Component {
    state = {
        activeTransition: 0,
    };

    handleChange = (index) => {
        this.setState({ activeTransition: index });
        this.props.onClick(index);
    };

    render() {

        let transitions = TRANSITIONS.map((trans, index) => {
            let isActive = index === this.state.activeTransition;
            let activeClass = isActive ? " active " : " ";
            let className = " transition_template " + activeClass;
            return (
                <div key={index} className={className} onClick={() => this.handleChange(index)}>
                    <img src={trans.image} style={{ height: '60%' }}/>
                    <div className={"view_name"}>{trans.viewName[0]}</div>
                </div>
            );
        });

        return(
            <div className={"transition_picker_container"} style={{ width: '100%' }}>
                {transitions}
            </div>
        );
    }
}

TransitionPicker.propTypes = {
    /**
     * Click handler
     */
    onClick: PropTypes.func,
};
