import { testState } from '../../core/store/state.tests.js';
import index_selected from '../index_selected';
import * as ActionTypes from '../../common/actions';

const initstate = testState;

describe('# index_selected reducer', ()=>{

    test('should return testState as initial state', () => {
        expect(index_selected(initstate, {})).toEqual(initstate);
    });

    test('Delete navigation item', () => {
        const action = { type: ActionTypes.DELETE_NAV_ITEM };
        expect(index_selected(initstate, action)).toEqual(0);
    });

    test('Add navigation item', () => {
        const action = { type: ActionTypes.ADD_NAV_ITEM, payload: { id: 'pa-1511252985429' } };
        expect(index_selected(initstate, action)).toEqual('pa-1511252985429');

    });

    test('Select navigation item', () => {
        const action = { type: ActionTypes.SELECT_NAV_ITEM, payload: { id: 'pa-1497983247795' } };
        expect(index_selected(initstate, action)).toEqual(initstate);

    });

    describe('should select nav item ', () => {
        let cv = 'cv-1511252975055';
        it('handle SELECT_NAV_ITEM', () => {
            // setup
            let action = {
                type: ActionTypes.SELECT_NAV_ITEM,
                payload: { id: cv },
            };
                // ActionTypes.selectNavItem('cv-1511252975055') ;
            // execute
            let newState = index_selected(cv, action);
            // console.log(newState);

            expect(newState).toEqual(action.payload.id); // return state, now is 0
        });

        // TODO:select a specific NAV ITEM

    });

    describe('should select an item (handle INDEX_SELECT)', () => {
        it('should select a PAGE', () => {
            let random_page = 'pa-1497983247795';
            // setup
            let action = {
                type: ActionTypes.INDEX_SELECT,
                payload: { id: random_page },
            };
            // execute
            let newState = index_selected(undefined, action);

            expect(newState).toEqual(random_page);
        });
        it('should select a SECTION', () => {
            let random_section = 'se-1467887497411';
            // setup
            let action = {
                type: ActionTypes.INDEX_SELECT,
                payload: { id: random_section },
            };
            // execute
            let newState = index_selected(undefined, action);

            expect(newState).toEqual(random_section);
        });
        it('should select a SLIDE', () => {
            let random_slide = 'pa-1511252955865';
            // setup
            let action = {
                type: ActionTypes.INDEX_SELECT,
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
            let action = { type: ActionTypes.IMPORT_STATE };
            // execute
            let newState = index_selected(initstate, action);

            expect(newState).toEqual(0);
        });
    });

});

