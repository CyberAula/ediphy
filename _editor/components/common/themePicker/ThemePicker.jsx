import React from 'react';
import PropTypes from 'prop-types';

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import { THEMES } from '../../../../common/themes/themeLoader';
import { ThemePickerContainer } from "./Styles";

export default class ThemePicker extends React.Component {

    state = { activeThemeIndex: Object.keys(THEMES).indexOf(this.props.currentTheme) };

    handleChange = (id) => {
        this.props.onChange(id);
        this.setState({ activeThemeIndex: id });
    };

    render() {
        const selectedIndex = Object.keys(THEMES).indexOf(this.props.currentTheme);
        return(
            <ThemePickerContainer key={`carousel_${this.state.activeThemeIndex}_${this.props.currentTheme}`} onChange={this.props.onChange}>
                <OwlCarousel ref={"car"} className="owl-theme owl-container" margin={10} items={2}
                    startPosition = { selectedIndex } nav center lazyload={'true'} dots = {false}
                    navText={["<i class='material-icons'>chevron_left</i>", "<i class='material-icons'>chevron_right</i>"]}
                    // Hacky way to force children to update. Otherwise selected item only refreshed on second click
                    key={`carousel_${this.state.activeThemeIndex}_${this.props.currentTheme}`}
                >
                    {Object.keys(THEMES).map((key, index)=> {
                        let selected = index === selectedIndex ? ' selected ' : ' ';
                        let toolbar = !this.props.fromStyleConfig ? ' toolbar ' : '';
                        return (
                            <img
                                key={index}
                                alt={key}
                                className={"item" + selected + toolbar }
                                onClick={()=>this.handleChange(index)}
                                src = {`themes/${key}/thumbnail.jpg`}
                                style={{
                                    border: '1px solid #cecece',
                                    height: this.props.fromStyleConfig ? '10em' : '5em' }} />
                        );
                    })}
                </OwlCarousel>
            </ThemePickerContainer>
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

