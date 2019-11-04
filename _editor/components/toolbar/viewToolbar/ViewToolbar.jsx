import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { PanelGroup } from "react-bootstrap";
import { connect } from "react-redux";

import Ediphy from "../../../../core/editor/main";

import { isCanvasElement, isPage, isSection, isSlide } from "../../../../common/utils";
import { renderAccordion } from "../../../../core/editor/toolbar/toolbarRenderer";
import { getThemes, sanitizeThemeToolbar } from "../../../../common/themes/themeLoader";

import { ToolbarTab } from "../Styles";

class ViewToolbar extends Component {

    render() {
        const { containedViewSelected, containedViewsById, styleConfig, navItemSelected, navItemsById, viewToolbarsById, exercises } = this.props;
        const id = containedViewSelected !== 0 ? containedViewSelected : navItemSelected;
        const pageObj = containedViewSelected !== 0 ? containedViewsById[containedViewSelected] : navItemsById[navItemSelected];
        const type = pageObj.type;
        const isContainedView = containedViewSelected !== 0;

        const doc_type = this.getDocType(type, id);
        const viewToolbar = sanitizeThemeToolbar(viewToolbarsById[id], styleConfig);

        let controls = {
            main: {
                __name: "Main",
                accordions: {
                    __basic: {
                        __name: i18n.t("general"),
                        icon: 'settings',
                        buttons: {
                            viewName: {
                                __name: i18n.t('NavItem_name'),
                                type: 'text',
                                value: viewToolbar.viewName,
                            },
                        },
                    },
                    __header: {
                        __name: i18n.t('Header'),
                        icon: 'format_color_text',
                        buttons: {
                            courseTitle: {
                                __name: i18n.t('course_title'),
                                type: 'checkbox',
                                checked: viewToolbar.courseTitle && viewToolbar.courseTitle !== 'hidden',
                            },
                            documentTitle: {
                                __name: i18n.t('Title') + doc_type,
                                type: 'checkbox',
                                checked: viewToolbar.documentTitle && viewToolbar.documentTitle !== 'hidden',
                            },
                            documentTitleContent: {
                                __name: "custom_title",
                                type: 'conditionalText',
                                associatedKey: 'documentTitle',
                                display: false,
                                placeholder: viewToolbar.viewName,
                                value: viewToolbar.documentTitleContent,
                            },
                            documentSubtitle: {
                                __name: i18n.t('subtitle'),
                                type: 'checkbox',
                                checked: viewToolbar.documentSubtitle && viewToolbar.documentSubtitle !== 'hidden',
                            },
                            documentSubtitleContent: {
                                __name: "custom_subtitle",
                                type: 'conditionalText',
                                associatedKey: 'documentSubtitle',
                                display: false,
                                value: viewToolbar.documentSubtitleContent,
                            },
                        },
                    },
                    __background: {
                        __name: i18n.t("Style.appearance"),
                        icon: "crop_original",
                        buttons: {
                            theme: {
                                __name: i18n.t('Style.theme'),
                                type: 'theme_select',
                                associatedKey: 'page_theme',
                                options: getThemes(),
                                value: viewToolbar.theme,
                            },
                            theme_primary_color: {
                                __name: i18n.t("Style.accent_color"),
                                type: 'color',
                                value: viewToolbar.colors.themeColor1 ? viewToolbar.colors.themeColor1 : styleConfig.color,
                            },
                            theme_font: {
                                __name: i18n.t('Style.font'),
                                kind: 'theme_font',
                                type: 'font_picker',
                                value: viewToolbar.font !== '' ? viewToolbar.font : styleConfig.font,
                            },
                            background: {
                                __name: i18n.t('background.backgroundImage'),
                                type: 'background_picker',
                                value: { background: viewToolbar.background, backgroundAttr: viewToolbar.background_attr } || { background: "#ffffff", backgroundAttr: "full" },
                            },
                        },
                    },
                    __score: {
                        __name: i18n.t('configuration'),
                        icon: 'build',
                        buttons: {
                            weight: {
                                __name: i18n.t('Score'),
                                type: 'number',
                                min: 1,
                                __defaultField: true,
                                value: exercises.weight,
                            },
                        },
                    },
                },
            },
        };

        if (!isContainedView && controls && controls.main && controls.main.accordions.__header && controls.main.accordions.__header.buttons) {
            controls.main.accordions.__header.buttons.breadcrumb = {
                __name: i18n.t('Breadcrumb'),
                type: 'checkbox',
                checked: viewToolbar.breadcrumb !== 'hidden',
            };
            controls.main.accordions.__header.buttons.numPage = {
                __name: doc_type + " " + i18n.t('pagenumber'),
                type: 'checkbox',
                checked: viewToolbar.numPage !== 'hidden',
            };
            controls.main.accordions.__header.buttons.numPageContent = {
                __name: "custom_pagenum",
                type: 'conditionalText',
                associatedKey: 'numPage',
                value: viewToolbar.numPageContent,
                display: false,

            };
        }
        if (!isContainedView && controls && controls.main && controls.main.accordions.__basic && controls.main.accordions.__basic.buttons) {
            controls.main.accordions.__basic.buttons.page_display = {
                __name: i18n.t('display_page'),
                type: 'checkbox',
                checked: !pageObj.hidden,
            };
        }

        if (!isCanvasElement(navItemSelected, Ediphy.Config.sections_have_content)) {
            return (null);
        }
        // when no plugin selected, but new navitem
        let toolbar = sanitizeThemeToolbar(viewToolbarsById[id]);

        return Object.keys(controls).map((tabKey, index) => {
            let tab = controls[tabKey];
            return (
                <ToolbarTab key={'key_' + index}>
                    <PanelGroup id="panel-group">
                        {Object.keys(tab.accordions).sort().map((accordionKey, ind) => {
                            return renderAccordion(
                                tab.accordions[accordionKey],
                                tabKey,
                                [accordionKey],
                                toolbar,
                                ind,
                                this
                            );
                        })}
                    </PanelGroup>
                </ToolbarTab>
            );
        });
    }

    getDocType = (type, id) => isPage(id) ? i18n.t('page') : isSlide(type) ? i18n.t('slide') : isSection(id) ? i18n.t('section') : '';

}

export default connect(mapStateToProps)(ViewToolbar);

function mapStateToProps(state) {
    return {
        styleConfig: state.undoGroup.present.styleConfig,
    };
}

ViewToolbar.propTypes = {
    /**
     * Object containing all views (by id)
    */
    navItemsById: PropTypes.object.isRequired,
    /**
   *Current selected view (by ID)
   */
    navItemSelected: PropTypes.any.isRequired,
    /**
   * Object containing all contained views (identified by its ID)
   */
    containedViewsById: PropTypes.object.isRequired,
    /**
   * Selected contained view (by ID)
   */
    containedViewSelected: PropTypes.any.isRequired,
    /**
   * Object containing all the exercises
   */
    exercises: PropTypes.object,
    /**
     * Page toolbars
    */
    viewToolbarsById: PropTypes.object,
    /**
     * Style config params
     */
    styleConfig: PropTypes.object,
};
