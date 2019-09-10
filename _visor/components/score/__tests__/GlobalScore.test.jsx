import React from 'react';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import expect from 'expect';

const GlobalScore = jest.requireActual('../GlobalScore').default;

jest.mock('../../../../locales/i18n', () => {});

jest.mock('i18next', () => ({
    t: jest.fn(() => 'i18n string').mockName('i18n.t'),
}));

beforeEach(() => {
    // Forget about any mock function being called previously
    jest.clearAllMocks();
});

let propsPass = {
    show: true,
    scoreInfo: {
        userName: "Unknown",
        totalScore: 20,
        totalWeight: 30,
        isPassed: true,
        completionProgress: 0.5,
    },
};

let propsFail = {
    show: true,
    scoreInfo: {
        userName: "Unknown",
        totalScore: 0,
        totalWeight: 30,
        isPassed: false,
        completionProgress: 0.1,
    },
};

let propsAnonymous = {
    show: true,
    scoreInfo: {
        totalScore: 0,
        totalWeight: 30,
        isPassed: false,
        completionProgress: 0.1,
    },
};

describe('GlobalScore Component', () => {
    it('should render with required props', () => {
        const component = shallow(<GlobalScore {...propsPass} />);
        expect(shallowToJson(component)).toMatchSnapshot();
    });

    it('should be selectable by class "globalScore"', () => {
        const component = shallow(<GlobalScore {...propsPass} />);
        expect(component.is('.globalScore')).toBe(true);
    });

    it('should show correct username', () => {
        const component = shallow(<GlobalScore {...propsPass} />);
        expect(component.find('h5 span').text()).toEqual("Unknown");
        const componentAnonymous = shallow(<GlobalScore {...propsAnonymous} />);
        expect(componentAnonymous.find('h5 span').text()).toEqual("");
    });

    it('should show correct score', () => {
        const componentPass = shallow(<GlobalScore {...propsPass} />);
        expect(componentPass.find('h6 .scoreField1').text()).toEqual("insert_chart 20/30 ");
        expect(componentPass.find('h6 .scoreField2').text()).toEqual("pie_chart 66.67% ");

        const componentFail = shallow(<GlobalScore {...propsFail} />);
        expect(componentFail.find('h6 .scoreField1').text()).toEqual("insert_chart 0/30 ");
        expect(componentFail.find('h6 .scoreField2').text()).toEqual("pie_chart 0% ");
    });

    it('should show correct progress', () => {
        const componentPass = shallow(<GlobalScore {...propsPass} />);
        expect(componentPass.find('.progressField').text()).toEqual(" 50% ");
        expect(componentPass.find('#currentprogress').prop('style')).toHaveProperty('width', '50%');

        const componentFail = shallow(<GlobalScore {...propsFail} />);
        expect(componentFail.find('.progressField').text()).toEqual(" 10% ");
        expect(componentFail.find('#currentprogress').prop('style')).toHaveProperty('width', '10%');
    });

    it('should be null if hidden', () => {
        expect(mount(<GlobalScore {...{ ...propsAnonymous, show: false }} />).find('.pageScore')).toHaveLength(0);
    });

});
