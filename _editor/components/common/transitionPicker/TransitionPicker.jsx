import React from 'react';
import PropTypes from 'prop-types';

import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './transition_picker.scss';

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

        const transitions = TRANSITIONS.map((trans, index) => {
            const isActive = index === this.state.activeTransition;
            const activeClass = isActive ? " active " : " ";
            const className = " transition_template " + activeClass;
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
