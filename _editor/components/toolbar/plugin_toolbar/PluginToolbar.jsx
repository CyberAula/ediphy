import React, { Component } from 'react';
import {
    Tooltip,
    FormControl,
    OverlayTrigger,
    Popover,
    InputGroup,
    FormGroup,
    Radio,
    ControlLabel,
    Checkbox,
    Button,
    PanelGroup,
    Panel,
} from 'react-bootstrap';
import GridConfigurator from '../grid_configurator/GridConfigurator.jsx';
import RadioButtonFormGroup from '../radio_button_form_group/RadioButtonFormGroup.jsx';
import Select from 'react-select';
import ExternalProvider from '../../external_provider/external_provider/ExternalProvider';
import MarksList from './../../rich_plugins/marks_list/MarksList.jsx';
import Ediphy from '../../../../core/editor/main';
import ColorPicker from './../../common/color-picker/ColorPicker';
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import { UPDATE_TOOLBAR, UPDATE_BOX } from '../../../../common/actions';
import { isSortableContainer, isCanvasElement, isContainedView, isSlide, isDocument } from '../../../../common/utils';
import i18n from 'i18next';
import './_pluginToolbar.scss';
import FileInput from "../../common/file-input/FileInput";
import PropTypes from 'prop-types';

/**
 * Toolbar component for configuring boxes or pages
 */
export default class PluginToolbar extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         * @type {{open: boolean}}
         */
        this.state = {
            open: false,
        };
    }

    /**
     * Render React component
     * @returns {code}
     */
    render() {
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
        if (this.props.boxSelected === -1 && isCanvasElement(this.props.navItemSelected, Ediphy.Config.sections_have_content)) {
            let toolbar = this.props.toolbars[this.props.navItemSelected];
            return (
                <div id="wrap"
                    className="wrapper"
                    style={{
                        right: '0px',
                        top: this.props.top,
                    }}>
                    <div className="pestana"
                        onClick={() => {
                            this.setState({ open: !this.state.open });
                        }}/>
                    <div id="tools"
                        style={{
                            width: this.state.open ? '250px' : '40px',
                        }}
                        className="toolbox">
                        <OverlayTrigger placement="left"
                            overlay={
                                <Tooltip className={this.state.open ? 'hidden' : ''}
                                    id="tooltip_props">
                                    {i18n.t('Properties')}
                                </Tooltip>
                            }>
                            <div onClick={() => {
                                this.setState({ open: !this.state.open });
                            }}
                            style={{ display: this.props.carouselShow ? 'block' : 'block' }}
                            className={this.state.open ? 'carouselListTitle toolbarSpread' : 'carouselListTitle toolbarHide'}>
                                <div className="toolbarTitle">
                                    <i className="material-icons">settings</i>
                                    <span className="toolbarTitletxt">
                                        {i18n.t('Properties')}
                                    </span>
                                </div>
                                <div className="pluginTitleInToolbar">
                                    {toolbar.config.displayName || ""}
                                </div>
                            </div>
                        </OverlayTrigger>
                        <div id="insidetools" style={{ display: this.state.open ? 'block' : 'none' }}>
                            <div className="toolbarTabs">
                                {Object.keys(toolbar.controls).map((tabKey, index) => {
                                    let tab = toolbar.controls[tabKey];
                                    return (
                                        <div key={'key_' + index} className="toolbarTab">
                                            <PanelGroup>
                                                {Object.keys(tab.accordions).sort().map((accordionKey, ind) => {
                                                    return this.renderAccordion(
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
        let toolbar = this.props.toolbars[this.props.box.id];
        // We define the extra buttons we need depending on plugin's configuration
        let textButton;
        if (toolbar.config.needsTextEdition) {
            textButton = (
                <div className="panel-body">
                    <Button key={'text'}
                        className={toolbar.showTextEditor ? 'toolbarButton textediting' : 'toolbarButton'}
                        onClick={() => {
                            this.props.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor);
                        }}>
                        <i className="toolbarIcons material-icons">mode_edit</i>
                        {i18n.t("edit_text")}
                    </Button>
                </div>
            );
        }

        let configButton;
        if (toolbar.config && toolbar.config.needsConfigModal) {
            configButton = (
                <div className="panel-body">
                    <Button key={'config'}
                        className='toolbarButton'
                        onClick={() => {
                            Ediphy.Plugins.get(toolbar.config.name).openConfigModal(UPDATE_BOX, toolbar.state, toolbar.id);
                        }}>
                        <i className="toolbarIcons material-icons">build</i>
                        {i18n.t('open_conf')}
                    </Button>
                </div>
            );
        }

        return (
            <div id="wrap"
                className="wrapper"
                style={{
                    right: '0px',
                    top: this.props.top,
                }}>
                <div className="pestana"
                    onClick={() => {
                        this.setState({ open: !this.state.open });
                    }}/>
                <div id="tools"
                    style={{
                        width: this.state.open ? '250px' : '40px',
                    }}
                    className="toolbox">
                    <OverlayTrigger placement="left"
                        overlay={
                            <Tooltip className={this.state.open ? 'hidden' : ''}
                                id="tooltip_props">
                                {i18n.t('Properties')}
                            </Tooltip>
                        }>
                        <div onClick={() => {
                            this.setState({ open: !this.state.open });
                        }}
                        style={{ display: 'block' }}
                        className={this.state.open ? 'carouselListTitle toolbarSpread' : 'carouselListTitle toolbarHide'}>
                            <div className="toolbarTitle">
                                <i className="material-icons">settings</i>
                                <span className="toolbarTitletxt">
                                    {i18n.t('Properties')}
                                </span>
                            </div>
                            <div className="pluginTitleInToolbar">
                                {toolbar.config.displayName || ""}
                            </div>
                        </div>
                    </OverlayTrigger>
                    <div id="insidetools" style={{ display: this.state.open ? 'block' : 'none' }}>
                        <div className="toolbarTabs">
                            {Object.keys(toolbar.controls).map((tabKey, index) => {
                                let tab = toolbar.controls[tabKey];
                                return (
                                    <div key={'key_' + index} className="toolbarTab">
                                        <PanelGroup>
                                            {Object.keys(tab.accordions).sort().map((accordionKey, ind) => {
                                                return this.renderAccordion(
                                                    tab.accordions[accordionKey],
                                                    tabKey,
                                                    [accordionKey],
                                                    toolbar.state,
                                                    ind
                                                );
                                            })}
                                            {this.props.box.children.map((id, ind) => {
                                                let container = this.props.box.sortableContainers[id];
                                                if (tabKey === "main") {
                                                    return (
                                                        <Panel key={'panel_' + id}
                                                            className="panelPluginToolbar"
                                                            collapsible
                                                            onEnter={(panel) => {
                                                                panel.parentNode.classList.add("extendedPanel");
                                                            }}
                                                            onExited={(panel) => {
                                                                panel.parentNode.classList.remove("extendedPanel");
                                                            }}
                                                            header={
                                                                <span>
                                                                    <i className="toolbarIcons material-icons">web_asset</i>
                                                                    {(toolbar.state.__pluginContainerIds && toolbar.state.__pluginContainerIds[container.key].name) ?
                                                                        toolbar.state.__pluginContainerIds[container.key].name :
                                                                        (i18n.t('Block') + ' ' + (ind + 1))
                                                                    }
                                                                </span>
                                                            }>
                                                            <GridConfigurator id={id}
                                                                parentId={this.props.box.id}
                                                                container={container}
                                                                onColsChanged={this.props.onColsChanged}
                                                                onRowsChanged={this.props.onRowsChanged}
                                                                sortableProps={this.props.box.sortableContainers[id]}
                                                                onSortablePropsChanged={this.props.onSortablePropsChanged}
                                                                onSortableContainerResized={this.props.onSortableContainerResized}/>
                                                        </Panel>);
                                                }
                                                return null;
                                            })}
                                        </PanelGroup>
                                        {textButton}
                                        {configButton}
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
                elementContent: {
                    documentTitle: value,
                    documentSubTitle: navitem.header.elementContent.documentSubTitle,
                    numPage: navitem.header.elementContent.numPage,
                },
                display: {
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: navitem.header.display.documentTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: navitem.header.display.pageNumber,
                },
            });
            break;
            // change page/slide title
        case "custom_subtitle":
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent: {
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle: value,
                    numPage: navitem.header.elementContent.numPage,
                },
                display: {
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: navitem.header.display.documentTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: navitem.header.display.pageNumber,
                },
            });
            break;
            // change page/slide title
        case "custom_pagenum":
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent: {
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle: navitem.header.elementContent.documentSubTitle,
                    numPage: value,
                },
                display: {
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: navitem.header.display.documentTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: navitem.header.display.pageNumber,
                },
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
                elementContent: {
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle: navitem.header.elementContent.documentSubTitle,
                    numPage: navitem.header.elementContent.numPage,
                },
                display: {
                    courseTitle: courseTitle,
                    documentTitle: navitem.header.display.documentTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: navitem.header.display.pageNumber,
                },
            });
            break; // display - page title
        case i18n.t('Title') + i18n.t('document'):
            let docTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent: {
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle: navitem.header.elementContent.documentSubTitle,
                    numPage: navitem.header.elementContent.numPage,
                },
                display: {
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: docTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: navitem.header.display.pageNumber,
                },
            });

            break;
            // display - page title
        case i18n.t('Title') + i18n.t('page'):
            let pageTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent: {
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle: navitem.header.elementContent.documentSubTitle,
                    numPage: navitem.header.elementContent.numPage,
                },
                display: {
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: pageTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: navitem.header.display.pageNumber,
                },
            });

            break;
            // display - slide title
        case i18n.t('Title') + i18n.t('slide'):
            let slideTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent: {
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle: navitem.header.elementContent.documentSubTitle,
                    numPage: navitem.header.elementContent.numPage,
                },
                display: {
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: slideTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: navitem.header.display.pageNumber,
                },
            });
            break;
        case i18n.t('Title') + i18n.t('section'):
            let sectionTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent: {
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle: navitem.header.elementContent.documentSubTitle,
                    numPage: navitem.header.elementContent.numPage,
                },
                display: {
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: sectionTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: navitem.header.display.pageNumber,
                },
            });
            break;
        // display - subtitle
        case i18n.t('subtitle'):
            let subTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent: {
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle: navitem.header.elementContent.documentSubTitle ? navitem.header.elementContent.documentSubTitle : i18n.t('subtitle'),
                    numPage: navitem.header.elementContent.numPage,
                },
                display: {
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: navitem.header.display.documentTitle,
                    documentSubTitle: subTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: navitem.header.display.pageNumber,
                },
            });
            break;
            // display - breadcrumb
        case i18n.t('Breadcrumb'):
            let breadcrumb = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent: {
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle: navitem.header.elementContent.documentSubTitle,
                    numPage: navitem.header.elementContent.numPage,
                },
                display: {
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: navitem.header.display.documentTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: breadcrumb,
                    pageNumber: navitem.header.display.pageNumber,
                },
            });
            break;
            // display - pagenumber
        case i18n.t('pagenumber'):
            let pagenumber = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent: {
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle: navitem.header.elementContent.documentSubTitle,
                    numPage: navitem.header.elementContent.numPage,
                },
                display: {
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: navitem.header.display.documentTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: pagenumber,
                },
            });
            break;
        default:
            break;
        }

    }

    /**
     * Render toolbar accordion
     * @param accordion Name of the accordion
     * @param tabKey Unique key of the tab
     * @param accordionKeys Unique keys of the accordion
     * @param state Toolbar state
     * @param key Current key
     */
    renderAccordion(accordion, tabKey, accordionKeys, state, key) {
        if (accordionKeys[0] === 'z__extra') {
            return null;
        }
        let props = {
            key: key,
            className: "panelPluginToolbar",
            collapsible: true,
            onEntered: (panel) => {
                panel.parentNode.classList.add("extendedPanel");
            },
            onExited: (panel) => {
                panel.parentNode.classList.remove("extendedPanel");
            },
            header: (
                <span key={'span' + key}>
                    <i className="toolbarIcons material-icons">
                        {accordion.icon ? accordion.icon : <span className="toolbarIcons"/>}
                    </i>{accordion.__name}
                </span>
            ),
        };
        let children = [];
        if (accordion.order) {
            for (let i = 0; i < accordion.order.length; i++) {
                if (accordion.accordions[accordion.order[i]]) {
                    children.push(this.renderAccordion(accordion.accordions[accordion.order[i]], tabKey, [accordionKeys[0], accordion.order[i]], state, i));
                } else if (accordion.buttons[accordion.order[i]]) {
                    children.push(this.renderButton(accordion, tabKey, accordionKeys, accordion.order[i], state, i));
                } else {
                    // eslint-disable-next-line no-console
                    console.error("Element %s not defined", accordion.order[i]);
                }
            }
        } else {
            let buttonKeys = Object.keys(accordion.buttons);
            for (let i = 0; i < buttonKeys.length; i++) {
                let buttonWidth = (buttonKeys[i] === '__width' || buttonKeys[i] === '__height') ? '60%' : '100%';
                let buttonMargin = (buttonKeys[i] === '__width' || buttonKeys[i] === '__height') ? '5%' : '0px';
                children.push(
                    <div key={'div_' + i}
                        style={{
                            width: buttonWidth,
                            marginRight: buttonMargin,
                        }}>
                        {this.renderButton(accordion, tabKey, accordionKeys, buttonKeys[i], state, i)}

                    </div>
                );
            }

        }

        if (accordion.key === 'marks_list') {
            children.push(
                <MarksList key="marks_list"
                    state={state.__marks}
                    toolbars={this.props.toolbars}
                    onRichMarksModalToggled={this.props.onRichMarksModalToggled}
                    onRichMarkEditPressed={this.props.onRichMarkEditPressed}
                    onRichMarkDeleted={this.props.onRichMarkDeleted}/>
            );
        }

        return React.createElement(Panel, props, children);
    }

    /**
     * Render toolbar button
     * @param accordion Name of the accordion
     * @param tabKey Unique key of the tab
     * @param accordionKeys Unique keys of the accordion
     * @param buttonKey Unique key of the button
     * @param state Toolbar state
     * @param key Current key
     * @returns {code} Button code
     */
    renderButton(accordion, tabKey, accordionKeys, buttonKey, state, key) {
        let button = accordion.buttons[buttonKey];
        let children = null;
        let id;
        if (this.props.boxSelected === -1) {
            id = this.props.navItemSelected;
        } else {
            id = this.props.box.id;
        }

        let props = {
            key: ('child_' + key),
            id: ('page' + '_' + buttonKey),
            type: button.type,
            value: button.value,
            checked: button.checked,
            label: button.__name,
            min: button.min,
            max: button.max,
            step: button.step,
            disabled: false,
            title: button.title ? button.title : '',
            className: button.class,
            style: { width: '100%' },
            onBlur: e => {
                let value = e.target.value;
                if (button.type === 'number' && value === "") {
                    value = button.min ? button.min : 0;
                }

                if (!button.autoManaged && button.callback) {
                    button.callback(state, buttonKey, value, id, UPDATE_TOOLBAR);
                }
            },
            onChange: e => {
                let value;
                if (typeof e.target !== 'undefined') {
                    value = e.target.value;
                } else {
                    value = e.value;
                }
                if (buttonKey === '__width' || buttonKey === '__height') {
                    let newButton = Object.assign({}, (buttonKey === '__width' ? accordion.buttons.__width : accordion.buttons.__height));
                    let otherButton = Object.assign({}, (buttonKey === '__height' ? accordion.buttons.__width : accordion.buttons.__height));
                    let type = e.target.type;
                    if (!type && e.target.classList.contains('toggle-switch---toggle---mncCu')) {
                        type = 'checkbox';
                    }
                    switch (type) {
                    case "checkbox":
                        newButton.auto = !newButton.auto;
                        newButton.displayValue = newButton.auto ? 'auto' : button.value;
                        newButton.type = newButton.auto ? 'text' : 'number';
                        newButton.disabled = newButton.auto;
                        break;
                    case "select-one":
                        newButton.units = value;
                        break;

                    default:
                        if (isNaN(parseInt(value, 10))) {
                            if (value === "") {
                                value = 0;
                            } else {
                                value = 100;
                            }
                        } else {
                            value = parseInt(value, 10);
                        }
                        let val;
                        if (newButton.units === "%") {
                            val = Math.min(Math.max(value, 0), 100);
                            newButton.displayValue = val;
                            newButton.value = val;
                        } else if (newButton.units === "px") {
                            val = Math.max(value, 0);
                            newButton.displayValue = val;
                            newButton.value = val;
                        }
                        break;
                    }
                    if (accordion.buttons.__aspectRatio && accordion.buttons.__aspectRatio.checked) {
                        otherButton.value = otherButton.value * newButton.value / button.value;
                        if (!otherButton.auto) {
                            otherButton.displayValue = otherButton.value;
                        }
                    }

                    // If next values are going to be over 100%, prevent action
                    if ((newButton.units === "%" && newButton.value > 100) || (otherButton.units === "%" && otherButton.value > 100)) {
                        return;
                    }

                    if (buttonKey === "__width") {
                        this.props.onBoxResized(id, newButton, otherButton);
                    } else {
                        this.props.onBoxResized(id, otherButton, newButton);
                    }
                    return;

                }
                if (button.type === 'number') {
                    // If there's any problem when parsing (NaN) -> take min value if defined; otherwise take 0
                    if (!(value && value.length >= 1 && (value.charAt(value.length - 1) === '.' || value.charAt(value.length - 1) === ',' || value === 0))) {
                        value = parseFloat(value) || button.min || 0;
                        if (button.max && value > button.max) {
                            value = button.max;
                        }
                    }

                }

                if (button.type === 'button') {
                    value = button.value;
                }

                if (button.type === 'image_file') {
                    if (e.target.files.length === 1) {
                        let file = e.target.files[0];
                        let reader = new FileReader();
                        reader.onload = () => {
                            let img = new Image();
                            let data = reader.result;
                            img.onload = () => {
                                let canvas = document.createElement('canvas');
                                let ctx = canvas.getContext('2d');
                                ctx.drawImage(img, 0, 0, 1200, 1200);
                                this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, canvas.toDataURL("image/jpeg"));
                                if (!button.autoManaged) {
                                    if (!button.callback) {
                                        this.handlecanvasToolbar(button.__name, data);
                                    } else {
                                        button.callback(state, buttonKey, data, id, UPDATE_TOOLBAR);
                                    }
                                }
                            };
                            img.src = data;
                        };
                        reader.readAsDataURL(file);
                        return;
                    }
                    return;

                }

                if (button.type === 'background_picker') {
                    if(e.color) {
                        value = { background: e.color, attr: 'full' };
                        if (!value) {
                            return;
                        }
                    }

                    if(e.target && e.target.type === "radio") {
                        value = { background: button.value.background, attr: e.target.value };
                    }

                    if(e.target && e.target.type === "text") {
                        value = { background: e.target.value, attr: 'full' };
                    }

                    if(e.currentTarget && e.currentTarget.type === "button") {
                        value = { background: e.currentTarget.value, attr: 'full' };
                    }
                    if (e.target && e.target.files) {
                        if(e.target.files.length === 1) {
                            let file = e.target.files[0];
                            let reader = new FileReader();
                            reader.onload = () => {
                                let img = new Image();
                                let data = reader.result;
                                img.onload = () => {
                                    let canvas = document.createElement('canvas');
                                    let ctx = canvas.getContext('2d');
                                    ctx.drawImage(img, 0, 0, 1200, 1200);
                                    this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, { background: data, attr: 'full' });
                                    if (!button.autoManaged) {
                                        if (!button.callback) {
                                            this.handlecanvasToolbar(button.__name, { background: data, attr: 'full' });
                                        } else {
                                            button.callback(state, buttonKey, data, id, UPDATE_TOOLBAR);
                                        }
                                    }
                                };
                                img.src = data;
                            };

                            reader.readAsDataURL(file);
                            return;
                        }
                        return;
                    }

                }

                if (button.type === 'checkbox') {
                    value = !button.checked;
                }

                if (button.type === 'radio') {
                    value = button.options[value];
                    if (buttonKey === '__position') {
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, '__position', value);
                        let parentId = this.props.box.parent;
                        let containerId = this.props.box.container;
                        this.props.onBoxMoved(id, 0, 0, value, parentId, containerId);
                        if (isSortableContainer(containerId)) {
                            let newHeight = parseFloat(document.getElementById(containerId).clientHeight, 10);
                            this.props.onSortableContainerResized(containerId, parentId, newHeight);
                        }
                    }
                }

                if (button.type === 'select' && button.multiple === true) {
                    value = button.value;
                    let ind = button.value.indexOf(e);
                    value = e; // [...e.target.options].filter(o => o.selected).map(o => o.value);
                }

                if (button.type === 'colorOptions') {
                    value = e.value;
                }
                if (button.type === 'color') {
                    value = e.color;
                    if (!value) {
                        return;
                    }
                }

                this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, value);

                if (!button.autoManaged) {
                    if (!button.callback) {
                        this.handlecanvasToolbar(button.__name, value);
                    } else {
                        button.callback(state, buttonKey, value, id, UPDATE_TOOLBAR);
                    }

                }
            },

        };

        if (button.type === "color") {
            return React.createElement(
                FormGroup,
                { key: button.__name },
                [
                    React.createElement(
                        ControlLabel,
                        { key: 'label_' + button.__name },
                        button.__name),
                    /* React.createElement(
                      FormControl,
                        props,
                        null
                    ),*/
                    React.createElement(
                        ColorPicker, { key: props.label, value: props.value, onChange: props.onChange },
                        []),
                ]);

        }

        if (button.type === "image_file") {
            let isURI = (/data\:/).test(props.value);
            return React.createElement(
                FormGroup,
                { key: button.__name }, [
                    React.createElement(
                        ControlLabel,
                        { key: 'label_' + button.__name, value: button.value },
                        button.__name),
                    React.createElement('div', { key: 'container_' + button.__name, style: { display: 'block' } },
                        React.createElement(
                            FileInput, {
                                key: 'fileinput_' + props.label,
                                value: props.value,
                                onChange: props.onChange,
                                style: { width: '100%' },
                            },
                            React.createElement('div', {
                                style: { backgroundImage: isURI ? 'url(' + props.value + ')' : 'none', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' },
                                key: "inside_" + props.label,
                                className: 'fileDrag_toolbar',
                            }, isURI ? null : [
                                React.createElement('span', { key: props.label + "1" }, i18n.t('FileInput.Drag')),
                                React.createElement('span', { key: props.label + "2", className: "fileUploaded" }, [
                                    React.createElement('i', {
                                        key: 'icon_' + button.__name,
                                        className: 'material-icons',
                                    }, 'insert_drive_file'),
                                ]),
                            ])
                        )
                    ),
                ]);
        }

        if (button.type === "background_picker") {

            let isURI = (/data\:/).test(props.value.background);
            let isColor = (/rgb[a]?\(\d+\,\d+\,\d+(\,\d)?\)/).test(props.value.background);
            let default_background = "#ffffff";
            let isSli = isSlide(this.props.navItems[this.props.navItemSelected].type);

            return React.createElement(
                FormGroup,
                { key: button.__name },
                [
                    React.createElement(
                        ControlLabel,
                        { key: 'label1_' + button.__name },
                        i18n.t('background.background_color')),
                    React.createElement(
                        ColorPicker, { key: "cpicker_" + props.label, value: isColor ? props.value.background : default_background, onChange: props.onChange },
                        []),
                    isSli && React.createElement(
                        ControlLabel,
                        { key: 'label2_' + button.__name, value: button.value.background },
                        i18n.t('background.background_image')),
                    isSli && React.createElement('div',
                        { key: 'container_' + button.__name, style: { display: 'block' } },
                        [React.createElement(
                            FileInput, {
                                key: 'fileinput_' + props.label,
                                value: props.value.background,
                                onChange: props.onChange,
                                style: { width: '100%' },
                            },
                            React.createElement('div', {
                                style: { backgroundImage: isURI ? 'url(' + props.value.background + ')' : 'none', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' },
                                key: "inside_" + props.label,
                                className: 'fileDrag_toolbar',
                            }, isURI ? null : [
                                React.createElement('span', { key: props.label + "1", className: "uploadFile" }, i18n.t('FileInput.Drag') + i18n.t('FileInput.Drag_2') + i18n.t('FileInput.Click')),
                                React.createElement('span', { key: props.label + "2", className: "fileUploaded" }),
                            ])
                        ),
                        React.createElement(
                            FormGroup,
                            { key: button.__name },
                            [
                                React.createElement(
                                    ControlLabel,
                                    { key: 'labelurlinput_' + button.__name },
                                    i18n.t('background.background_input_url')),
                                React.createElement(FormControl,
                                    {
                                        key: 'urlinput_' + props.label,
                                        value: isURI || isColor ? '' : props.value.background,
                                        onChange: props.onChange,
                                    }, null),
                            ]),
                        (!isColor) && React.createElement(Radio, { key: 'full_', name: 'image_display', checked: props.value.attr === 'full', onChange: props.onChange, value: 'full' }, i18n.t('background.cover')),
                        (!isColor) && React.createElement(Radio, { key: 'repeat', name: 'image_display', checked: props.value.attr === 'repeat', onChange: props.onChange, value: 'repeat' }, i18n.t('background.repeat')),
                        (!isColor) && React.createElement(Radio, { key: 'centered', name: 'image_display', checked: props.value.attr === 'centered', onChange: props.onChange, value: 'centered' }, i18n.t('background.centered')),
                        ]
                    ),
                    React.createElement(
                        Button, {
                            value: default_background,
                            key: 'button_' + button.__name,
                            onClick: props.onChange,
                            className: "toolbarButton",
                        },
                        React.createElement("div", { key: props.label }, i18n.t('background.reset_background')),
                    ),
                ]);
        }

        if (button.type === "button") {
            return React.createElement(
                FormGroup,
                { key: button.__name }, [
                    React.createElement(
                        ControlLabel,
                        { key: 'label_' + button.__name },
                        button.__name),
                    React.createElement(
                        Button, {
                            key: 'button_' + button.__name,
                            onClick: props.onChange,
                            className: "toolbarButton",
                        },
                        [
                            React.createElement("div", { key: props.label }, button.displayLabel),
                        ]),
                ]);
        }

        if (button.options) {
            if (button.type === "colorOptions") {
                props.options = button.options;
                props.optionRenderer = this.renderOption;
                props.valueRenderer = this.renderValue;
                return React.createElement(
                    FormGroup,
                    { key: button.__name },
                    [
                        React.createElement(
                            ControlLabel,
                            { key: 'label_' + button.__name },
                            button.__name),
                        React.createElement(
                            Select,
                            props,
                            null),
                    ]
                );
            }

            if (button.type === "select") {
                if (!button.multiple) {
                    button.options.map((option, index) => {
                        if (!children) {
                            children = [];
                        }
                        children.push(React.createElement('option', { key: 'child_' + index, value: option }, option));
                    });
                    props.componentClass = 'select';
                    return React.createElement(
                        FormGroup,
                        { key: button.__name },
                        [
                            React.createElement(
                                ControlLabel,
                                { key: 'label_' + button.__name },
                                button.__name),
                            React.createElement(
                                FormControl,
                                props,
                                children),
                        ]
                    );
                }

                props.multiple = 'multiple';
                props.options = button.options;
                props.multi = true;
                props.simpleValue = true;
                props.placeholder = "No has elegido ninguna opción";
                return React.createElement(
                    FormGroup,
                    { key: button.__name },
                    [
                        React.createElement(
                            ControlLabel,
                            { key: 'label_' + button.__name },
                            button.__name),
                        React.createElement(
                            Select,
                            props,
                            null),
                    ]
                );
            }

            if (button.type === 'radio') {
                button.options.map((radio, index) => {
                    if (!children) {
                        children = [];
                        children.push(React.createElement(ControlLabel, { key: 'child_' + index }, button.__name));
                    }
                    children.push(React.createElement(Radio, {
                        key: index,
                        name: button.__name,
                        value: index,
                        id: (button.__name + radio),
                        onChange: props.onChange,
                        checked: (button.value === button.options[index]),
                    }, radio));
                });
                return React.createElement(FormGroup, props, children);
            }

            if (button.type === 'fancy_radio') {
                if (buttonKey === '__verticalAlign') {
                    return React.createElement(RadioButtonFormGroup, {
                        key: button.__name,
                        title: button.__name,
                        options: button.options,
                        selected: button.value,
                        click: (option) => {
                            this.props.onVerticallyAlignBox(this.props.boxSelected, option);
                        },
                        tooltips: button.tooltips,
                        icons: button.icons,
                    }, null);
                }
                return null;
            }
        }

        if (button.type === 'checkbox') {
            delete props.style.width;
            return React.createElement(
                FormGroup,
                { key: (button.__name) },
                [React.createElement(
                    ToggleSwitch,
                    props,
                    button.__name),
                <label key={buttonKey + 'label'} style={{ display: 'inline-block' }}>{props.label}</label>]
            );
        }

        if (button.type === 'conditionalText') {
            props.style.marginTop = '5px';
            props.style.marginBottom = '15px';

            return React.createElement(
                FormGroup,
                {
                    key: button.__name,
                    style: { display: accordion.buttons[button.associatedKey].checked ? "block" : "none" },
                },
                [
                    React.createElement(
                        "span",
                        { key: 'output_span' + button.__name, className: 'rangeOutput' },
                        button.type === "range" ? button.value : null),
                    React.createElement(
                        FormControl,
                        props,
                        null),
                ]
            );
        }

        if (button.type === "external_provider") {
            return React.createElement(ExternalProvider, {
                key: button.__name,
                formControlProps: props,
                isBusy: this.props.isBusy,
                fetchResults: this.props.fetchResults,
                onFetchVishResources: this.props.onFetchVishResources,
                onUploadVishResource: this.props.onUploadVishResource,
                onChange: props.onChange,
                accept: button.accept,
            }, null);
        }

        // If it's none of previous types (number, text, color, range, ...)
        if (buttonKey === '__width' || buttonKey === '__height') {
            let advancedPanel = (
                <FormGroup>
                    <ToggleSwitch label={i18n.t("Auto")}
                        checked={button.auto}
                        onChange={props.onChange}/>
                    {i18n.t("Auto")} <br/>
                    {/* Disable px size in slides*/}
                    {isSlide(this.props.navItems[this.props.navItemSelected].type) ?
                        (<span/>) :
                        (<div><br/>
                            <ControlLabel>{i18n.t("Units")}</ControlLabel>
                            <FormControl componentClass='select'
                                value={button.units}
                                onChange={props.onChange}>
                                <option value="px">{i18n.t("Pixels")}</option>
                                <option value="%">{i18n.t("Percentage")}</option>
                            </FormControl></div>)}
                </FormGroup>
            );

            props.value = button.auto ? 'auto' : button.value;
            props.type = button.auto ? 'text' : 'number';
            props.disabled = button.auto;
            return (
                <FormGroup key={button.__name}>
                    <ControlLabel key={"label_" + button.__name}>
                        {button.__name + (!button.auto ? " (" + button.units + ")" : "")}
                    </ControlLabel>
                    <InputGroup>
                        <FormControl {...props} />
                        <OverlayTrigger trigger="click"
                            placement="bottom"
                            rootClose
                            overlay={
                                <Popover id="advancedpanel"
                                    className="advancedPopover"
                                    title={i18n.t('Advanced')}>
                                    {advancedPanel}
                                </Popover>
                            }>
                            <InputGroup.Addon className="gc_addon">
                                <i className="material-icons gridconficons">settings</i>
                            </InputGroup.Addon>
                        </OverlayTrigger>
                    </InputGroup>
                </FormGroup>
            );
        }
        if (button.type === 'range') {
            props.className = "rangeInput";
            return React.createElement(
                FormGroup,
                { key: button.__name },
                [
                    React.createElement(
                        ControlLabel,
                        { key: 'label_' + button.__name },
                        button.__name),
                    React.createElement(
                        "span",
                        { key: 'output_span' + button.__name, className: 'rangeOutput' },
                        button.type === "range" ? button.value : null),
                    React.createElement(
                        FormControl,
                        props,
                        null),
                ]
            );
        }
        return React.createElement(
            FormGroup,
            { key: button.__name },
            [
                React.createElement(
                    ControlLabel,
                    { key: 'label_' + button.__name },
                    button.__name),
                React.createElement(
                    FormControl,
                    props,
                    null),
            ]
        );
    }

    /**
     * Renders options or multiple select inputs
     * @param option Option object wihth its label
     * @returns {code}
     */
    renderOption(option) {
        return (
            <span>{option.label}<i style={{ color: option.color, float: 'right' }} className="fa fa-stop"/></span>
        );
    }

    /**
     * Render option value
     * @param option Option object wihth its label
     * @returns {code}
     */
    renderValue(option) {
        return (
            <span>{option.label}</span>
        );
    }

    onDropImage(event) {
        let files = event.target.files;

        if (event.target.files.length === 1) {
            this.setState({ file: event.target.files[0] });
        }
    }

}

PluginToolbar.propTypes = {
    /**
   * Id of the selected page
   */
    navItemSelected: PropTypes.any,
    /**
   *
   */
    top: PropTypes.string,
    /**
   * Id of the selected box
   */
    boxSelected: PropTypes.any,
    /**
   * Object containing all the toolbars
   */
    toolbars: PropTypes.object.isRequired,
    /**
   * Indicates whether the index has been expanded or not
   */
    carouselShow: PropTypes.bool,
    /**
   *
   */
    box: PropTypes.object,
    /**
   * Callback for toggling the CKEDitor
   */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
   * Changes columns distribution
   */
    onColsChanged: PropTypes.func.isRequired,
    /**
   * Changes rows distribution
   */
    onRowsChanged: PropTypes.func.isRequired,
    /**
   * Changes sortable container properties
   */
    onSortablePropsChanged: PropTypes.func.isRequired,
    /**
   * Resizes sortable container
   */
    onSortableContainerResized: PropTypes.func.isRequired,
    /**
   * Object that contains all created views (identified by its *id*)
   */
    navItems: PropTypes.object.isRequired,
    /**
   *
   */
    onBackgroundChanged: PropTypes.func.isRequired,
    /**
   *
   */
    titleModeToggled: PropTypes.func.isRequired,
    /**
   *
   */
    onNavItemToggled: PropTypes.func.isRequired,
    /**
   *
   */
    onContainedViewNameChanged: PropTypes.func.isRequired,
    /**
   *
   */
    onNavItemNameChanged: PropTypes.func.isRequired,
    /**
   *
   */
    onRichMarksModalToggled: PropTypes.func.isRequired,
    /**
   *
   */
    onRichMarkEditPressed: PropTypes.func.isRequired,
    /**
   *
   */
    onRichMarkDeleted: PropTypes.func.isRequired,
    /**
   *
   */
    onBoxResized: PropTypes.func.isRequired,
    /**
   *
   */
    onToolbarUpdated: PropTypes.func.isRequired,
    /**
   *
   */
    onBoxMoved: PropTypes.func.isRequired,
    /**
   *
   */
    onVerticallyAlignBox: PropTypes.func.isRequired,
    /**
   *
   */
    isBusy: PropTypes.any,
    /**
   *
   */
    fetchResults: PropTypes.any,
    /**
   *
   */
    onFetchVishResources: PropTypes.func.isRequired,
    /**
   *
   */
    onUploadVishResource: PropTypes.func.isRequired,
};
