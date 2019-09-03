export function navItemCreator(state = {}, action = {}) {
    return {
        id: action.payload.id,
        isExpanded: true,
        parent: action.payload.parent,
        children: [],
        boxes: action.payload.type === "document" ? [action.payload.sortable_id] : [],
        linkedBoxes: {},
        level: state[action.payload.parent].level + 1,
        type: action.payload.type,
        hidden: state[action.payload.parent].hidden,
        extraFiles: {},
        customSize: action.payload.customSize,
        background: action.payload.background,
    };
}
