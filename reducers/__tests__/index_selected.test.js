import index_selected from '../index_selected';
import * as types from '../../common/actions';
import * as prefixes from '../../common/constants';

let random = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;

describe('index_selected reducer', ()=>{

    it('should return 0 as default initial state', () => {
        // setup
        let action = { type: 'unknown' };
        // execute
        let newState = index_selected(0, action);

        expect(newState).toEqual(0);
    });
    describe('should delete nav item and return 0', () => {
        it('handle DELETE_NAV_ITEM', () => {
            // setup
            let action = { type: types.DELETE_NAV_ITEM }; // TODO: change for deleteNavItem('', '', '', '', '')

            // execute
            let newState = index_selected(undefined, action);

            expect(newState).toEqual(0);

        });
    });

    describe('should add nav item (handle ADD_NAV_ITEM)', () => {
        it('should add CONTAINED_VIEW ', () => {
            let random_cv = prefixes.ID_PREFIX_CONTAINED_VIEW + random;
            // setup
            let action = {
                type: types.ADD_NAV_ITEM,
                payload: { id: random_cv },
            };
            // execute
            let newState = index_selected(undefined, action);

            expect(newState).toEqual(random_cv);
        });
    });

    describe('should select nav item ', () => {
        // state = 0
        it('handle SELECT_NAV_ITEM', () => {
            // setup
            let action = { type: types.SELECT_NAV_ITEM };
            // execute
            let newState = index_selected(undefined, action);

            expect(newState).toEqual(0); // return state, now is 0
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
            let newState = index_selected(undefined, action);

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
            let newState = index_selected(undefined, action);

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
            let newState = index_selected(undefined, action);

            expect(newState).toEqual(random_slide);
        });
        // TODO:select a CV
    });

    describe('should import state and return 0 ', () => {
        it('handle IMPORT_STATE', () => {
            // setup
            let action = { type: types.IMPORT_STATE };
            // execute
            let newState = index_selected(undefined, action);

            expect(newState).toEqual(0);
        });
    });

});

