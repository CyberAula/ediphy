import React from 'react';
import expect from 'expect';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import Alert from '../Alert';

const mocki18n = 'i18n string';

jest.mock('i18next', () => ({
    t: jest.fn(() => mocki18n).mockName('i18n.t'),
}));

beforeEach(() => {
    // Forget about any mock function being called previously
    jest.clearAllMocks();
});

const mockFunctions = {
    onClose: jest.fn().mockName('onClose'),
};

describe('Alert', () => {
    it('should render with required props', () => {
        const component = shallow(<Alert {...mockFunctions} />);

        expect(shallowToJson(component)).toMatchSnapshot();
    });

    it('should modify the Modal\'s class when the className is set', () => {
        const mockClass = 'ALERT_CLASS';
        const component = shallow(<Alert {...mockFunctions} className={mockClass} />);

        expect(component.find('#alertModal').hasClass(mockClass)).toBeTruthy();
    });

    it('should set the corresponding backdrop when set explictly', () => {
        const component = shallow(<Alert {...mockFunctions} />);

        [true, false, 'static'].map(value => {
            component.setProps({ backdrop: value });

            expect(component.find('#alertModal').prop('backdrop')).toBe(value);
        });
    });

    it('should display both the header and title when specified in the props', () => {
        const mockTitle = 'MOCK_TITLE';
        const component = shallow(<Alert {...mockFunctions}
            hasHeader
            title={mockTitle} />);

        expect(component.find('Modal ModalHeader')).toHaveLength(1);
        expect(component.find('Modal ModalHeader').children().text()).toBe(mockTitle);
    });

    it('should display the cancel button in the footer when specified in the props', () => {
        const mockCancelText = 'MOCK_CANCEL';
        const component = shallow(<Alert {...mockFunctions}
            cancelButton
            cancelButtonText={mockCancelText} />);

        expect(component.find('Modal ModalFooter Button[name="cancelButton"]')).toHaveLength(1);
    });

    it('should set the Bootstrap button style as specified in the props, or use the defaults otherwise', () => {
        const component = shallow(<Alert {...mockFunctions} cancelButton />);

        [undefined, 'success', 'warning', 'danger', 'info', 'default', 'primary', 'link'].map(value => {
            component.setProps({ bsStyle: value });

            expect(component.find('Modal ModalFooter Button[name="cancelButton"]').prop('bsStyle')).toBe(value || 'default');
            expect(component.find('Modal ModalFooter Button[name="okButton"]').prop('bsStyle')).toBe(value || 'primary');
        });
    });

    it('should set the buttons\' inner text as specified in props, or use the defaults otherwise', () => {
        const component = shallow(<Alert {...mockFunctions} cancelButton />);

        [undefined, mocki18n].map(value => {
            component.setProps({
                cancelButtonText: value,
                acceptButtonText: value,
            });

            expect(component.find('Modal ModalFooter Button[name="cancelButton"]').children().text()).toBe(value || mocki18n);
            expect(component.find('Modal ModalFooter Button[name="okButton"]').children().text()).toBe(value || mocki18n);
        });
    });

    it('should close accepting the dialog when ENTER is hit', () => {
        const component = shallow(<Alert {...mockFunctions} />);

        component.simulate('keyUp', { keyCode: 13 });

        expect(mockFunctions.onClose).toHaveBeenCalledWith(true);
    });

    it('shouldn\'t do anything when any other key is pressed', () => {
        const component = shallow(<Alert {...mockFunctions} />);

        component.simulate('keyUp', { keyCode: 42 });

        expect(mockFunctions.onClose).not.toHaveBeenCalled();
    });

    it('should close rejecting the dialog when onHide is triggered', () => {
        // react-bootstrap automatically calls onHide when the
        // closeButton/backdrop (if present/non-static) is clicked

        const component = shallow(<Alert {...mockFunctions} />);

        component.find('#alertModal').prop('onHide')();

        expect(mockFunctions.onClose).toHaveBeenCalledWith(false);
    });

    it('should close rejecting the dialog when the "cancel" button is clicked', () => {
        const component = shallow(<Alert {...mockFunctions} cancelButton />);

        component.find('Modal ModalFooter Button[name="cancelButton"]').simulate('click');

        expect(mockFunctions.onClose).toHaveBeenCalledWith(false);
    });

    it('should close accepting the dialog when the "ok" button is clicked', () => {
        const component = shallow(<Alert {...mockFunctions} cancelButton />);

        component.find('Modal ModalFooter Button[name="okButton"]').simulate('click');

        expect(mockFunctions.onClose).toHaveBeenCalledWith(true);
    });
});
