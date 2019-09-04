export default function(state, action = {}) {
    return (action && action.type) ? action.type : "";
}
