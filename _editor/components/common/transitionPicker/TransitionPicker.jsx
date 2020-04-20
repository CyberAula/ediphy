import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import Ediphy from '../../../../core/editor/main';
import { TRANSITIONS } from "../../../../common/themes/transitions/transitions";
import { TransitionPickerContainer } from "./Styles";

class TransitionPicker extends React.Component {
    state = {
        activeTransition: this.props.transition,
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

export default connect(mapStateToProps)(TransitionPicker);

function mapStateToProps(state) {
    return {
        transition: state.undoGroup.present.styleConfig.transition || 0,
    };
}

TransitionPicker.propTypes = {
    /**
     * Click handler
     */
    onClick: PropTypes.func,
    /**
     * Current transition
     */
    transition: PropTypes.any,
};
