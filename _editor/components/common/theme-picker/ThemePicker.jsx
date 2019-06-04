import React from 'react';
import PropTypes from 'prop-types';

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './theme_picker.scss';

import { THEMES } from '../../../../common/themes/theme_loader';
import TransitionPicker from "../transition-picker/TransitionPicker";

export default class ThemePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeThemeIndex: Object.keys(THEMES).indexOf(this.props.currentTheme),
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(id) {
        this.props.onChange(id);
        this.setState({ activeThemeIndex: id });
    }

    render() {
        let selectedIndex = Object.keys(THEMES).indexOf(this.props.currentTheme);
        return(
            <div key={`carousel_${this.state.activeThemeIndex}_${this.props.currentTheme}`} className={"theme-picker-container"} style={{ width: '100%' }} onChange={this.props.onChange}>
                <OwlCarousel
                    ref={"car"}
                    className="owl-theme owl-container"
                    margin={10}
                    items={2}
                    startPosition = { selectedIndex }
                    nav
                    navText={["<i class='material-icons'>chevron_left</i>", "<i class='material-icons'>chevron_right</i>"]}
                    center
                    lazyLoad
                    dots = {false}
                    // Hacky way to force children to update. Otherwise selected item only refreshed on second click
                    key={`carousel_${this.state.activeThemeIndex}_${this.props.currentTheme}`}
                >
                    {Object.keys(THEMES).map((key, index)=> {
                        let selected = index === selectedIndex ? ' selected ' : ' ';
                        let toolbar = !this.props.fromStyleConfig ? ' toolbar ' : '';
                        return (
                            <img
                                key={index}
                                className={"item" + selected + toolbar }
                                onClick={()=>this.handleChange(index)}
                                src = {`/themes/${key}/thumbnail.jpg`}
                                style={{
                                    height: this.props.fromStyleConfig ? '10em' : '5em' }} />
                        );
                    })}
                </OwlCarousel>
            </div>
        );
    }
}

ThemePicker.propTypes = {
    /**
     * Current page theme
     */
    currentTheme: PropTypes.string,
    /**
     * Theme change handler
     */
    onChange: PropTypes.func,
    /**
     * Is being called from Style config modal
     */
    fromStyleConfig: PropTypes.bool,
};

