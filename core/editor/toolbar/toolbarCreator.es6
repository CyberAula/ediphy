import i18n from "i18next";

import { isSortableBox, isSortableContainer } from "../../../common/utils";

/* eslint-disable react/prop-types */
export function toolbarFiller(toolbar, id, state, config, initialParams, container, exercises = {}) {

    if (isSortableBox(id)) {
        toolbar.config.displayName = i18n.t('Container_');
    }
    if (!isSortableBox(id)) {
        createSizeButtons(toolbar, state, config, !isSortableBox(container), container);
        createAliasButton(toolbar, null);
    }
    if (config?.aspectRatioButtonConfig) {
        createAspectRatioButton(toolbar, config);
    }
    if (config?.isRich) {
        createRichAccordions(toolbar);
    }

    if (config?.category === 'evaluation') {
        createScoreAccordions(toolbar, state, exercises);
    }
    return toolbar;
}

export function toolbarMapper(controls, toolbar) {
    const accordions = controls.main.accordions;
    if (Object.keys(toolbar.style).length > 0) {
        Object.keys(toolbar.style).forEach((s) => {
            if (accordions.style.buttons[s]) {
                accordions.style.buttons[s].value = toolbar.style[s];
            }
        });
    }
    if (Object.keys(toolbar.structure).length > 0) {
        Object.keys(toolbar.structure).forEach((s) => {
            if (accordions.structure.buttons[s]) {
                if (s === "aspectRatio") {
                    accordions.structure.buttons[s].checked = toolbar.structure[s];
                }
                else if (s !== "width" && s !== "height" && s !== "heightUnit" && s !== "widthUnit") {
                    accordions.structure.buttons[s].value = toolbar.structure[s];
                }
            }
        });
    }
    return controls;
}

export function createRichAccordions(controls) {
    if (!controls.main) {
        controls.main = {
            __name: "Main",
            accordions: {
                __marks_list: {
                    key: 'marks_list',
                    __name: i18n.t("marks.marks_list"),
                    icon: 'room',
                    buttons: {},
                },
            },
        };
    }
    if (!controls.main.accordions.__marks_list) {
        controls.main.accordions.__marks_list = {
            key: 'marks_list',
            __name: i18n.t("marks.marks_list"),
            icon: 'room',
            buttons: {},
        };
    }
}

export function createScoreAccordions(controls = {}, state, exercises) {
    if (!controls.main) {
        controls.main = {
            __name: "Main",
            accordions: {},
        };
    }
    if (!controls.main.accordions.__score) {
        controls.main.accordions.__score = {
            key: '__score',
            __name: i18n.t("configuration"),
            icon: 'build',
            buttons: {},
        };
    }
    let buttons = Object.assign({}, controls.main.accordions.__score.buttons || {}, {
        weight: {
            __name: i18n.t("Score"), // Valoración máxima (puntos)
            __defaultField: true,
            type: "number",
            value: exercises.weight,
            min: 0,
        },

    });
    controls.main.accordions.__score.buttons = buttons;
}

export function createAspectRatioButton(controls, config) {
    let arb = config.aspectRatioButtonConfig;
    let button = {
        __name: arb.name,
        type: "checkbox",
        checked: arb.defaultValue,
    };
    if (arb.location.length === 2) {
        controls[arb.location[0]].accordions[arb.location[1]].buttons.aspectRatio = button;
    } else {
        controls[arb.location[0]].accordions[arb.location[1]].accordions[arb.location[2]].buttons.__aspectRatio = button;
    }
}

export function createAliasButton(controls, state) {
    if (!controls.main) {
        controls.main = {
            __name: "Alias",
            icon: 'rate_review',
            accordions: {
                z__extra: {
                    __name: "Alias",
                    buttons: {},
                },
            },
        };
    } else if (!controls.main.accordions.z__extra) {
        controls.main.accordions.z__extra = {
            __name: "Alias",
            icon: 'rate_review',
            buttons: {},
        };
    }
    if (!controls.main.accordions.z__extra.buttons.alias) {
        if (state === null) {
            controls.main.accordions.z__extra.buttons.alias = {
                __name: 'Alias',
                type: 'text',
                value: "",
                isAttribute: true,
            };
        } else {
            controls.main.accordions.z__extra.buttons.alias = Object.assign({}, state.controls.main.accordions.z__extra.buttons.alias);
        }
    }
}

export function createSizeButtons(controls, state, initialParams, floatingBox, container) {
    if (!controls.main) {
        controls.main = {
            __name: "Main",
            accordions: {
                structure: {
                    key: 'structure',
                    __name: i18n.t('Structure'),
                    icon: 'border_all',
                    buttons: {},
                },
            },
        };
    } else if (!controls.main.accordions.structure) {
        controls.main.accordions.structure = {
            key: 'structure',
            __name: i18n.t('Structure'),
            icon: 'border_all',
            buttons: {},
        };
    }
    let displayValue;
    let value;
    let units;
    let type;

    // It means we are creating a new one, initial params can come
    // if (state === null) {
    if (floatingBox) {
        displayValue = 25;
        value = 25;
        units = "%";
    } else {
        displayValue = 25;
        value = 25;
        units = "%";
    }
    type = "number";

    if (isSortableContainer(container) && isSortableBox(parent) && config.needsTextEdition) {
        displayValue = 25;
        value = 25;
        units = '%';
    }

    let { initialWidth, initialHeight } = initialParams;
    if (initialWidth) {
        if (initialWidth === "auto") {
            displayValue = "auto";
            units = "%";
            type = "text";
        } else {
            displayValue = parseInt(initialWidth, 10);
            value = parseInt(initialWidth, 10);
            units = initialWidth.indexOf('px') !== -1 ? 'px' : '%';
        }
    }

    controls.main.accordions.structure.buttons.width = {
        __name: i18n.t('Width'),
        type: type,
        displayValue: displayValue,
        value: value,
        step: 5,
        units: units,
        min: 0,
        max: units === '%' ? 100 : 100000,
        auto: displayValue === "auto",
    };

    if (initialHeight) {
        if (initialHeight === "auto") {
            displayValue = "auto";
            units = "%";
            type = "text";
        } else {
            displayValue = parseInt(initialHeight, 10);
            value = parseInt(initialHeight, 10);
            type = "text";
            units = initialHeight.indexOf('px') !== -1 ? 'px' : '%';
        }
    } else {
        value = "20";
        displayValue = "auto";
        units = "%";
        type = "text";
    }

    controls.main.accordions.structure.buttons.height = {
        __name: i18n.t('Height'),
        type: type,
        displayValue: displayValue,
        value: value,
        step: 5,
        units: units,
        min: 0,
        max: units === '%' ? 100 : 100000,
        auto: displayValue === "auto",
    };

    controls.main.accordions.structure.buttons.rotation = {
        __name: i18n.t('Rotate'),
        type: 'range',
        value: 0,
        min: 0,
        max: 360,
    };

    // This will be commented until it's working correctly
    if (!floatingBox) {
        /* controls.main.accordions.structure.buttons.position = {
            __name: i18n.t('Position'),
            type: 'radio',
            value: 'relative',
            options: ['absolute', 'relative'],

        };*/

    } else {
        let hasPositionButton = state.controls?.main?.accordions?.structure?.buttons?.__position;
        if (floatingBox && hasPositionButton) {
            controls.main.accordions.structure.buttons.position = {
                __name: i18n.t('Position'),
                type: 'radio',
                value: state.controls.main.accordions.structure.buttons.position.value,
                options: ['absolute', 'relative'],
            };
        }
    }
}
/* eslint-enable react/prop-types */
