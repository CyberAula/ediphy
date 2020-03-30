import React from 'react';
import PropTypes from 'prop-types';

import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import Ediphy from '../../../../core/editor/main';
import { TRANSITIONS } from "../../../../common/themes/transitions/transitions";
import { TransitionPickerContainer } from "./Styles";

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
                    <img src={Ediphy.Config.transitions_url + trans.image} style={{ height: '60%' }}/>
                    <div className={"view_name"}>{trans.viewName[0]}</div>
                </div>
            );
        });

        return(
            <TransitionPickerContainer children={transitions}/>
        );
    }
}

TransitionPicker.propTypes = {
    /**
     * Click handler
     */
    onClick: PropTypes.func,
};
