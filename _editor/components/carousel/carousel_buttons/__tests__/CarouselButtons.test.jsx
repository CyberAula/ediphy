import React from 'react';
import expect from 'expect';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

let CarouselButtons;

// Dependencies' mocks
let mockIsContainedView;
let mockIsSection;

beforeEach(() => {
    jest.mock('i18next', () => ({
        t: jest.fn(() => 'i18n string').mockName('i18n.t'),
    }));

    jest.mock('../../../../../core/editor/main', () => ({}));

    mockIsContainedView = false;
    mockIsSection = true;
    jest.mock('../../../../../common/utils', () => ({
        isContainedView: () => mockIsContainedView,
        isSection: () => mockIsSection,
    }));

    CarouselButtons = jest.requireActual('../CarouselButtons').default;

    // Forget about any mock function being called previously
    jest.clearAllMocks();
});

// Unit test's mocks
const mockFunctions = {
    onNavItemAdded: jest.fn().mockName('onNavItemAdded'),
    onBoxAdded: jest.fn().mockName('onBoxAdded'),
    onIndexSelected: jest.fn().mockName('onIndexSelected'),
    onContainedViewDeleted: jest.fn().mockName('onContainedViewDeleted'),
    onNavItemDeleted: jest.fn().mockName('onNavItemDeleted'),
};

const placeholderProps = {
    boxes: {},
    carouselShow: true,
    containedViews: { '42': {} },
    indexSelected: '42',
    navItems: {
        0: { level: 0 },
        '42': { level: 1 },
    },
    navItemsIds: [],
    ...mockFunctions,
};

describe('CarouselButtons - General', () => {
    it('should render with required props', () => {
        const component = shallow(<CarouselButtons {...placeholderProps} />);

        expect(shallowToJson(component)).toMatchSnapshot();
    });
});

describe('CarouselButtons - getParent()', () => {
    it('should return the id = 0 element if there\'s no valid navItem currently selected', () => {
        let nullNavItem = { id: 0 };
        const component = shallow(<CarouselButtons {...placeholderProps}
            indexSelected={-1} />);

        expect(component.instance().getParent()).toEqual(nullNavItem);
    });

    it('should return the navItem\'s parent if a valid navItem is currently selected, it isn\'t a section and it has a parent', () => {
        let navItem = {
            id: '42',
            parent: '8',
        };
        let navItemParent = { id: '8' };
        mockIsSection = false;

        const component = shallow(<CarouselButtons {...placeholderProps}
            indexSelected={'42'}
            navItems={{ '42': navItem, '8': navItemParent }} />);

        expect(component.instance().getParent()).toBe(navItemParent);
    });

    it('should return the id = 0 navItem if a valid navItem is currently selected and it isn\'t a section but it has no parent', () => {
        let navItem = { id: '42' };
        let nullNavItem = { id: 0 };
        mockIsSection = false;

        const component = shallow(<CarouselButtons {...placeholderProps}
            indexSelected={'42'}
            navItems={{ '42': navItem, 0: nullNavItem }} />);

        expect(component.instance().getParent()).toEqual(nullNavItem);
    });

    it('should return the section if the currently selected navItem is one', () => {
        let navItem = { id: '42' };
        mockIsSection = true;

        const component = shallow(<CarouselButtons {...placeholderProps}
            indexSelected={'42'}
            navItems={{ '42': navItem }} />);

        expect(component.instance().getParent()).toEqual(navItem);
    });
});

describe('CarouselButtons - calculatePosition()', () => {
    /*
        The mocked navItem structure looks like the following:
        4
        ├── 8
        ├── 15
        │   ├── 16
        │   └── 23
        └── 42
    */
    let navItems = {
        '4': {
            id: '4',
            level: 1,
        },
        '8': {
            id: '8',
            parent: '4',
            level: 2,
        },
        '15': {
            id: '15',
            parent: '4',
            level: 2,
        },
        '16': {
            id: '16',
            parent: '15',
            level: 3,
        },
        '23': {
            id: '23',
            parent: '15',
            level: 3,
        },
        42: {
            id: '42',
            parent: '4',
            level: 2,
        },
    };
    let navItemsIds = ['4', '8', '15', '16', '23', '42'];

    it('should return the final position if adding a navItem to the index\'s root', () => {
        const component = shallow(<CarouselButtons {...placeholderProps}
            indexSelected={'4'}
            navItems={navItems}
            navItemsIds={navItemsIds} />);

        expect(component.instance().calculatePosition()).toEqual(6);
    });

    it('should return the last position in the current level if adding a navItem in a sub-level', () => {
        mockIsSection = false;
        mockIsContainedView = false;

        const component = shallow(<CarouselButtons {...placeholderProps}
            indexSelected={'16'}
            navItems={navItems}
            navItemsIds={navItemsIds} />);

        expect(component.instance().calculatePosition()).toEqual(5);
    });

    // TODO: We are unsure about whether the "if(ids[i])" check is necessary,
    // leaving it untested for now. We should eventually investigate that.
});

describe('CarouselButtons - canDeleteContainedView()', () => {
    it('should return false if there is no view selected (id = 0)', () => {
        const component = shallow(<CarouselButtons {...placeholderProps} />);

        expect(component.instance().canDeleteContainedView(0)).toBeFalsy();
    });

    it('should return false if the provided ID doesn\'t belong to a contained view', () => {
        mockIsContainedView = false;

        const component = shallow(<CarouselButtons {...placeholderProps} />);

        expect(component.instance().canDeleteContainedView(0)).toBeFalsy();
    });

    it('should return true if the contained view\'s parent box doesn\'t exist anymore', () => {
        mockIsContainedView = true;

        const component = shallow(<CarouselButtons {...placeholderProps}
            boxes={{ 'box-2': {} }}
            containedViews={{ 42: { parent: 'box-1' } }} />);

        expect(component.instance().canDeleteContainedView('42')).toBeTruthy();
    });

    it('should return true if there are no marks bound to the contained view', () => {
        mockIsContainedView = true;

        const component = shallow(<CarouselButtons {...placeholderProps}
            boxes={{ 'box-1': {
                containedViews: ['8'],
            } }}
            containedViews={{ 42: { parent: 'box-1' } }} />);

        expect(component.instance().canDeleteContainedView('42')).toBeTruthy();
    });
});

describe('CarouselButtons - "New folder" button', () => {
    // Defaults that keeps the button enabled
    let component;
    beforeEach(() => {
        component = shallow(<CarouselButtons {...placeholderProps}
            indexSelected={'42'}
            navItems={{ '42': { level: 5 } }} />);
    });

    it('should disable the button when the current level is 10 or higher', () => {
        component.setProps({ navItems: { '42': { level: 10 } } });

        // this.props.navItems[this.props.indexSelected].level >= 10
        expect(component.find('Button[name="newFolder"]').prop('disabled')).toBeTruthy();
    });

    it('should disable the button if the current selection is a contained view', () => {
        mockIsContainedView = true;
        jest.resetModules();

        component = shallow(<CarouselButtons {...placeholderProps}
            containedViews={{ '42': {} }}
            indexSelected={'42'}
            navItems={{ '42': { level: 5 } }} />);

        // isContainedView(this.props.indexSelected)
        expect(component.find('Button[name="newFolder"]').prop('disabled')).toBeTruthy();
    });

    it('should disable the button if the current view is -1', () => {
        component.setProps({ indexSelected: -1 });

        // this.props.indexSelected === -1
        expect(component.find('Button[name="newFolder"]').prop('disabled')).toBeTruthy();
    });

    it('should enable the button otherwise', () => {
        expect(component.find('Button[name="newFolder"]').prop('disabled')).toBeFalsy();
    });

    it('should handle when the button is clicked', () => {
        CarouselButtons = jest.requireActual('../CarouselButtons').default;

        jest.requireMock('../../../../../core/editor/main').Config = { sections_have_content: true };

        component = shallow(<CarouselButtons {...placeholderProps} />);

        let stopPropagation = jest.fn().mockName('stopPropagation');
        jest.requireMock('../../../../../core/editor/main').Config = { sections_have_content: false };

        component = shallow(<CarouselButtons {...placeholderProps} />);

        component.find('Button[name="newFolder"]').first().simulate('click', { stopPropagation: stopPropagation });

        expect(mockFunctions.onNavItemAdded).toHaveBeenCalled();
        expect(mockFunctions.onBoxAdded).not.toHaveBeenCalled();
        expect(stopPropagation).toHaveBeenCalled();
    });
});

describe('CarouselButtons - "New document" button', () => {
    it('should disable the button if the current selection is a contained view', () => {
        mockIsContainedView = true;
        jest.resetModules();

        const component = shallow(<CarouselButtons {...placeholderProps} />);

        expect(component.find('Button[name="newDocument"]').prop('disabled')).toBeTruthy();
    });

    it('should handle when the button is clicked', () => {
        const component = shallow(<CarouselButtons {...placeholderProps} />);

        component.find('Button[name="newDocument"]').first().simulate('click');

        expect(mockFunctions.onNavItemAdded).toHaveBeenCalled();
    });
});

describe('CarouselButtons - "New slide" button', () => {
    it('should disable the button if the current selection is a contained view', () => {
        mockIsContainedView = true;
        jest.resetModules();

        const component = shallow(<CarouselButtons {...placeholderProps} />);

        expect(component.find('Button[name="newSlide"]').prop('disabled')).toBeTruthy();
    });

    // The code this used to test has been commented. Skipping this
    // (intentionally w/o .skip) for now.
    /*
    it('should handle when the button is clicked', () => {
        const component = shallow(<CarouselButtons {...placeholderProps} />);

        component.find('Button[name="newSlide"]').simulate('click');

        expect(mockFunctions.onNavItemAdded).toBeCalled();
        expect(mockFunctions.onIndexSelected).toBeCalled();
    });
    */
});

describe('CarouselButtons - "Delete" button', () => {
    it('should disable the button if there is no view selected', () => {
        const component = shallow(<CarouselButtons {...placeholderProps}
            indexSelected={0} />);

        expect(component.find('Button[name="delete"]').prop('disabled')).toBeTruthy();
    });

    it('should call the ref callback when mounted', () => {
        // "ref" callbacks are only called with mount
        // see https://github.com/airbnb/enzyme/issues/1394#issuecomment-348414481
        const component = mount(<CarouselButtons {...placeholderProps} />);

        expect(component.instance().overlayTarget).toBeDefined();
        expect(component.instance().overlayTarget.props).toHaveProperty('name', 'delete');
    });

    it('should handle when the button is clicked', () => {
        const component = shallow(<CarouselButtons {...placeholderProps} />);

        // Explicitly set state.showOverlay to false before clicking
        component.setState({ showOverlay: false });

        component.find('Button[name="delete"]').simulate('click');

        expect(component.state('showOverlay')).toBeTruthy();
    });
});

describe('CarouselButtons - Delete confirmation overlay', () => {
    it('should gather its target properly', () => {
        let mockTarget = { foo: 'bar' };
        let mockFindDOMNode = jest.fn().mockName('findDOMNode');
        jest.mock('react-dom', () => ({
            findDOMNode: mockFindDOMNode,
        }));
        jest.resetModules();
        CarouselButtons = jest.requireActual('../CarouselButtons').default;

        const component = shallow(<CarouselButtons {...placeholderProps} />);

        component.instance().overlayTarget = mockTarget;
        component.find('Overlay[name="confirmationOverlay"]').first().prop('target')();

        expect(mockFindDOMNode).toHaveBeenCalledWith(mockTarget);
    });

    it('should set state.showOverlay = false when hidden', () => {
        const component = shallow(<CarouselButtons {...placeholderProps} />);

        // Explicitly set state.showOverlay to true before clicking
        component.setState({ showOverlay: true });

        component.find('Overlay[name="confirmationOverlay"]').simulate('hide');

        expect(component.state('showOverlay')).toBeFalsy();
    });

    it('should change the Popover\'s title depending on the type of item being removed', () => {
        const i18n = jest.requireMock('i18next');
        i18n.t = str => str;

        // When the view is a section
        mockIsSection = true;
        mockIsContainedView = false;

        let component = shallow(<CarouselButtons {...placeholderProps} />);

        expect(component.find('Popover#popov').prop('title')).toEqual('delete_section');

        // When the view is a contained view
        mockIsSection = false;
        mockIsContainedView = true;

        component = shallow(<CarouselButtons {...placeholderProps} />);

        expect(component.find('Popover#popov').prop('title')).toEqual('delete_contained_canvas');

        // When the view is none of the above
        mockIsSection = false;
        mockIsContainedView = false;

        component = shallow(<CarouselButtons {...placeholderProps} />);

        expect(component.find('Popover#popov').prop('title')).toEqual('delete_page');
    });

    it('should warn about marks removed when deleting a non-orphan contained view', () => {
        const i18n = jest.requireMock('i18next');
        i18n.t = str => str;

        mockIsSection = true;
        mockIsContainedView = false;

        const component = shallow(<CarouselButtons {...placeholderProps} />);

        expect(component.find('Popover#popov').children().at(1).text()).toEqual('messages.delete_section');

        mockIsSection = false;
        mockIsContainedView = true;
        component.instance().canDeleteContainedView = jest.fn(() => false).mockName('canDeleteContainedView');

        component.setState({}); // Force re-render, as .update() doesn't work apparently, see https://github.com/airbnb/enzyme/issues/622

        expect(component.find('Popover#popov').children().at(1).text()).toEqual('messages.delete_busy_cv');

        mockIsSection = false;
        mockIsContainedView = false;

        component.setState({}); // Fore re-render again

        expect(component.find('Popover#popov').children().at(1).text()).toEqual('messages.delete_page');
    });

    it('should disable the "Cancel" button when there\'s no view selected', () => {
        const component = shallow(<CarouselButtons {...placeholderProps}
            indexSelected={0} />);

        expect(component.find('Button[name="popoverCancelButton"]').prop('disabled')).toBeTruthy();
    });

    it('should hide the popover when the "Cancel" button is clicked', () => {
        const component = shallow(<CarouselButtons {...placeholderProps} />);

        // Explicitly set state.showOverlay to true before clicking
        component.setState({ showOverlay: true });

        component.find('Button[name="popoverCancelButton"]').simulate('click');

        expect(component.state.showOverlay).toBeFalsy();
    });

    it('should disable the "Accept" button when there\'s no view selected', () => {
        const component = shallow(<CarouselButtons {...placeholderProps}
            indexSelected={0} />);

        expect(component.find('Button[name="popoverAcceptButton"]').prop('disabled')).toBeTruthy();
    });

    it('should deselect the view and hide the popover when the "Accept" button is clicked and no view is selected', () => {
        const component = shallow(<CarouselButtons {...placeholderProps}
            indexSelected={0} />);

        // Explicitly set state.showOverlay to true before clicking
        component.setState({ showOverlay: true });

        component.find('Button[name="popoverAcceptButton"]').simulate('click');

        expect(mockFunctions.onIndexSelected).toHaveBeenCalledWith(0);
        expect(component.state.showOverlay).toBeFalsy();
    });

    it('should delete the view and hide the popover when the "Accept" button is clicked and there\'s a section selected', () => {
        const component = shallow(<CarouselButtons {...placeholderProps}
            indexSelected={'42'} />);

        // Explicitly set state.showOverlay to true before clicking
        component.setState({ showOverlay: true });

        mockIsSection = false;
        mockIsContainedView = true;
        component.find('Button[name="popoverAcceptButton"]').simulate('click');

        expect(mockFunctions.onContainedViewDeleted).toHaveBeenCalledWith('42');
        expect(mockFunctions.onIndexSelected).toHaveBeenCalledWith(0);
        expect(component.state.showOverlay).toBeFalsy();
    });

    it('should delete the view and hide the popover when the "Accept" button is clicked and there\'s a contained view selected', () => {
        const component = shallow(<CarouselButtons {...placeholderProps}
            indexSelected={'42'} />);

        // Explicitly set state.showOverlay to true before clicking
        component.setState({ showOverlay: true });

        mockIsSection = true;
        mockIsContainedView = false;
        component.find('Button[name="popoverAcceptButton"]').simulate('click');

        expect(mockFunctions.onNavItemDeleted).toHaveBeenCalledWith('42');
        expect(mockFunctions.onIndexSelected).toHaveBeenCalledWith(0);
        expect(component.state.showOverlay).toBeFalsy();
    });
});
