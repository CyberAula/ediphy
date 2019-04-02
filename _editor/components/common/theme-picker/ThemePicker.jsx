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
    }

    handleChange(id) {
        console.log(id);
        this.setState({ activeThemeIndex: id });
    }

    render() {
        return(
            <OwlCarousel
                className="owl-theme theme-picker-container"
                // onChange={()=>console.log('change')}
                // onChanged={(e)=>console.log(e)}
                margin={10}
                items={2}
                // loop
                startPosition ={1}
                nav
                navText={["<i class='material-icons'>chevron_left</i>", "<i class='material-icons'>chevron_right</i>"]}
                center
                dots = {false}
            >
                {Object.keys(THEMES).map((key, index)=> {
                    let selected = index === this.state.activeThemeIndex ? 'selected' : '';
                    console.log(index, this.state.activeThemeIndex);
                    return (<div className={"item"}
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
                            height: '5em' }}><h4>{selected}</h4></div>);
                })}
            </OwlCarousel>
        );
    }
}

