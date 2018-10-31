import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { isCanvasElement, isDocument, isPage, isSection, isSlide } from "../../../../common/utils";
import { PanelGroup, Panel } from "react-bootstrap";
import Ediphy from "../../../../core/editor/main";
import './_viewToolbar.scss';
import { renderAccordion } from "../../../../core/editor/accordion_provider";

export default class ViewToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let id = this.props.containedViewSelected !== 0 ? this.props.containedViewSelected : this.props.navItemSelected;
        let pageObj = this.props.containedViewSelected !== 0 ? this.props.containedViews[this.props.containedViewSelected] : this.props.navItems[this.props.navItemSelected];
        let type = pageObj.type;
        let isContainedView = this.props.containedViewSelected !== 0;
        let doc_type = '';
        if (isPage(id)) {
            doc_type = i18n.t('page');
        }
        if(isSlide(type)) {
            doc_type = i18n.t('slide');
        }

        /* if(isDocument(type)) {
            doc_type = i18n.t('document');
        }*/

        if(isSection(id)) {
            doc_type = i18n.t('section');
        }
        let viewToolbar = this.props.viewToolbars[id];
        let controls = {
            main: {
                __name: "Main",
                accordions: { // define accordions for section
                    __basic: {
                        __name: "Generales",
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
                        __name: "Fondo",
                        icon: "crop_original",
                        buttons: {
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
                                value: this.props.exercises.weight,
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

        if (!isCanvasElement(this.props.navItemSelected, Ediphy.Config.sections_have_content)) {
            return (null);
        }
        // when no plugin selected, but new navitem
        let toolbar = this.props.viewToolbars[id];

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
};
