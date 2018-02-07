import React, { Component } from 'react';
import i18n from 'i18next';
import {
    isCanvasElement, isContainedView, isDocument, isPage, isSection, isSlide,
    isSortableContainer,
} from "../../../../common/utils";
import { Tooltip, FormControl, OverlayTrigger, Popover, InputGroup, FormGroup, Radio, ControlLabel, Checkbox, Button, PanelGroup, Panel } from "react-bootstrap";
import { UPDATE_BOX, UPDATE_TOOLBAR } from "../../../../common/actions";
import Select from "react-select";
import ColorPicker from "../../common/color-picker/ColorPicker";
import RadioButtonFormGroup from "../radio_button_form_group/RadioButtonFormGroup";
import ToggleSwitch from "@trendmicro/react-toggle-switch/lib/index";
import Ediphy from "../../../../core/editor/main";
import ExternalProvider from "../../external_provider/external_provider/ExternalProvider";
import { renderAccordion } from "../../../../core/editor/accordion_provider";

export default class ViewToolbar extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * Render React component
     * @returns {code}
     */
    render() {
        let id = this.props.containedViewSelected !== 0 ? this.props.containedViewSelected : this.props.navItemSelected;
        let type = this.props.containedViewSelected !== 0 ? this.props.containedViews[this.props.containedViewSelected].type : this.props.navItems[this.props.navItemSelected];
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

        let controls = {
            main: {
                __name: "Main",
                accordions: { // define accordions for section
                    basic: {
                        __name: "Generales",
                        icon: 'settings',
                        buttons: {
                            navitem_name: {
                                __name: i18n.t('NavItem_name'),
                                type: 'text',
                                value: this.props.viewToolbars[id].courseTitle,
                                autoManaged: false,
                            },
                        },
                    },
                    header: {
                        __name: i18n.t('Header'),
                        icon: 'format_color_text',
                        buttons: {
                            display_title: {
                                __name: i18n.t('course_title'),
                                type: 'checkbox',
                                checked: false,
                                autoManaged: false,
                            },
                            display_pagetitle: {
                                __name: this.props.viewToolbars[id].displayableTitle,
                                type: 'checkbox',
                                checked: true,
                                autoManaged: false,
                            },
                            pagetitle_name: {
                                __name: "custom_title",
                                type: 'conditionalText',
                                associatedKey: 'display_pagetitle',
                                autoManaged: false,
                                display: true,
                            },
                            display_pagesubtitle: {
                                __name: i18n.t('subtitle'),
                                type: 'checkbox',
                                checked: false,
                                autoManaged: false,
                            },
                            pagesubtitle_name: {
                                __name: "custom_subtitle",
                                type: 'conditionalText',
                                associatedKey: 'display_pagesubtitle',
                                autoManaged: false,
                                display: true,
                            },

                        },

                    },
                },
            },
        };

        if (!isCanvasElement(this.props.navItemSelected, Ediphy.Config.sections_have_content)) {
            return (
                <div id="wrap"
                    className="wrapper hiddenWrapper"
                    style={{
                        top: this.props.top,
                    }}>
                    <div id="tools" className="toolbox"/>
                </div>
            );
        }
        // when no plugin selected, but new navitem
        let toolbar = this.props.viewToolbars[this.props.navItemSelected];
        return (
            <div id="wrap"
                className="wrapper"
                style={{
                    right: '0px',
                    top: this.props.top,
                }}>
                <div className="pestana"
                    onClick={() => {
                        this.props.toggleToolbar();
                    }}/>
                <div id="tools"
                    style={{
                        width: this.props.open ? '250px' : '40px',
                    }}
                    className="toolbox">
                    <OverlayTrigger placement="left"
                        overlay={
                            <Tooltip className={this.props.open ? 'hidden' : ''}
                                id="tooltip_props">
                                {i18n.t('Properties')}
                            </Tooltip>
                        }>
                        <div onClick={() => {
                            this.props.toggleToolbar();
                        }}
                        style={{ display: this.props.carouselShow ? 'block' : 'block' }}
                        className={this.props.open ? 'carouselListTitle toolbarSpread' : 'carouselListTitle toolbarHide'}>
                            <div className="toolbarTitle">
                                <i className="material-icons">settings</i>
                                <span className="toolbarTitletxt">
                                    {i18n.t('Properties')}
                                </span>
                            </div>
                            <div className="pluginTitleInToolbar">
                                {this.props.viewToolbars[id].displayableTitle || ""}
                            </div>
                        </div>
                    </OverlayTrigger>
                    <div id="insidetools" style={{ display: this.props.open ? 'block' : 'none' }}>
                        <div className="toolbarTabs">
                            {Object.keys(controls).map((tabKey, index) => {
                                let tab = controls[tabKey];
                                return (
                                    <div key={'key_' + index} className="toolbarTab">
                                        <PanelGroup>
                                            {Object.keys(tab.accordions).sort().map((accordionKey, ind) => {
                                                return renderAccordion(
                                                    tab.accordions[accordionKey],
                                                    tabKey,
                                                    [accordionKey],
                                                    toolbar.state,
                                                    ind
                                                );
                                            })}
                                        </PanelGroup>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Header configuration
     * @param name type of title
     * @param value value of the field
     */
    handlecanvasToolbar(name, value) {
        let navitem = this.props.navItems[this.props.navItemSelected];
        let toolbar = this.props.toolbars[this.props.navItemSelected].controls.main.accordions;
        switch (name) {
        // change page/slide title
        case i18n.t('background.background'):
            let isColor = (/rgb[a]?\(\d+\,\d+\,\d+(\,\d)?\)/).test(value.background);
            if(isColor) {
                this.props.onBackgroundChanged(this.props.navItemSelected, value.background);
            } else {
                this.props.onBackgroundChanged(this.props.navItemSelected, value);
            }
            break;
        case "custom_title":
            this.props.titleModeToggled(this.props.navItemSelected, {
                documentTitle: value,
            });
            break;
        // change page/slide title
        case "custom_subtitle":
            this.props.titleModeToggled(this.props.navItemSelected, {
                documentSubTitle: value,
            });
            break;
        // change page/slide title
        case "custom_pagenum":
            this.props.titleModeToggled(this.props.navItemSelected, {
                numPage: value,
            });
            break;
        // preview / export document
        case i18n.t('display_page'):
            this.props.onNavItemToggled(this.props.navItemSelected);
            break;
        // change document(navitem) name
        case i18n.t('NavItem_name'):
            if (isContainedView(this.props.navItemSelected)) {
                this.props.onContainedViewNameChanged(this.props.navItemSelected, value);
            } else {
                this.props.onNavItemNameChanged(this.props.navItemSelected, value);
            }
            break;
        // display - course title
        case i18n.t('course_title'):
            let courseTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                courseTitle: courseTitle,
            });
            break; // display - page title
        case i18n.t('Title') + i18n.t('document'):
            let docTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                documentTitle: docTitle,
            });
            break;
        // display - page title
        case i18n.t('Title') + i18n.t('page'):
            let pageTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                documentTitle: pageTitle,
            });
            break;
        // display - slide title
        case i18n.t('Title') + i18n.t('slide'):
            let slideTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                documentTitle: slideTitle,
            });
            break;
        case i18n.t('Title') + i18n.t('section'):
            let sectionTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                documentTitle: sectionTitle,
            });
            break;
        // display - subtitle
        case i18n.t('subtitle'):
            let subTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                documentSubTitle: subTitle,
            });
            break;
        // display - breadcrumb
        case i18n.t('Breadcrumb'):
            let breadcrumb = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                breadcrumb: breadcrumb,
            });
            break;
        // display - pagenumber
        case i18n.t('pagenumber'):
            let pagenumber = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                pageNumber: pagenumber,
            });
            break;
        default:
            break;
        }

    }

}
