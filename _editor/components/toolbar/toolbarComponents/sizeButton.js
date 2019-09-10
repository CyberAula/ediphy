import { Checkbox, Size } from "./toolbarComponents";

export const SizeButton = (toolbar_plugin_state, buttonKey, toolbarProps, id, props, button, accordionKeys) => {
    let autoSizeHandler = () => toolbarProps.handleBoxes.onBoxResized(id, { [buttonKey]: toolbar_plugin_state.structure[buttonKey] === "auto" ? 100 : "auto" });
    let unitsHandler = e => {
        let value = (typeof e.target !== 'undefined') ? e.target.value : e.value;
        toolbarProps.handleBoxes.onBoxResized(id, { [buttonKey + "Unit"]: value });
    };

    let auto = toolbar_plugin_state.structure[buttonKey] === "auto";
    let handler;
    switch (button.type) {
    case 'checkbox':
        handler = () => {
            if (buttonKey === "aspectRatio") {
                toolbarProps.handleBoxes.onBoxResized(id, { aspectRatio: !toolbar_plugin_state.structure.aspectRatio });
            } else {
                toolbarProps.handleBoxes.onBoxResized(id, { [buttonKey]: toolbar_plugin_state.structure[buttonKey] === "auto" ? 100 : "auto" });
            }
        };
        props = {
            key: props.key,
            id: props.id,
            type: props.type,
            value: props.value,
            checked: props.checked,
            label: props.label,
            disabled: props.disabled,
            title: props.title,
        };
        return Checkbox(button, handler, props);
    case 'number':
    case 'text':
        handler = e => {
            let newValue = (typeof e.target !== 'undefined') ? e.target.value : e.value;
            toolbarProps.handleBoxes.onBoxResized(id, { [buttonKey]: newValue });
        };
        props.value = auto ? 'auto' : toolbar_plugin_state.structure[buttonKey];
        props.type = auto ? 'text' : 'number';
        props.max = toolbar_plugin_state.structure[buttonKey + "Unit"] === '%' ? 100 : 100000;
        props.disabled = auto;
        return Size(button, handler, props, accordionKeys, buttonKey, toolbar_plugin_state, toolbarProps, auto, autoSizeHandler, unitsHandler);
    default:
        return null;
    }
};
