import i18n from "i18next";
import { isSortableBox, isSortableContainer } from "../../common/utils";

function createRichAccordions(controls) {
    if (!controls.main) {
        controls.main = {
            __name: "Main",
            accordions: {
                __marks_list: {
                    key: 'marks_list',
                    __name: i18n.t("marks.marks_list"),
                    icon: 'room',
                    buttons: {},
                }, /* ,
                __content_list: {
                    key: 'content_list',
                    __name: 'Content List',
                    icon: 'border_all',
                    buttons: {}
                }*/
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
    /* if (!controls.main.accordions.__content_list) {
        controls.main.accordions.__content_list = {
            key: 'content_list',
            __name: 'Content List',
            icon: 'border_all',
            buttons: {}
        };
    }*/
}

function createAspectRatioButton(controls, config) {
    let arb = config.aspectRatioButtonConfig;
    let button = {
        __name: arb.name,
        type: "checkbox",
        checked: arb.defaultValue,
        autoManaged: true,
    };
    if (arb.location.length === 2) {
        controls[arb.location[0]].accordions[arb.location[1]].buttons.__aspectRatio = button;
    } else {
        controls[arb.location[0]].accordions[arb.location[1]].accordions[arb.location[2]].buttons.__aspectRatio = button;
    }
}

function createControls(payload) {
    let controls = payload || {
        main: {
            __name: "Main",
            accordions: {},
        },
    };
}

function createAliasButton(controls, state) {
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
        if(state === null) {
            controls.main.accordions.z__extra.buttons.alias = {
                __name: 'Alias',
                type: 'text',
                value: "",
                autoManaged: true,
                isAttribute: true,
            };
        }else{
            controls.main.accordions.z__extra.buttons.alias = Object.assign({}, state.controls.main.accordions.z__extra.buttons.alias);
        }
    }
}

function createSizeButtons(controls, state, action, floatingBox) {
    if (!controls.main) {
        controls.main = {
            __name: "Main",
            accordions: {
                __sortable: {
                    key: 'structure',
                    __name: i18n.t('Structure'),
                    icon: 'border_all',
                    buttons: {},
                },
            },
        };
    } else if (!controls.main.accordions.__sortable) {
        controls.main.accordions.__sortable = {
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
    if (state === null) {
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

        if (isSortableContainer(action.payload.ids.container) &&
            isSortableBox(action.payload.ids.parent) && !action.payload.config.needsTextEdition) {

            displayValue = 25;
            value = 25;
            units = '%';
        }

        let initialWidth = action.payload.initialParams.width;
        if (initialWidth) {
            if (initialWidth === "auto") {
                displayValue = "auto";
                units = "%";
                type = "text";
            } else {
                displayValue = parseInt(initialWidth, 10);
                value = parseInt(initialWidth, 10);
                if (initialWidth.indexOf("px") !== -1) {
                    units = "px";
                } else {
                    units = "%";
                }
            }
        }

    } else {
        let width = state.controls.main.accordions.__sortable.buttons.__width;
        displayValue = width.displayValue;
        value = width.value;
        units = width.units;
        type = width.type;
    }
    controls.main.accordions.__sortable.buttons.__width = {
        __name: i18n.t('Width'),
        type: type,
        displayValue: displayValue,
        value: value,
        step: 5,
        units: units,
        auto: displayValue === "auto",
        autoManaged: true,
    };
    if (state === null) {
        let initialHeight = action.payload.initialParams.height;
        if (initialHeight) {
            if (initialHeight === "auto") {
                displayValue = "auto";
                units = "%";
                type = "text";
            } else {
                displayValue = parseInt(initialHeight, 10);
                value = parseInt(initialHeight, 10);
                if (initialHeight.indexOf("px") !== -1) {
                    units = "px";
                } else {
                    units = "%";
                }
            }
        } else {
            value = "20";
            displayValue = "auto";
            units = "%";
            type = "text";
        }

    } else {
        let height = state.controls.main.accordions.__sortable.buttons.__height;
        type = height.type;
        displayValue = height.displayValue;
        value = height.value;
        units = height.units;
        /* controls.main.accordions.__sortable.buttons.__height = {
         __name: i18n.t('Height'),
         type: height.type,
         displayValue: height.displayValue,
         value: height.value,
         step: 5,
         units: height.units,
         auto: height.displayValue === "auto",
         autoManaged: true
         };*/
    }
    controls.main.accordions.__sortable.buttons.__height = {
        __name: i18n.t('Height'),
        type: type,
        displayValue: displayValue,
        value: value,
        step: 5,
        units: units,
        auto: displayValue === "auto",
        autoManaged: true,
    };

    if (state === null) {
        controls.main.accordions.__sortable.buttons.__rotate = {
            __name: i18n.t('Rotate'),
            type: 'range',
            value: 0,
            min: 0,
            max: 360,
            autoManaged: false,
        };

    } else {
        // let hasPositionButton = action.payload.toolbar && action.payload.toolbar.main && action.payload.toolbar.main.accordions && action.payload.toolbar.main.accordions.__sortable && action.payload.toolbar.main.accordions.__sortable.buttons && action.payload.toolbar.main.accordions.__sortable.buttons.__position;
        let hasButton = state.controls && state.controls.main && state.controls.main.accordions && state.controls.main.accordions.__sortable && state.controls.main.accordions.__sortable.buttons && state.controls.main.accordions.__sortable.buttons.__rotate;

        if (hasButton) {
            controls.main.accordions.__sortable.buttons.__rotate = {
                __name: i18n.t('Rotate'),
                type: 'range',
                value: state.controls.main.accordions.__sortable.buttons.__rotate.value,
                min: 0,
                max: 360,
                autoManaged: true,
            };
        }

    }

    // This will be commented until it's working correctly
    if (state === null) {
        if (!floatingBox) {
            controls.main.accordions.__sortable.buttons.__position = {
                __name: i18n.t('Position'),
                type: 'radio',
                value: 'relative',
                options: ['absolute', 'relative'],
                autoManaged: true,
            };
        }

    } else {
        // let hasPositionButton = action.payload.toolbar && action.payload.toolbar.main && action.payload.toolbar.main.accordions && action.payload.toolbar.main.accordions.__sortable && action.payload.toolbar.main.accordions.__sortable.buttons && action.payload.toolbar.main.accordions.__sortable.buttons.__position;
        let hasPositionButton = state.controls && state.controls.main && state.controls.main.accordions && state.controls.main.accordions.__sortable && state.controls.main.accordions.__sortable.buttons && state.controls.main.accordions.__sortable.buttons.__position;

        if (!floatingBox && hasPositionButton) {
            controls.main.accordions.__sortable.buttons.__position = {
                __name: i18n.t('Position'),
                type: 'radio',
                value: state.controls.main.accordions.__sortable.buttons.__position.value,
                options: ['absolute', 'relative'],
                autoManaged: true,
            };
        }

    }

    /*
       controls.main.accordions.__sortable.buttons.__verticalAlign = {
       __name: i18n.t('Vertical_align'),
       type: 'fancy_radio',
       value: 'middle',
       options: ['top', 'middle', 'bottom'],
       tooltips: [i18n.t('messages.align_top'), i18n.t('messages.align_middle'), i18n.t('messages.align_bottom')],
       icons: ['vertical_align_top', 'vertical_align_center', 'vertical_align_bottom'],
       autoManaged: true
       };
       */

}
