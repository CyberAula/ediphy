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

import { renderAccordion, toolbarMapper, toolbarFiller } from "../../../../core/editor/accordion_provider";
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
        let apiPlugin = Ediphy.Plugins.get(toolbar.pluginId);
        let config;
        let controls;
        if(apiPlugin) {
            config = apiPlugin.getConfig();
            controls = apiPlugin.getToolbar(toolbar.state);
        } else {
            config = {};
            controls = {};
        }
        // We define the extra buttons we need depending on plugin's configuration
        let textButton;
        if (config.needsTextEdition) {
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
        if (config && config.needsConfigModal) {
            configButton = (
                <div className="panel-body">
                    <Button key={'config'}
                        className='toolbarButton'
                        onClick={() => {
                            console.log(toolbar.id);
                            this.props.openConfigModal(toolbar.id);
                            // Ediphy.Plugins.get(toolbar.pluginId).openConfigModal(UPDATE_BOX, toolbar.state, toolbar.id);
                        }}>
                        <i className="toolbarIcons material-icons">build</i>
                        {i18n.t('open_conf')}
                    </Button>
                </div>
            );
        }
        if(apiPlugin) {
            toolbarFiller(controls, this.props.box.id, toolbar, config, config, this.props.box.parent, null);
            controls = toolbarMapper(controls, toolbar);
        } else {
            controls = {
                main: {
                    __name: "Main",
                    accordions: {},
                },
            };
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
                        style={{ display: 'block' }}
                        className={this.props.open ? 'carouselListTitle toolbarSpread' : 'carouselListTitle toolbarHide'}>
                            <div className="toolbarTitle">
                                <i className="material-icons">settings</i>
                                <span className="toolbarTitletxt">
                                    {i18n.t('Properties')}
                                </span>
                            </div>
                            <div className="pluginTitleInToolbar">
                                {config.displayName || ""}
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
                                                    controls,
                                                    ind,
                                                    this.props
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
