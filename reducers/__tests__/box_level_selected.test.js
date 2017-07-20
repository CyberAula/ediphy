import reducer from '../box_level_selected';
import {ADD_BOX, INCREASE_LEVEL, SELECT_BOX, SELECT_NAV_ITEM, DELETE_NAV_ITEM} from '../../actions';
import {ID_PREFIX_SORTABLE_BOX} from '../../constants';

describe('box_level_selected reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(0)
  });

  it('should handle ADD_BOX', () => {
    expect(reducer(undefined, {type: ADD_BOX})).toEqual(0);
    for (var i = 0; i < 10; i++) {
      expect(reducer(i, {type: ADD_BOX})).toEqual(0);
    }
  });

  it('should handle INCREASE_LEVEL', () => {
    for (var i = 0; i < 10; i++) {
      reducer(i, {type: INCREASE_LEVEL});
    }
    expect(reducer(i, {type: INCREASE_LEVEL})).toEqual(i + 1);
  });

  it('should handle DELETE_NAV_ITEM', () => {
    for (var i = 0; i < 10; i++) {
      expect(reducer(i, {type: DELETE_NAV_ITEM})).toEqual(0);
    }
  });

  it('should handle SELECT_BOX', () => {
    let state = 0;
    expect(reducer(undefined, {type: SELECT_BOX, payload:{id:-1}})).toEqual(0);
    expect(reducer(undefined, {type: SELECT_BOX, payload:{id:"85584"}})).toEqual(0);
    expect(reducer(undefined, {type: SELECT_BOX, payload:{id:"bg6565"}})).toEqual(0);
    expect(reducer(undefined, {type: SELECT_BOX, payload:{id:ID_PREFIX_SORTABLE_BOX + "2"}})).toEqual(-1);

    reducer(state++, {type: INCREASE_LEVEL});
    reducer(state++, {type: INCREASE_LEVEL});
    expect(reducer(state, {type: SELECT_BOX, payload:{id:"85584"}})).toEqual(state);

  });

  it('should handle SELECT_NAV_ITEM', () => {
    expect(reducer(undefined, {type: SELECT_NAV_ITEM})).toEqual(0);
  });
})
