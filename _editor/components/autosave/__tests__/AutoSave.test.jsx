import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

jest.mock('../../../../locales/i18n', () => {});

jest.mock('i18next', () => ({
    t: jest.fn(() => 'i18n string').mockName('i18n.t'),
}));

const mockConfig = { autosave_time: 42 };

jest.mock('../../../../core/editor/main', () => ({
    Config: { ...mockConfig },
}));

// Importing this here to avoid leaks to other tests (because the
// import sets Ediphy.Config before it being mocked)
const { CHANGE_DISPLAY_MODE } = jest.requireActual('../../../../common/actions');

const AutoSave = jest.requireActual('../AutoSave').default;

beforeEach(() => {
    // Forget about any mock function being called previously
    jest.clearAllMocks();
});

const mockFunctions = {
    save: jest.fn().mockName('save'),
};

const placeholderProps = {
    lastAction: 'LAST_ACTION',
    isBusy: { value: true },
    visorVisible: true,
    ...mockFunctions,
};

// This component uses timers, so let's have them mocked
jest.useFakeTimers();

describe('AutoSave - General', () => {
    it('should render with required props', () => {
        const component = shallow(<AutoSave {...placeholderProps} />);

        expect(shallowToJson(component)).toMatchSnapshot();
    });

    it('should set the interval with period specified in the global config and the timer', () => {
        expect(setInterval).toHaveBeenCalled();
        expect(setInterval).toHaveBeenCalledWith(expect.any(Function), mockConfig.autosave_time);
    });

    it('should disable the timer when unmounted', () => {
        const component = shallow(<AutoSave {...placeholderProps} />);

        component.unmount();

        expect(clearInterval).toHaveBeenCalled();
    });

    it('should display the saving label if the state says so', () => {
        const component = shallow(<AutoSave {...placeholderProps} />);

        component.setState({ displaySave: true });

        expect(component.find('.savingLabel').prop('style')).toHaveProperty('display', 'block');
    });

    it('shouldn\'t display the saving label otherwise', () => {
        const component = shallow(<AutoSave {...placeholderProps} />);

        component.setState({ displaySave: false });

        expect(component.find('.savingLabel').prop('style')).toHaveProperty('display', 'none');
    });
});

describe('AutoSave - componentWillReceiveProps()', () => {
    it('should make displaySave truthy for 2s when busy', () => {
        const component = shallow(<AutoSave {...placeholderProps}
            isBusy />);

        component.setState({ modifiedState: false });
        component.setProps({
            isBusy: { value: true },
        });

        // Assertions before the first loop of the timer
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);
        expect(component.state('displaySave')).toBeTruthy();

        // Fast-forward the 2000ms in setTimeout's timer
        jest.runOnlyPendingTimers();

        // Assertions after the first loop of the timer
        expect(component.state('displaySave')).toBeFalsy();

    });

    it('shouldn\'t alter displaySave otherwise', () => {
        const component = shallow(<AutoSave {...placeholderProps}
            isBusy={false} />);

        [true, false].map(state => {
            component.setState({ modifiedState: state });
            component.setProps({
                isBusy: { value: false },
                lastAction: CHANGE_DISPLAY_MODE, // One of the ignored actions, to avoid modifications by the rest of the function
            });

            jest.runOnlyPendingTimers();

            expect(component.state('modifiedState')).toBe(state);
        });
    });

    it('should shouldn\'t change modifiedState when the lastAction is an ignored one', () => {
        const component = shallow(<AutoSave {...placeholderProps} />);

        component.setState({ modifiedState: false });

        component.setProps({
            lastAction: CHANGE_DISPLAY_MODE, // One of the ignored actions
        });

        expect(component.state('modifiedState')).toBeFalsy();
    });

    it('should should change modifiedState otherwise', () => {
        const component = shallow(<AutoSave {...placeholderProps} />);

        component.setState({ modifiedState: false });

        component.setProps({
            lastAction: 'MOCKED_LAST_ACTION',
        });

        expect(component.state('modifiedState')).toBeTruthy();
    });
});

describe('AutoSave - timer()', () => {
    it('should call save() when the visor isn\'t visible and the state has been modified', () => {
        const component = shallow(<AutoSave {...placeholderProps}
            visorVisible={false} />);

        component.setState({ modifiedState: true });

        component.instance().timer();

        expect(mockFunctions.save).toHaveBeenCalledTimes(1);
    });

    it('shouldn\'t call save() otherwise', () => {
        const component = shallow(<AutoSave {...placeholderProps}
            visorVisible={false} />);

        component.setState({ modifiedState: false });

        component.instance().timer();

        expect(mockFunctions.save).not.toHaveBeenCalled();
    });
});
