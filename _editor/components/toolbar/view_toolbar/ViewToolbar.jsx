import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { isCanvasElement, isDocument, isPage, isSection, isSlide } from "../../../../common/utils";
import { PanelGroup, Panel } from "react-bootstrap";
import Ediphy from "../../../../core/editor/main";
import './_viewToolbar.scss';
import { renderAccordion } from "../../../../core/editor/accordion_provider";

import { getThemes, getPrimaryColor, sanitizeThemeToolbar } from "../../../../common/themes/theme_loader";
import { getThemeBackgrounds } from "../../../../common/themes/background_loader";
import { connect } from "react-redux";
import Toolbar from "../toolbar/Toolbar";

class ViewToolbar extends Component {

    render() {
        const { containedViewSelected, containedViews, styleConfig,
            navItemSelected, navItems, viewToolbars, exercises } = this.props;
        let id = containedViewSelected !== 0 ? containedViewSelected : navItemSelected;
        let pageObj = containedViewSelected !== 0 ? containedViews[containedViewSelected] : navItems[navItemSelected];
        let type = pageObj.type;
        let isContainedView = containedViewSelected !== 0;

        let doc_type = this.getDocType(type, id);
        let viewToolbar = sanitizeThemeToolbar(viewToolbars[id], styleConfig);

        let controls = {
            main: {
                __name: "Main",
                accordions: {
                    __basic: {
                        __name: i18n.t("general"),
                        icon: 'settings',
                        buttons: {
                            navitem_name: {
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
                            display_title: {
                                __name: i18n.t('course_title'),
                                type: 'checkbox',
                                checked: viewToolbar.courseTitle && viewToolbar.courseTitle !== 'hidden',
                            },
                            display_pagetitle: {
                                __name: i18n.t('Title') + doc_type,
                                type: 'checkbox',
                                checked: viewToolbar.documentTitle && viewToolbar.documentTitle !== 'hidden',
                            },
                            pagetitle_name: {
                                __name: "custom_title",
                                type: 'conditionalText',
                                associatedKey: 'display_pagetitle',
                                display: false,
                                placeholder: viewToolbar.viewName,
                                value: viewToolbar.documentTitleContent,
                            },
                            display_pagesubtitle: {
                                __name: i18n.t('subtitle'),
                                type: 'checkbox',
                                checked: viewToolbar.documentSubtitle && viewToolbar.documentSubtitle !== 'hidden',
                            },
                            pagesubtitle_name: {
                                __name: "custom_subtitle",
                                type: 'conditionalText',
                                associatedKey: 'display_pagesubtitle',
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
                                __name: i18n.t('background.background_image'),
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
            controls.main.accordions.__header.buttons.display_breadcrumb = {
                __name: i18n.t('Breadcrumb'),
                type: 'checkbox',
                checked: viewToolbar.breadcrumb !== 'hidden',
            };
            controls.main.accordions.__header.buttons.display_pagenumber = {
                __name: doc_type + " " + i18n.t('pagenumber'),
                type: 'checkbox',
                checked: viewToolbar.numPage !== 'hidden',
            };
            controls.main.accordions.__header.buttons.pagenumber_name = {
                __name: "custom_pagenum",
                type: 'conditionalText',
                associatedKey: 'display_pagenumber',
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
        let toolbar = sanitizeThemeToolbar(viewToolbars[id]);

        return Object.keys(controls).map((tabKey, index) => {
            let tab = controls[tabKey];
            return (
                <div key={'key_' + index} className="toolbarTab">
                    <PanelGroup id="panel-group">
                        {Object.keys(tab.accordions).sort().map((accordionKey, ind) => {
                            return renderAccordion(
                                tab.accordions[accordionKey],
                                tabKey,
                                [accordionKey],
                                toolbar,
                                ind,
                                this.props
                            );
                        })}
                    </PanelGroup>
                </div>
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
    navItems: PropTypes.object.isRequired,
    /**
   *Current selected view (by ID)
   */
    navItemSelected: PropTypes.any.isRequired,
    /**
   * Object containing all contained views (identified by its ID)
   */
    containedViews: PropTypes.object.isRequired,
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
    viewToolbars: PropTypes.object,
    /**
     * Style config params
     */
    styleConfig: PropTypes.object,
};
