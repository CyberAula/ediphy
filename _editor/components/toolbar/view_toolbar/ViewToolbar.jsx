import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { isCanvasElement, isDocument, isPage, isSection, isSlide } from "../../../../common/utils";
import { PanelGroup, Panel } from "react-bootstrap";
import Ediphy from "../../../../core/editor/main";
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

        if(isDocument(type)) {
            doc_type = i18n.t('document');
        }

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
                                autoManaged: false,
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
                                autoManaged: false,
                            },
                            display_pagetitle: {
                                __name: i18n.t('Title') + i18n.t('document'),
                                type: 'checkbox',
                                checked: viewToolbar.documentTitle && viewToolbar.documentTitle !== 'hidden',
                                autoManaged: false,

                            },
                            pagetitle_name: {
                                __name: "custom_title",
                                type: 'conditionalText',
                                associatedKey: 'display_pagetitle',
                                autoManaged: false,
                                display: false,
                                value: viewToolbar.documentTitleContent,
                            },
                            display_pagesubtitle: {
                                __name: i18n.t('subtitle'),
                                type: 'checkbox',
                                checked: viewToolbar.documentSubTitle && viewToolbar.documentSubTitle !== 'hidden',
                                autoManaged: false,
                            },
                            pagesubtitle_name: {
                                __name: "custom_subtitle",
                                type: 'conditionalText',
                                associatedKey: 'display_pagesubtitle',
                                autoManaged: false,
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
                                __name: i18n.t('background.background'),
                                type: 'background_picker',
                                value: { background: viewToolbar.background, backgroundAttr: viewToolbar.background_attr } || { background: "#ffffff", backgroundAttr: "full" },
                                autoManaged: false,
                            },
                        },
                    },
                    __score: {
                        __name: i18n.t('Score'),
                        icon: 'school',
                        buttons: {
                            weight: {
                                __name: i18n.t('Weight'),
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
                autoManaged: false,
            };
            controls.main.accordions.__header.buttons.display_pagenumber = {
                __name: i18n.t('pagenumber'),
                type: 'checkbox',
                checked: viewToolbar.numPage !== 'hidden',
                autoManaged: false,
            };
            controls.main.accordions.__header.buttons.pagenumber_name = {
                __name: "custom_pagenum",
                type: 'conditionalText',
                associatedKey: 'display_pagenumber',
                value: viewToolbar.numPageContent,
                autoManaged: false,
                display: false,

            };
        }
        if (!isContainedView && controls && controls.main && controls.main.accordions.__basic && controls.main.accordions.__basic.buttons) {
            controls.main.accordions.__basic.buttons.page_display = {
                __name: i18n.t('display_page'),
                type: 'checkbox',
                checked: !pageObj.hidden,
                autoManaged: false };
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
                    <PanelGroup>
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

    navItems: PropTypes.object.isRequired,
    /**
   * Vista  seleccionada identificada por su *id*
   */
    navItemSelected: PropTypes.any.isRequired,
    /**
   * Diccionario que contiene todas las vistas contenidas, accesibles por su *id*
   */
    containedViews: PropTypes.object.isRequired,
    /**
   * Vista contenida seleccionada identificada por su *id*
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
