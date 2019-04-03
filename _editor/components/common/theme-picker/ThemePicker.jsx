import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import { THEMES } from '../../../../common/themes/theme_loader';

export default class FontPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeThemeIndex: 0,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(id) {
        this.setState({ activeThemeIndex: id });
    }

    render() {
        return(
            <div id={"owl-container"}>
                <OwlCarousel
                    ref={"car"}
                    className="owl-theme theme-picker-container"
                    margin={10}
                    items={2}
                    loop
                    startPosition = {this.state.activeThemeIndex}
                    nav
                    navText={["<i class='material-icons'>chevron_left</i>", "<i class='material-icons'>chevron_right</i>"]}
                    center
                    dots = {false}
                    // Hacky way to force children to update. Otherwise selected item only refreshed on second click
                    key={`carousel_${Date.now()}`}
                >
                    {Object.keys(THEMES).map((key, index)=> {
                        return (
                            <div
                                key={index}
                                className={"item"}
                                onClick={()=>this.handleChange(index)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontFamily: THEMES[key].fonts,
                                    background: THEMES[key].background[0],
                                    backgroundSize: 'cover',
                                    color: THEMES[key].colors.themePrimaryColor,
                                    height: '5em' }}><h4 key={index}>{index === this.state.activeThemeIndex ? 'selected' : key}</h4></div>
                        );
                    })}
                </OwlCarousel>
                <div>Selected item is {this.state.activeThemeIndex}</div>
            </div>
        );
    }
}

