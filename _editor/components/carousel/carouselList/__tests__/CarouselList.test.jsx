import React from 'react';
import expect from 'expect';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

let CarouselList;

// Dependencies' mocks
let mockIsPage;
let mockIsSection;
let mockIsSlide;

jest.mock('../../../../../locales/i18n', () => {});

jest.mock('i18next', () => ({
    t: jest.fn(() => 'i18n string').mockName('i18n.t'),
}));

beforeEach(() => {
    mockIsPage = true;
    mockIsSection = false;
    mockIsSlide = false;

    jest.mock('../../../../../common/utils', () => ({
        isPage: () => mockIsPage,
        isSection: () => mockIsSection,
        isSlide: () => mockIsSlide,
    }));

    CarouselList = jest.requireActual('../CarouselList').default;

    // Forget about any mock function being called previously
    jest.clearAllMocks();
});

// Unit test's mocks
const mockFunctions = {
    onBoxAdded: jest.fn().mockName('onBoxAdded'),
    onContainedViewNameChanged: jest.fn().mockName('onContainedViewNameChanged'),
    onContainedViewSelected: jest.fn().mockName('onContainedViewSelected'),
    onIndexSelected: jest.fn().mockName('onIndexSelected'),
    onNavItemAdded: jest.fn().mockName('onNavItemAdded'),
    onNavItemExpanded: jest.fn().mockName('onNavItemExpanded'),
    onNavItemNameChanged: jest.fn().mockName('onNavItemNameChanged'),
    onNavItemReordered: jest.fn().mockName('onNavItemReordered'),
    onNavItemSelected: jest.fn().mockName('onNavItemReordered'),
};

const placeholderProps = {
    carouselShow: true,
    containedViews: { 'cv-42': { name: 'CV_MOCK' } },
    containedViewSelected: 'cv-42',
    id: 0,
    indexSelected: '42',
    navItems: {},
    navItemSelected: '42',
    navItemsIds: [],
    viewToolbars: {
        'cv-42': { viewName: 'VN_CV_MOCK' },
    },
    ...mockFunctions,
};

describe('CarouselList - General', () => {
    it('should render with required props', () => {
        const component = mount(<CarouselList {...placeholderProps} />);

        expect(shallowToJson(component)).toMatchSnapshot();
    });

    it('should render just a line break if the carousel isn\'t shown', () => {
        const component = mount(<CarouselList {...placeholderProps}
            carouselShow={false} />);

        expect(shallowToJson(component)).toMatchSnapshot();
    });
});

describe('CarouselList - getContentHeight()', () => {
    it('should return "50px" if both sortable items and contained view aren\'t shown', () => {
        const component = shallow(<CarouselList {...placeholderProps} />);

        component.setState({
            showSortableItems: false,
            showContainedViews: false,
        });

        expect(component.instance().getContentHeight()).toEqual('50px');
    });

    it('should return "calc(100% - 124px)" if sortable items are shown but contained views aren\'t', () => {
        const component = shallow(<CarouselList {...placeholderProps} />);

        component.setState({
            showSortableItems: true,
            showContainedViews: false,
        });

        expect(component.instance().getContentHeight()).toEqual('calc(100% - 124px)');
    });

    it('should return "calc(50%)" if sortable items aren\'t shown but contained views are', () => {
        const component = shallow(<CarouselList {...placeholderProps} />);

        component.setState({
            showSortableItems: true,
            showContainedViews: true,
        });

        expect(component.instance().getContentHeight()).toEqual('calc(50%)');
    });

    it('should return "calc(100% - 124px)" otherwise', () => {
        const component = shallow(<CarouselList {...placeholderProps} />);

        component.setState({
            showSortableItems: false,
            showContainedViews: true,
        });

        expect(component.instance().getContentHeight()).toEqual('calc(100% - 124px)');
    });
});

describe('CarouselList - jQuery sortable', () => {
    it('should destroy the sortable when unmounting', () => {
        // Mock jQuery to make sure the proper methods are called
        const jQuerySortable = jest.fn().mockName('jQuery.sortable');
        global.jQuery = jest.fn(() => ({
            sortable: jQuerySortable,
        })).mockName('jQuery');

        const component = shallow(<CarouselList {...placeholderProps} />);

        component.instance().refs = { sortableList: 'mockedRef' };
        component.unmount();

        expect(global.jQuery).toHaveBeenCalledWith('mockedRef');
        expect(jQuerySortable).toHaveBeenCalledWith('destroy');
    });
});

describe('CarouselList - Sortable items', () => {
    it('should show an upside-down arrow in the index button if the sortable items are shown', () => {
        const component = shallow(<CarouselList {...placeholderProps} />);
        component.setState({ showSortableItems: true });

        const icon = component.find('#sortablesCollapse .material-icons');

        expect(icon.text()).toEqual('arrow_drop_down');
        expect(icon.prop('style').fontSize).toEqual('22px');
    });

    it('should show a right arrow in the index button if the sortable items aren\'t shown', () => {
        const component = shallow(<CarouselList {...placeholderProps} />);
        component.setState({ showSortableItems: false });

        const icon = component.find('#sortablesCollapse .material-icons');

        expect(icon.text()).toEqual('play_arrow');
        expect(icon.prop('style').fontSize).toEqual('15px');
        expect(icon.prop('style').marginLeft).toEqual('2px');
        expect(icon.prop('style').marginRight).toEqual('2px');
    });

    it('should toggle the sortable items list when the index button is clicked', () => {
        const component = shallow(<CarouselList {...placeholderProps} />);

        component.setState({ showSortableItems: true });
        component.find('#sortablesCollapse').simulate('click');
        expect(component.state('showSortableItems')).toBeFalsy();

        component.setState({ showSortableItems: false });
        component.find('#sortablesCollapse').simulate('click');
        expect(component.state('showSortableItems')).toBeTruthy();
    });

    it('should hide the list when showSortableItems = false', () => {
        const component = shallow(<CarouselList {...placeholderProps} />);

        component.setState({ showSortableItems: false });

        expect(component.find('.carList').prop('style')).toHaveProperty('height', '0px');
    });

    it('should show the list when showSortableItems = true', () => {
        const component = shallow(<CarouselList {...placeholderProps} />);

        component.setState({ showSortableItems: true });

        expect(component.find('.carList').prop('style')).not.toHaveProperty('height', '0px');
    });

    it('should deselect any item when an empty area of the list is clicked', () => {
        const component = shallow(<CarouselList {...placeholderProps} />);

        const stopPropagation = jest.fn().mockName('stopPropagation');
        component.find('.carList').simulate('click', { stopPropagation: stopPropagation });

        expect(mockFunctions.onIndexSelected).toHaveBeenCalledWith(placeholderProps.id);
        expect(stopPropagation).toHaveBeenCalled();
    });

    it('should create a new section entry for every child of type "section" in the list\'s navItem', () => {
        const mockedChildren = ['se-1', 'se-2'];

        mockIsPage = false;
        mockIsSection = true;
        mockIsSlide = false;

        const component = shallow(<CarouselList {...placeholderProps}
            navItems={{
                [placeholderProps.id]: {
                    children: mockedChildren,
                    level: 1,
                },
            }} />);

        expect(component.find('Section')).toHaveLength(mockedChildren.length);
    });

    it('should create a new page entry for every child of type "page" in the list\'s navItem', () => {
        const mockedChildren = ['pa-1', 'pa-2'];

        // This is required as we are going to change the navItems, otherwise
        // CarouselList will break while rendering.
        const requiredViewToolbars = {
            [placeholderProps.containedViewSelected]: { viewName: 'VN_MOCK_0' },
            [mockedChildren[0]]: { viewName: 'VN_MOCK_1' },
            [mockedChildren[1]]: { viewName: 'VN_MOCK_2' },
        };

        mockIsPage = true;
        mockIsSection = false;
        mockIsSlide = false;

        const component = shallow(<CarouselList {...placeholderProps}
            navItems={{
                [placeholderProps.id]: {
                    children: mockedChildren,
                    level: 1,
                    name: '',
                },
                [mockedChildren[0]]: {
                    children: [],
                    level: 2,
                    parent: placeholderProps.id,
                    name: '',
                },
                [mockedChildren[1]]: {
                    children: [],
                    level: 2,
                    parent: placeholderProps.id,
                    name: '',
                },
            }}
            viewToolbars={{ ...requiredViewToolbars }} />);

        expect(component.find('.connectedSortables .navItemBlock')).toHaveLength(mockedChildren.length);
    });

    it('shouldn\'t create anything otherwise', () => {
        const mockedChildren = ['se-1', 'se-2'];
        const requiredViewToolbars = {
            [placeholderProps.containedViewSelected]: { viewName: 'VN_MOCK_0' },
            [mockedChildren[0]]: { viewName: 'VN_MOCK_1' },
            [mockedChildren[1]]: { viewName: 'VN_MOCK_2' },
        };
        mockIsPage = false;
        mockIsSection = false;
        mockIsSlide = false;

        const component = shallow(<CarouselList {...placeholderProps}
            navItems={{
                [placeholderProps.id]: {
                    children: mockedChildren,
                    level: 1,
                },
            }}
            viewToolbars={{ ...requiredViewToolbars }} />);

        expect(component.find('.carlist').children()).toHaveLength(0);
    });

    it('should set the proper classes for the page depending on the current selections', () => {
        const mockedChildren = ['pa-1', 'pa-2', 'pa-3'];
        const requiredViewToolbars = {
            [placeholderProps.containedViewSelected]: { viewName: 'VN_MOCK_0' },
            [mockedChildren[0]]: { viewName: 'VN_MOCK_1' },
            [mockedChildren[1]]: { viewName: 'VN_MOCK_2' },
            [mockedChildren[2]]: { viewName: 'VN_MOCK_3' },
        };
        mockIsPage = true;
        mockIsSection = false;
        mockIsSlide = false;

        const component = shallow(<CarouselList {...placeholderProps}
            navItems={{
                [placeholderProps.id]: {
                    children: mockedChildren,
                    level: 1,
                    name: '',
                },
                [mockedChildren[0]]: {
                    children: [],
                    level: 2,
                    parent: placeholderProps.id,
                    name: '',
                },
                [mockedChildren[1]]: {
                    children: [],
                    level: 2,
                    parent: placeholderProps.id,
                    name: '',
                },
                [mockedChildren[2]]: {
                    children: [],
                    level: 2,
                    parent: placeholderProps.id,
                    name: '',
                },
            }}
            navItemSelected={mockedChildren[0]}
            indexSelected={mockedChildren[1]}
            viewToolbars={{ ...requiredViewToolbars }} />);

        expect(component.find(`.connectedSortables .navItemBlock#${mockedChildren[0]}`).hasClass('selected')).toBeTruthy();
        expect(component.find(`.connectedSortables .navItemBlock#${mockedChildren[1]}`).hasClass('classIndexSelected')).toBeTruthy();
        expect(component.find(`.connectedSortables .navItemBlock#${mockedChildren[2]}`).hasClass('notSelected')).toBeTruthy();
        expect(component.find(`.connectedSortables .navItemBlock#${mockedChildren[2]}`).hasClass('classIndexSelected')).toBeFalsy();
    });

    it('should set the page\'s icon accordingly if it doesn\'t have a custom size and it\'s a slide', () => {
        const mockedChildren = ['pa-1'];
        const requiredViewToolbars = {
            [placeholderProps.containedViewSelected]: { viewName: 'VN_MOCK_0' },
            [mockedChildren[0]]: { viewName: 'VN_MOCK_1' },
        };
        mockIsPage = true;
        mockIsSection = false;
        mockIsSlide = true;

        const component = shallow(<CarouselList {...placeholderProps}
            navItems={{
                [placeholderProps.id]: {
                    children: mockedChildren,
                    level: 1,
                    name: '',
                },
                [mockedChildren[0]]: {
                    children: [],
                    level: 2,
                    parent: placeholderProps.id,
                    name: '',
                    customSize: 0,
                },
            }}
            viewToolbars={{ ...requiredViewToolbars }} />);

        expect(component.find(`#${mockedChildren[0]} i.fileIcon`).text()).toBe('slideshow');
    });

    it('should set the page\'s icon accordingly if it doesn\'t have a custom size and it isn\'t a slide', () => {
        const mockedChildren = ['pa-1'];
        const requiredViewToolbars = {
            [placeholderProps.containedViewSelected]: { viewName: 'VN_MOCK_0' },
            [mockedChildren[0]]: { viewName: 'VN_MOCK_1' },
        };
        mockIsPage = true;
        mockIsSection = false;
        mockIsSlide = false;

        const component = shallow(<CarouselList {...placeholderProps}
            navItems={{
                [placeholderProps.id]: {
                    children: mockedChildren,
                    level: 1,
                    name: '',
                },
                [mockedChildren[0]]: {
                    children: [],
                    level: 2,
                    parent: placeholderProps.id,
                    name: '',
                    customSize: 0,
                },
            }}
            viewToolbars={{ ...requiredViewToolbars }} />);

        expect(component.find(`#${mockedChildren[0]} i.fileIcon`).text()).toBe('insert_drive_file');
    });

    it('should set the page\'s icon accordingly if it has a custom size', () => {
        const mockedChildren = ['pa-1'];
        const requiredViewToolbars = {
            [placeholderProps.containedViewSelected]: { viewName: 'VN_MOCK_0' },
            [mockedChildren[0]]: { viewName: 'VN_MOCK_1' },
        };
        mockIsPage = true;
        mockIsSection = false;
        mockIsSlide = false;

        const component = shallow(<CarouselList {...placeholderProps}
            navItems={{
                [placeholderProps.id]: {
                    children: mockedChildren,
                    level: 1,
                    name: '',
                },
                [mockedChildren[0]]: {
                    children: [],
                    level: 2,
                    parent: placeholderProps.id,
                    name: '',
                    customSize: 42,
                },
            }}
            viewToolbars={{ ...requiredViewToolbars }} />);

        expect(component.find(`#${mockedChildren[0]} img.svgIcon`)).not.toHaveLength(0);
    });

    it('should select a page when it\'s clicked down', () => {
        const mockedChildren = ['pa-1'];
        const requiredViewToolbars = {
            [placeholderProps.containedViewSelected]: { viewName: 'VN_MOCK_0' },
            [mockedChildren[0]]: { viewName: 'VN_MOCK_1' },
        };
        mockIsPage = true;
        mockIsSection = false;
        mockIsSlide = false;

        const component = shallow(<CarouselList {...placeholderProps}
            navItems={{
                [placeholderProps.id]: {
                    children: mockedChildren,
                    level: 1,
                    name: '',
                },
                [mockedChildren[0]]: {
                    children: [],
                    level: 2,
                    parent: placeholderProps.id,
                    name: '',
                },
            }}
            viewToolbars={{ ...requiredViewToolbars }} />);

        const stopPropagation = jest.fn().mockName('stopPropagation');
        component.find(`.connectedSortables .navItemBlock#${mockedChildren[0]}`).simulate('mousedown', { stopPropagation: stopPropagation });

        expect(mockFunctions.onIndexSelected).toHaveBeenCalledWith(mockedChildren[0]);
        expect(stopPropagation).toHaveBeenCalled();
    });

    it('should select a page when it\'s clicked', () => {
        const mockedChildren = ['pa-1'];
        const requiredViewToolbars = {
            [placeholderProps.containedViewSelected]: { viewName: 'VN_MOCK_0' },
            [mockedChildren[0]]: { viewName: 'VN_MOCK_1' },
        };
        mockIsPage = true;
        mockIsSection = false;
        mockIsSlide = false;

        const component = shallow(<CarouselList {...placeholderProps}
            navItems={{
                [placeholderProps.id]: {
                    children: mockedChildren,
                    level: 1,
                    name: '',
                },
                [mockedChildren[0]]: {
                    children: [],
                    level: 2,
                    parent: placeholderProps.id,
                    name: '',
                },
            }}
            viewToolbars={{ ...requiredViewToolbars }} />);

        const stopPropagation = jest.fn().mockName('stopPropagation');
        component.find(`.connectedSortables .navItemBlock#${mockedChildren[0]}`).simulate('click', { stopPropagation: stopPropagation });

        expect(mockFunctions.onIndexSelected).toHaveBeenCalledWith(mockedChildren[0]);
        expect(stopPropagation).toHaveBeenCalled();
    });

    it('should select a navItem when it\'s double clicked', () => {
        const mockedChildren = ['pa-1'];
        const requiredViewToolbars = {
            [placeholderProps.containedViewSelected]: { viewName: 'VN_MOCK_0' },
            [mockedChildren[0]]: { viewName: 'VN_MOCK_1' },
        };
        mockIsPage = true;
        mockIsSection = false;
        mockIsSlide = false;

        const component = shallow(<CarouselList {...placeholderProps}
            navItems={{
                [placeholderProps.id]: {
                    children: mockedChildren,
                    level: 1,
                    name: '',
                },
                [mockedChildren[0]]: {
                    children: [],
                    level: 2,
                    parent: placeholderProps.id,
                    name: '',
                },
            }}
            viewToolbars={{ ...requiredViewToolbars }} />);

        const stopPropagation = jest.fn().mockName('stopPropagation');
        component.find(`.connectedSortables .navItemBlock#${mockedChildren[0]}`).simulate('dblclick', { stopPropagation: stopPropagation });

        expect(mockFunctions.onNavItemSelected).toHaveBeenCalledWith(mockedChildren[0]);
        expect(stopPropagation).toHaveBeenCalled();
    });
});

describe('CarouselList - Contained views', () => {
    it('should show an upside-down arrow in the index button if the containd views items are shown', () => {
        const component = shallow(<CarouselList {...placeholderProps} />);
        component.setState({ showContainedViews: true });

        const icon = component.find('#scontainedViewsCollapse .material-icons');

        expect(icon.text()).toEqual('arrow_drop_down');
        expect(icon.prop('style').fontSize).toEqual('22px');
    });

    it('should show a right arrow in the index button if the containd views items aren\'t shown', () => {
        const component = shallow(<CarouselList {...placeholderProps} />);
        component.setState({ showContainedViews: false });

        const icon = component.find('#scontainedViewsCollapse .material-icons');

        expect(icon.text()).toEqual('play_arrow');
        expect(icon.prop('style')).toHaveProperty('fontSize', '15px');
        expect(icon.prop('style')).toHaveProperty('marginLeft', '2px');
        expect(icon.prop('style')).toHaveProperty('marginRight', '2px');
    });

    it('should toggle the sortable items list when the index button is clicked', () => {
        const component = shallow(<CarouselList {...placeholderProps} />);

        component.setState({ showContainedViews: true });
        component.find('#scontainedViewsCollapse').simulate('click');
        expect(component.state('showContainedViews')).toBeFalsy();

        component.setState({ showContainedViews: false });
        component.find('#scontainedViewsCollapse').simulate('click');
        expect(component.state('showContainedViews')).toBeTruthy();
    });

    it('should show the empty list message when there are no contained views', () => {
        const component = shallow(<CarouselList {...placeholderProps}
            containedViews={{}} />);

        expect(component.find('.empty-info').prop('style')).toHaveProperty('display', 'block');
    });

    it('shouldn\'t show the empty list message when there are contained views', () => {
        const fakeCV = { name: 'mock' };
        const mockedCVs = { 1: fakeCV, 2: fakeCV, 3: fakeCV };
        const requiredViewToolbars = {
            [placeholderProps.containedViewSelected]: { viewName: 'VN_MOCK_0' },
            1: { viewName: 'VN_MOCK_1' },
            2: { viewName: 'VN_MOCK_2' },
            3: { viewName: 'VN_MOCK_3' },
        };

        const component = shallow(<CarouselList {...placeholderProps}
            containedViews={{ ...mockedCVs }}
            viewToolbars={{ ...requiredViewToolbars }} />);

        expect(component.find('.empty-info').prop('style')).toHaveProperty('display', 'none');
    });

    it('should create a new contained view entry for every contained view in the props', () => {
        const fakeCV = { name: 'mock' };
        const mockedCVs = { 1: fakeCV, 2: fakeCV, 3: fakeCV };
        const requiredViewToolbars = {
            [placeholderProps.containedViewSelected]: { viewName: 'VN_MOCK_0' },
            1: { viewName: 'VN_MOCK_1' },
            2: { viewName: 'VN_MOCK_2' },
            3: { viewName: 'VN_MOCK_3' },
        };

        const component = shallow(<CarouselList {...placeholderProps}
            containedViews={mockedCVs}
            viewToolbars={{ ...requiredViewToolbars }} />);

        expect(component.find('.containedViewsList .navItemBlock')).toHaveLength(Object.keys(mockedCVs).length);
    });

    it('should indicate in the entry\'s classes if the contained view is selected', () => {
        const component = shallow(<CarouselList {...placeholderProps}
            containedViews={{ 'cv-42': { name: 'mock' } }}
            viewToolbars={{ 'cv-42': { viewName: 'VN_MOCK' } }}
            indexSelected={'cv-42'} />);

        expect(component.find('.containedViewsList .navItemBlock').hasClass('classIndexSelected')).toBeTruthy();
    });

    it('shouldn\'t add the selected class to the entry if the contained view isn\'t selected', () => {
        const component = shallow(<CarouselList {...placeholderProps}
            containedViews={{ 'cv-42': { name: 'mock' } }}
            indexSelected={'cv-314'} />);

        expect(component.find('.containedViewsList .navItemBlock').hasClass('classIndexSelected')).toBeFalsy();
    });

    it('should use lighter colors in the selected entry', () => {
        const component = shallow(<CarouselList {...placeholderProps}
            containedViews={{ 'cv-42': { name: 'mock' } }}
            containedViewSelected={'cv-42'} />);

        expect(component.find('.containedViewsList .navItemBlock').prop('style')).toHaveProperty('color', 'white');
        expect(component.find('.containedViewsList .navItemBlock').prop('style')).toHaveProperty('backgroundColor', '#222');
    });

    it('should use darker colors in the entries that aren\'t selected', () => {
        const component = shallow(<CarouselList {...placeholderProps}
            containedViews={{ 'cv-42': { name: 'mock' } }}
            containedViewSelected={'cv-314'} />);

        expect(component.find('.containedViewsList .navItemBlock').prop('style')).toHaveProperty('color', '#9A9A9A');
        expect(component.find('.containedViewsList .navItemBlock').prop('style')).toHaveProperty('backgroundColor', 'transparent');
    });

    it('should set the contained views\'s icon accordingly if it\'s a slide', () => {
        mockIsPage = false;
        mockIsSection = false;
        mockIsSlide = true;

        const component = shallow(<CarouselList {...placeholderProps}
            containedViews={{ 'cv-42': { name: 'mock' } }} />);

        expect(component.find('.containedViewsList .navItemBlock i.material-icons').text()).toBe('slideshow');
    });

    it('should set the contained views\'s icon accordingly if it isn\'t a slide', () => {
        mockIsPage = false;
        mockIsSection = false;
        mockIsSlide = false;

        const component = shallow(<CarouselList {...placeholderProps}
            containedViews={{ 'cv-42': { name: 'mock' } }} />);

        expect(component.find('.containedViewsList .navItemBlock i.material-icons').text()).toBe('insert_drive_file');
    });

    it('should set a contained view as the selected index when it\'s clicked', () => {
        const fakeCVid = 'cv-42';
        const component = shallow(<CarouselList {...placeholderProps}
            containedViews={{ [fakeCVid]: { name: 'mock' } }} />);

        const stopPropagation = jest.fn().mockName('stopPropagation');
        component.find('.containedViewsList .navItemBlock').simulate('click', { stopPropagation: stopPropagation });

        expect(mockFunctions.onIndexSelected).toHaveBeenCalledWith(fakeCVid);
        expect(stopPropagation).toHaveBeenCalled();
    });

    it('should select a contained view when it\'s double clicked', () => {
        const fakeCVid = 'cv-42';
        const component = shallow(<CarouselList {...placeholderProps}
            containedViews={{ [fakeCVid]: { name: 'mock' } }} />);

        const stopPropagation = jest.fn().mockName('stopPropagation');
        component.find('.containedViewsList .navItemBlock').simulate('dblclick', { stopPropagation: stopPropagation });

        expect(mockFunctions.onContainedViewSelected).toHaveBeenCalledWith(fakeCVid);
        expect(stopPropagation).toHaveBeenCalled();
    });
});
