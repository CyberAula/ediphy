import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import { ID_PREFIX_BOX, ID_PREFIX_SECTION } from '../../../../../common/constants';

let NavActionButtons;

// Dependencies' mocks
jest.mock('i18next', () => ({
    t: () => 'i18n string',
}));

beforeEach(() => {
    jest.mock('screenfull', () => ({
        on: jest.fn().mockName('on'),
        off: jest.fn().mockName('off'),
        toggle: jest.fn().mockName('toggle'),
    }));

    // Ediphy.Config is set to make the snapshot deterministic, regardless of
    // the actual config in the repo
    jest.mock('../../../../../core/editor/main', () => ({
        Config: {
            disable_save_button: false,
            publish_button: false,
        },
    }));

    // Reset all modules with the new mocks and reload the component
    jest.resetModules();
    NavActionButtons = jest.requireActual('../NavActionButtons.jsx').default;

    // Forget about any mock function being called previously
    jest.clearAllMocks();
});

// Unit test's mocks
const mockFunctions = {
    changeGlobalConfig: jest.fn().mockName('changeGlobalConfig'),
    onTextEditorToggled: jest.fn().mockName('onTextEditorToggled'),
    redo: jest.fn().mockName('redo'),
    save: jest.fn().mockName('save'),
    serverModalOpen: jest.fn().mockName('serverModalOpen'),
    undo: jest.fn().mockName('undo'),
    visor: jest.fn().mockName('visor'),
};

const placeholderProps = {
    boxSelected: 0,
    globalConfig: {},
    navItems: {
        'MOCK_NAV_ITEM': {},
    },
    navItemSelected: 'MOCK_NAV_ITEM',
    redoDisabled: false,
    undoDisabled: false,
    ...mockFunctions,
};

describe('NavActionButtons - General', () => {
    it('should render with required props', () => {
        const component = shallow(<NavActionButtons {...placeholderProps} />);

        expect(shallowToJson(component)).toMatchSnapshot();
    });

    it('should set the screenfull onChange handler after mounting the component', () => {
        const component = shallow(<NavActionButtons {...placeholderProps} />);

        const screenfull = jest.requireMock('screenfull');
        expect(screenfull.on).toHaveBeenCalledWith('change', component.instance().checkFullScreen);
    });

    it('should remove the screenfull onChange handler before unmounting the component', () => {
        const component = shallow(<NavActionButtons {...placeholderProps} />);

        // Trigger the unmount lifecycle to invoke the componentWillUnmount() method
        component.unmount();

        const screenfull = jest.requireMock('screenfull');
        expect(screenfull.off).toHaveBeenCalled();
    });

    it('should save in state.isFullScreenOn the full screen status when checkFullScreen() is called', () => {
        // Override screenfull's mock
        jest.mock('screenfull', () => ({
            on: jest.fn().mockName('on'),
            off: jest.fn().mockName('off'),
            isFullscreen: true,
        }));
        jest.resetModules();
        NavActionButtons = jest.requireActual('../NavActionButtons.jsx').default;

        const component = shallow(<NavActionButtons {...placeholderProps} />);

        // Call the component's checkFullScreen method
        component.instance().checkFullScreen();

        expect(component.state('isFullScreenOn')).toBeTruthy();
    });
});

describe('NavActionButtons - "Fullscreen" button', () => {
    it('should have the "fullscreen" icon when state.isFullScreenOn = false', () => {
        const component = shallow(<NavActionButtons {...placeholderProps} />);

        // Explicitly set state.isFullScreenOn = false
        component.setState({ isFullScreenOn: false });
        expect(component.find('button[name="fullscreen"] i').first().text()).toEqual('fullscreen');
    });

    it('should have the "fullscreen_exit" icon when state.isFullScreenOn = true', () => {
        const component = shallow(<NavActionButtons {...placeholderProps} />);

        // Set state.isFullScreenOn = true
        component.setState({ isFullScreenOn: true });
        expect(component.find('button[name="fullscreen"] i').first().text()).toEqual('fullscreen_exit');
    });

    it('should toggle the full screen when the button is clicked', () => {
        const component = shallow(<NavActionButtons {...placeholderProps} />);

        // Click the "Fullscreen" button
        component.find('button[name="fullscreen"]').first().simulate('click');

        const screenfull = jest.requireMock('screenfull');
        expect(screenfull.toggle).toHaveBeenCalled();
    });
});

describe('NavActionButtons - "Undo" button', () => {
    it('should disable the button when undoDisabled = true', () => {
        const component = shallow(<NavActionButtons {...placeholderProps} undoDisabled />);

        // "Undo" button
        expect(component.find('button[name="undo"]').first().prop('disabled')).toBeTruthy();
    });
});

describe('NavActionButtons - "Redo" button', () => {
    it('should disable the button when redoDisabled = true', () => {
        const component = shallow(<NavActionButtons {...placeholderProps} redoDisabled />);

        // "Redo" button
        expect(component.find('button[name="redo"]').first().prop('disabled')).toBeTruthy();
    });
});

describe('NavActionButtons - "Save" button', () => {
    it('should display the button when configured and publish_button = undefined', () => {
        // Override Ediphy.Config's mock
        jest.mock('../../../../../core/editor/main', () => ({
            Config: {
                disable_save_button: false,
                publish_button: undefined,
            },
        }));
        jest.resetModules();
        NavActionButtons = jest.requireActual('../NavActionButtons.jsx').default;

        const component = shallow(<NavActionButtons {...placeholderProps} />);

        expect(component.find('button[name="save"]')).toHaveLength(1);
    });

    it('should display the button when configured and publish_button = false', () => {
        // Override Ediphy.Config's mock (again, this time with publish_button set up)
        jest.mock('../../../../../core/editor/main', () => ({
            Config: {
                disable_save_button: false,
                publish_button: false,
            },
        }));
        jest.resetModules();
        NavActionButtons = jest.requireActual('../NavActionButtons.jsx').default;

        const component = shallow(<NavActionButtons {...placeholderProps} />);

        expect(component.find('button[name="save"]')).toHaveLength(1);
    });

    it('should handle when the button is clicked', () => {
        const component = shallow(<NavActionButtons {...placeholderProps} />);

        // Click the "Save" button
        component.find('button[name="save"]').first().simulate('click');

        expect(mockFunctions.save).toHaveBeenCalled();
        expect(mockFunctions.serverModalOpen).toHaveBeenCalled();
    });
});

describe('NavActionButtons - "Publish" button', () => {
    it('should display the button when configured and the course has "draft" status', () => {
        // Override Ediphy.Config's mock
        jest.mock('../../../../../core/editor/main', () => ({
            Config: {
                publish_button: true,
            },
        }));
        jest.resetModules();
        NavActionButtons = jest.requireActual('../NavActionButtons.jsx').default;

        const component = shallow(<NavActionButtons {...placeholderProps}
            globalConfig={{ status: 'draft' }} />);

        expect(component.find('button[name="publish"]')).toHaveLength(1);
    });

    it('should handle when the button is clicked', () => {
        // Here we force again the creation of the button, in order to be
        // able to run rests on it

        // Override Ediphy.Config's mock
        jest.mock('../../../../../core/editor/main', () => ({
            Config: {
                publish_button: true,
            },
        }));
        jest.resetModules();
        NavActionButtons = jest.requireActual('../NavActionButtons.jsx').default;

        const component = shallow(<NavActionButtons {...placeholderProps}
            globalConfig={{ status: 'draft' }} />);

        // Click the "Save" button
        component.find('button[name="publish"]').first().simulate('click');

        expect(mockFunctions.changeGlobalConfig).toHaveBeenCalledWith('status', 'final');
        expect(mockFunctions.save).toHaveBeenCalled();
        expect(mockFunctions.serverModalOpen).toHaveBeenCalled();
    });
});

describe('NavActionButtons - "Unpublish" button', () => {
    it('should display the button when configured and the course has "final" status', () => {
        // Override Ediphy.Config's mock
        jest.mock('../../../../../core/editor/main', () => ({
            Config: {
                publish_button: true,
            },
        }));
        jest.resetModules();
        NavActionButtons = jest.requireActual('../NavActionButtons.jsx').default;

        const component = shallow(<NavActionButtons {...placeholderProps}
            globalConfig={{ status: 'final' }} />);

        expect(component.find('button[name="unpublish"]')).toHaveLength(1);
    });

    it('should handle when the button is clicked', () => {
        // Here we force again the creation of the button, in order to be
        // able to run rests on it

        // Override Ediphy.Config's mock
        jest.mock('../../../../../core/editor/main', () => ({
            Config: {
                publish_button: true,
            },
        }));
        jest.resetModules();
        NavActionButtons = jest.requireActual('../NavActionButtons.jsx').default;

        const component = shallow(<NavActionButtons {...placeholderProps}
            globalConfig={{ status: 'final' }} />);

        // Click the "Save" button
        component.find('button[name="unpublish"]').first().simulate('click');

        expect(mockFunctions.changeGlobalConfig).toHaveBeenCalledWith('status', 'draft');
        expect(mockFunctions.save).toHaveBeenCalled();
        expect(mockFunctions.serverModalOpen).toHaveBeenCalled();
    });
});

describe('NavActionButtons - "Preview" button', () => {
    it('should disable the button when navItemSelected = 0', () => {
        const component = shallow(<NavActionButtons {...placeholderProps}
            navItemSelected={0} />);

        expect(component.find('button[name="preview"]').first().prop('disabled')).toBeTruthy();
    });

    it('should disable the button when a section is selected and sections can\'t have content', () => {
        // Override Ediphy.Config's mock
        jest.mock('../../../../../core/editor/main', () => ({
            Config: {
                sections_have_content: false,
            },
        }));
        jest.resetModules();
        NavActionButtons = jest.requireActual('../NavActionButtons.jsx').default;

        const component = shallow(<NavActionButtons {...placeholderProps}
            navItemSelected={`${ID_PREFIX_SECTION}-3141592653590`} />);

        expect(component.find('button[name="preview"]').first().prop('disabled')).toBeTruthy();
    });

    it('should handle when the button is clicked (with a box selected)', () => {
        // Override Ediphy.Config's mock
        jest.mock('../../../../../core/editor/main', () => ({
            Config: {
                publish_button: true,
            },
        }));
        jest.resetModules();
        NavActionButtons = jest.requireActual('../NavActionButtons.jsx').default;

        const mockedBox = `${ID_PREFIX_BOX}-3141592653590`;

        const component = shallow(<NavActionButtons {...placeholderProps}
            globalConfig={{ status: 'final' }}
            boxSelected={ mockedBox } />);

        // Click the "Save" button
        component.find('button[name="preview"]').first().simulate('click');

        expect(mockFunctions.onTextEditorToggled).toHaveBeenCalledWith(mockedBox, false);
        expect(mockFunctions.visor).toHaveBeenCalled();
    });

    it('should handle when the button is clicked (without any box selected)', () => {
        // Override Ediphy.Config's mock
        jest.mock('../../../../../core/editor/main', () => ({
            Config: {
                publish_button: true,
            },
        }));
        jest.resetModules();
        NavActionButtons = jest.requireActual('../NavActionButtons.jsx').default;

        const component = shallow(<NavActionButtons {...placeholderProps}
            globalConfig={{ status: 'final' }}
            boxSelected={0} />);

        // Click the "Save" button
        component.find('button[name="preview"]').first().simulate('click');

        expect(mockFunctions.onTextEditorToggled).not.toHaveBeenCalled();
        expect(mockFunctions.visor).toHaveBeenCalled();
    });
});
