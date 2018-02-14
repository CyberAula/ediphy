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
                                value: this.props.viewToolbars[id].viewName,
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
                                checked: this.props.viewToolbars[id].courseTitle === 'expanded',
                                autoManaged: false,
                            },
                            display_pagetitle: {
                                __name: i18n.t('Title') + i18n.t('document'),
                                type: 'checkbox',
                                checked: this.props.viewToolbars[id].documentTitle === 'expanded',
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
                                checked: this.props.viewToolbars[id].documentTitle === 'expanded',
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

        if (!isContainedView && controls && controls.main && controls.main.accordions.header && controls.main.accordions.header.buttons) {
            controls.main.accordions.header.buttons.display_breadcrumb = {
                __name: i18n.t('Breadcrumb'),
                type: 'checkbox',
                checked: true,
                autoManaged: false,
            };
            controls.main.accordions.header.buttons.display_pagenumber = {
                __name: i18n.t('pagenumber'),
                type: 'checkbox',
                checked: false,
                autoManaged: false,
            };
            controls.main.accordions.header.buttons.pagenumber_name = {
                __name: "custom_pagenum",
                type: 'conditionalText',
                associatedKey: 'display_pagenumber',
                value: "",
                autoManaged: false,
                display: true,
            };
        }
        if (!isContainedView && controls && controls.main && controls.main.accordions.basic && controls.main.accordions.basic.buttons) {
            controls.main.accordions.basic.buttons.page_display = {
                __name: i18n.t('display_page'),
                type: 'checkbox',
                checked: true,
                autoManaged: false };
        }

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
                                                    toolbar,
                                                    ind,
                                                    this.props
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

}
