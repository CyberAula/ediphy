import React, { Component } from 'react';
import { Tooltip, FormControl, OverlayTrigger, Popover, InputGroup, FormGroup, Radio, ControlLabel, Checkbox, Button, PanelGroup, Panel } from 'react-bootstrap';
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
import { isSortableContainer, isCanvasElement, isContainedView, isSlide } from '../../../../common/utils';
import i18n from 'i18next';
import './_pluginToolbar.scss';
import { renderAccordion } from "../../../../core/editor/accordion_provider";

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
        let xmlButton;
        if (toolbar.config.needsXMLEdition) {
            xmlButton = (
                <Button key={'xml'}
                    className={toolbar.showXMLEditor ? 'toolbarButton textediting' : 'toolbarButton'}
                    onClick={() => {
                        this.props.onXMLEditorToggled();
                    }}>
                    Edit XML
                </Button>
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
        let duplicateButton;
        if (this.props.box.id[1] !== 's') {
            duplicateButton = (
                <Button key={'duplicate'}
                    className="pluginToolbarMainButton"
                    onClick={e => {
                        this.props.onBoxDuplicated(this.props.box.id, this.props.box.parent, this.props.box.container);
                        e.stopPropagation();
                    }}>
                    <i className="material-icons">content_copy</i>
                </Button>
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
                    }} />
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
                                        {xmlButton}
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
