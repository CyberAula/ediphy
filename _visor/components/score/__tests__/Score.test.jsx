import React from 'react';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import expect from 'expect';

const Score = jest.requireActual('../Score').default;

jest.mock('../../../../locales/i18n', () => {});

jest.mock('i18next', () => ({
    t: jest.fn(() => 'i18n string').mockName('i18n.t'),
}));

beforeEach(() => {
    // Forget about any mock function being called previously
    jest.clearAllMocks();
});

let propsPass = {
    exercises: {
        score: 0.7,
        minForPass: 50,
        attempted: true,
    },
};

let propsFail = {
    exercises: {
        score: 0.1,
        minForPass: 50,
        attempted: true,
    },
};

let propsNotAttempted = {
    exercises: {
        score: 0,
        minForPass: 50,
        attempted: false,
    },
};

describe('Score Component', () => {
    it('should render with required props', () => {
        const component = shallow(<Score {...propsPass} />);
        expect(shallowToJson(component)).toMatchSnapshot();
    });

    it('should be selectable by class "scorePass" when score is higher than threshold', () => {
        const component = shallow(<Score {...propsPass} />);
        expect(component.is('.scorePass')).toBe(true);
    });

    it('should be selectable by class "scoreFail" when score is lower than threshold', () => {
        const component = shallow(<Score {...propsFail} />);
        expect(component.is('.scoreFail')).toBe(true);
    });

    it('should be null if not attempted', () => {
        expect(mount(<Score {...propsNotAttempted} />).find('.pageScore')).toHaveLength(0);
    });

});
