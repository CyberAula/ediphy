import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_CONTAINED_VIEW, ID_PREFIX_SORTABLE_CONTAINER } from '../../common/constants';

export default function(initialState, reducer) {
    return {
        state: initialState,
        call: function(action) {
            this.state = reducer(this.state, action);
        },
        clean: function() {
            this.state = initialState;
        },
        set: function(state) {
            this.state = state;
        },
        getBox: function(id) {
            if(id) {
                return ID_PREFIX_BOX + id;
            }
            return ID_PREFIX_BOX + this.getRandomInt(10000, 100000);
        },
        getSortableBox: function(id) {
            if(id) {
                return ID_PREFIX_SORTABLE_BOX + id;
            }
            return ID_PREFIX_SORTABLE_BOX + this.getRandomInt(10000, 100000);
        },
        getSortableContainer: function(id) {
            if(id) {
                return ID_PREFIX_SORTABLE_CONTAINER + id;
            }
            return ID_PREFIX_SORTABLE_CONTAINER + this.getRandomInt(10000, 100000);
        },
        getContainedView: function(id) {
            if(id) {
                return ID_PREFIX_CONTAINED_VIEW + id;
            }
            return ID_PREFIX_CONTAINED_VIEW + this.getRandomInt(10000, 100000);
        },
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
    };
}
