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

import { renderAccordion } from "../../../../core/editor/accordion_provider";
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
    }

    /**
     * Render React component
     * @returns {code}
     */
    render() {
        let toolbar = this.props.pluginToolbars[this.props.box.id];
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
                                                return renderAccordion(
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

    /* Handlecanvas toolbar
        case i18n.t('background.background'):
            let isColor = (/rgb[a]?\(\d+\,\d+\,\d+(\,\d)?\)/).test(value.background);
            if(isColor) {
                this.props.onBackgroundChanged(this.props.navItemSelected, value.background);
            } else {
                this.props.onBackgroundChanged(this.props.navItemSelected, value);
            }
            break;
           */

    /* if (button.type === 'image_file') {
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

         }*/

    /*
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
                                style: { backgroundImage: isURI ? 'url(' + props.value + ')' : 'none' },
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
            let default_background = "rgb(255,255,255)";
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
                                style: { backgroundImage: isURI ? 'url(' + props.value.background + ')' : 'none' },
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
                        (!isColor) && React.createElement(Radio, { key: 'full_', name: 'image_display', checked: props.value.attr === 'full', onChange: props.onChange, value: 'full' }, 'full'),
                        (!isColor) && React.createElement(Radio, { key: 'repeat', name: 'image_display', checked: props.value.attr === 'repeat', onChange: props.onChange, value: 'repeat' }, 'repeat'),
                        (!isColor) && React.createElement(Radio, { key: 'centered', name: 'image_display', checked: props.value.attr === 'centered', onChange: props.onChange, value: 'centered' }, 'centered'),
                        ]
                    ),
                    React.createElement(
                        ControlLabel,
                        { key: 'label_' + button.__name },
                        i18n.t('background.reset_background')),
                    React.createElement(
                        Button, {
                            value: default_background,
                            key: 'button_' + button.__name,
                            onClick: props.onChange,
                            className: "toolbarButton",
                        },
                        React.createElement("div", { key: props.label }, "Reset"),
                    ),
                ]);
        }*/

}

PluginToolbar.propTypes = {
    /**
   *
   */
    navItemSelected: PropTypes.any,
    /**
   *
   */
    top: PropTypes.string,
    /**
   *
   */
    boxSelected: PropTypes.any,
    /**
   *
   */
    toolbars: PropTypes.object.isRequired,
    /**
   *
   */
    carouselShow: PropTypes.bool,
    /**
   *
   */
    box: PropTypes.object,
    /**
   *
   */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
   *
   */
    onColsChanged: PropTypes.func.isRequired,
    /**
   *
   */
    onRowsChanged: PropTypes.func.isRequired,
    /**
   *
   */
    onSortablePropsChanged: PropTypes.func.isRequired,
    /**
   *
   */
    onSortableContainerResized: PropTypes.func.isRequired,
    /**
   *
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
