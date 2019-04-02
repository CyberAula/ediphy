import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import { THEMES } from '../../../../common/themes/theme_loader';

export default class FontPicker extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {

        console.log(THEMES);

        return(
            <OwlCarousel
                className="owl-theme"
                margin={10}
                items={2}
                nav
                center
                dots = {false}
            >
                {Object.keys(THEMES).map((key, index)=> {
                    return (<div className={"item"}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontFamily: THEMES[key].fonts,
                            background: THEMES[key].background[0],
                            backgroundSize: 'cover',
                            color: THEMES[key].colors.themePrimaryColor,
                            height: '5em' }}><h4>{key}</h4></div>);
                })}
            </OwlCarousel>
        );
    }
}

