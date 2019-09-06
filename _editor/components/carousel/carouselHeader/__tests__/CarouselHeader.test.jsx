import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import CarouselHeader from '../CarouselHeader';

beforeEach(() => {
    // Forget about any mock function being called previously
    jest.clearAllMocks();
});

// Unit test's mocks
let mockFunctions = {
    onTitleChanged: jest.fn().mockName('onTitleChanged'),
    onToggleFull: jest.fn().mockName('onToggleFull'),
    onToggleWidth: jest.fn().mockName('onToggleWidth'),
};

let placeholderProps = {
    carouselFull: false,
    carouselShow: true,
    courseTitle: 'IACR',
    ...mockFunctions,
};

describe('CarouselHeader', () => {
    it('should render as expected when the carousel is expanded', () => {
        let component = shallow(<CarouselHeader {...placeholderProps}
            carouselShow />);

        expect(shallowToJson(component)).toMatchSnapshot();
    });

    it('should render as expected when the carousel is collapsed', () => {
        let component = shallow(<CarouselHeader {...placeholderProps}
            carouselShow={false} />);

        expect(shallowToJson(component)).toMatchSnapshot();
    });

    it('should show a left arrow when the carousel is at full width', () => {
        let component = shallow(<CarouselHeader {...placeholderProps}
            carouselFull />);

        expect(component.find('button.btnFullCarousel i').first().text()).toEqual('keyboard_arrow_left');
    });

    it('should handle when expand/collapse button is clicked', () => {
        let component = shallow(<CarouselHeader {...placeholderProps} />);

        component.find('button.btnToggleCarousel').simulate('click');

        expect(mockFunctions.onToggleWidth).toHaveBeenCalled();
    });

    it('should handle when the arrow is clicked', () => {
        let component = shallow(<CarouselHeader {...placeholderProps} />);

        let stopPropagation = jest.fn().mockName('stopPropagation');
        component.find('button.btnFullCarousel').simulate('click', { stopPropagation: stopPropagation });

        expect(mockFunctions.onToggleFull).toHaveBeenCalled();
        expect(stopPropagation).toHaveBeenCalled();
    });
});
