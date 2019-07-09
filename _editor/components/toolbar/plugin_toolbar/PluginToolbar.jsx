import React, { Component } from 'react';
import {
    Button,
    PanelGroup,
    Panel,
} from 'react-bootstrap';
import GridConfigurator from '../grid_configurator/GridConfigurator.jsx';
import Ediphy from '../../../../core/editor/main';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import { UPDATE_TOOLBAR, UPDATE_BOX } from '../../../../common/actions';
import i18n from 'i18next';
import './_pluginToolbar.scss';
import { renderAccordion, toolbarMapper, toolbarFiller } from "../../../../core/editor/accordion_provider";
import PropTypes from 'prop-types';
import { blurCKEditor } from '../../../../common/common_tools';

/**
 * Toolbar component for configuring boxes or pages
 */
export default class PluginToolbar extends Component {
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
                            blurCKEditor(toolbar.id, (text, content)=>{
                                this.props.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor, text, content);});
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
                            this.props.openConfigModal(toolbar.id);
                        }}>
                        <i className="toolbarIcons material-icons">build</i>
                        {i18n.t('open_conf')}
                    </Button>
                </div>
            );
        }
        if(apiPlugin) {
            toolbarFiller(controls, this.props.box.id, toolbar, config, config, this.props.box.parent, null, this.props.exercises);
            controls = toolbarMapper(controls, toolbar);

        } else {
            controls = {
                main: {
                    __name: "Main",
                    accordions: {},
                },
            };
        }
        return Object.keys(controls).map((tabKey, index) => {
            let tab = controls[tabKey];
            let children = this.props.box.children ? [...this.props.box.children] : [];
            let collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
            children.sort(collator.compare);
            return (
                <div key={'key_' + index} className="toolbarTab">
                    <PanelGroup id="panel-group">
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
                        { children.map((id, ind) => {
                            let container = this.props.box.sortableContainers[id];
                            if (tabKey === "main") {
                                return (
                                    <Panel key={'panel_' + id} className={"panelPluginToolbar"}>
                                        <Panel.Heading key={'panel_' + id} className={"panel-heading"}>
                                            <Panel.Title toggle className={"titleA"} style={{ color: 'white', paddingTop: '0', paddingBottom: '0', paddingLeft: '0', fontSize: '14.4px' }}>
                                                <i className="toolbarIcons material-icons">web_asset</i>
                                                {(toolbar.state.__pluginContainerIds && toolbar.state.__pluginContainerIds[container.key].name) ?
                                                    toolbar.state.__pluginContainerIds[container.key].name :
                                                    (i18n.t('Block') + ' ' + (ind + 1))
                                                }
                                            </Panel.Title>
                                        </Panel.Heading>
                                        <Panel.Body collapsible>
                                            <GridConfigurator id={id}
                                                parentId={this.props.box.id}
                                                container={container}
                                                onColsChanged={this.props.onColsChanged}
                                                onRowsChanged={this.props.onRowsChanged}
                                                sortableProps={this.props.box.sortableContainers[id]}
                                                onSortablePropsChanged={this.props.handleSortableContainers.onSortablePropsChanged}
                                                onSortableContainerResized={this.props.handleSortableContainers.onSortableContainerResized}/>
                                        </Panel.Body>
                                    </Panel>);
                            }
                            return null;
                        })}
                    </PanelGroup>
                    {textButton}
                    {configButton}
                </div>
            );
        });
    }

}

PluginToolbar.propTypes = {
    /**
   * Selected box
   */
    box: PropTypes.object,
    /**
     * Collection of callbacks for sortable containers handling
     */
    handleSortableContainers: PropTypes.object.isRequired,
    /**
   * Callback for toggling the CKEDitor
   */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
   * Callback for change columns distribution
   */
    onColsChanged: PropTypes.func.isRequired,
    /**
   * Callback for change rows distribution
   */
    onRowsChanged: PropTypes.func.isRequired,
    /**
     * Callback for opening global configuration modal
     */
    openConfigModal: PropTypes.func,
    /**
     * Plugin toolbars
     */
    pluginToolbars: PropTypes.object,
    /**
     * Object containing all exercises
     */
    exercises: PropTypes.object,
};
