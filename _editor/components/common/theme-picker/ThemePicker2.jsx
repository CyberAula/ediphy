import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import { THEMES } from '../../../../common/themes/theme_loader';

import 'pure-react-carousel/dist/react-carousel.es.css';

export default class extends React.Component {
    render() {
        return (
            <CarouselProvider
                naturalSlideWidth={160}
                naturalSlideHeight={90}
                totalSlides={Object.keys(THEMES).length}
            >
                <Slider>
                    {Object.keys(THEMES).map((key, index)=> {
                        return (<Slide
                            onFocus={()=>console.log(index)}
                            index={index}
                            key={index}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontFamily: THEMES[key].fonts,
                                background: THEMES[key].background[0],
                                backgroundSize: 'cover',
                                color: THEMES[key].colors.themePrimaryColor,
                                height: '5em' }}><h4>{THEMES[key].name}</h4></Slide>);
                    })}
                </Slider>
                <ButtonBack>Back</ButtonBack>
                <ButtonNext>Next</ButtonNext>
            </CarouselProvider>
        );
    }
}
