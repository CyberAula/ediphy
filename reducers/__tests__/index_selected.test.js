import { testState } from '../../core/store/state.tests.js';
import index_selectedReducer from '../index_selected';
import * as types from '../../common/actions';
import * as prefixes from '../../common/constants';

let initstate = testState;
// console.log(initstate);

let random = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;

describe('index_selected reducer', ()=>{

    it('should return testState as default initial state', () => {

        // execute
        let newState = index_selectedReducer(initstate, {});

        expect(newState).toEqual(initstate);
    });

    describe('should delete nav item and return 0', () => {
        it('handle DELETE_NAV_ITEM', () => {
            // setup
            let action = { type: types.DELETE_NAV_ITEM }; // TODO: change for deleteNavItem(ids, parent, boxes, containedViews, linkedBoxes)

            // execute
            let newState = index_selectedReducer(initstate, action);

            expect(newState).toEqual(0);

        });
    });

    describe('should add nav item (handle ADD_NAV_ITEM)', () => {
        it('should add CONTAINED_VIEW ', () => {
            let cv = 'cv-1511252975056';
            // setup
            let action = {
                type: types.ADD_NAV_ITEM,
                payload: { id: cv },
            };
            // execute
            let newState = index_selectedReducer(initstate, action);
            // console.log(newState);

            expect(newState).toEqual(action.payload.id);
        });
    });

    describe('should select nav item ', () => {
        let cv = 'cv-1511252975055';
        it('handle SELECT_NAV_ITEM', () => {
            // setup
            let action = {
                type: types.SELECT_NAV_ITEM,
                payload: { id: cv },
            };
                // types.selectNavItem('cv-1511252975055') ;
            // execute
            let newState = index_selectedReducer(cv, action);
            // console.log(newState);

            expect(newState).toEqual(action.payload.id); // return state, now is 0
        });

        // TODO:select a specific NAV ITEM

    });

    describe('should select an item (handle INDEX_SELECT)', () => {
        it('should select a PAGE', () => {
            let random_page = prefixes.ID_PREFIX_PAGE + random;
            // setup
            let action = {
                type: types.INDEX_SELECT,
                payload: { id: random_page },
            };
            // execute
            let newState = index_selectedReducer(undefined, action);

            expect(newState).toEqual(random_page);
        });
        it('should select a SECTION', () => {
            let random_section = prefixes.ID_PREFIX_SECTION + random;
            // setup
            let action = {
                type: types.INDEX_SELECT,
                payload: { id: random_section },
            };
            // execute
            let newState = index_selectedReducer(undefined, action);

            expect(newState).toEqual(random_section);
        });
        it('should select a SLIDE', () => {
            let random_slide = prefixes.ID_PREFIX_SLIDE + random;
            // setup
            let action = {
                type: types.INDEX_SELECT,
                payload: { id: random_slide },
            };
            // execute
            let newState = index_selectedReducer(undefined, action);

            expect(newState).toEqual(random_slide);
        });
        // TODO:select a CV
    });

    describe('should import state and return 0 ', () => {
        it('handle IMPORT_STATE', () => {
            // setup
            let action = { type: types.IMPORT_STATE };
            // execute
            let newState = index_selectedReducer(initstate, action);

            expect(newState).toEqual(0);
        });
    });

});

