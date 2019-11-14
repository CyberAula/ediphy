import React, { Component } from 'react';
import { PanelGroup, Panel } from 'react-bootstrap';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import i18n from 'i18next';
import PropTypes from 'prop-types';

import GridConfigurator from '../gridConfigurator/GridConfigurator.jsx';
import Ediphy from '../../../../core/editor/main';

import { toolbarMapper, toolbarFiller } from "../../../../core/editor/toolbar/toolbarCreator";
import { renderAccordion } from "../../../../core/editor/toolbar/toolbarRenderer";
import { blurCKEditor } from '../../../../common/commonTools';

import _handlers from "../../../handlers/_handlers";
import { Accordion, ToolbarIcon } from "../Styles";
import { ToolbarButton } from "../toolbarComponents/Styles";

/**
 * Toolbar component for configuring boxes or pages
 */
export default class PluginToolbar extends Component {

    h = _handlers(this);

    /**
     * Render React component
     * @returns {code}
     */
    render() {
        let toolbar = this.props.pluginToolbarsById[this.props.box.id];
        let apiPlugin = Ediphy.Plugins.get(toolbar.pluginId);
        let config = apiPlugin ? apiPlugin.getConfig() : {};
        let controls = apiPlugin ? apiPlugin.getToolbar(toolbar.state) : {};

        if(apiPlugin) {
            toolbarFiller(controls, this.props.box.id, toolbar, config, config, this.props.box.parent, this.props.exercises);
            controls = toolbarMapper(controls, toolbar);

        } else {
            controls = {
                main: {
                    __name: "Main",
                    accordions: {},
                },
            };
            // eslint-disable-next-line no-console
            console.error("API could not find selected plugin. Please check plugin is intalled");
        }

        // We define the extra buttons we need depending on plugin's configuration
        let textButton;
        if (config.needsTextEdition) {
            textButton = (
                <div className="panel-body">
                    <ToolbarButton key={'text'}
                        className={toolbar.showTextEditor ? ' textediting' : ''}
                        onClick={() => {
                            blurCKEditor(toolbar.id, (text, content)=>{
                                this.h.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor, text, content);});
                        }}>
                        <ToolbarIcon>mode_edit</ToolbarIcon>
                        {i18n.t("edit_text")}1
                    </ToolbarButton>
                </div>
            );
        }

        let configButton;
        if (config && config.needsConfigModal) {
            configButton = (
                <div className="panel-body">
                    <ToolbarButton key={'config'}
                        onClick={() => {
                            this.props.openConfigModal(toolbar.id);
                        }}>
                        <ToolbarIcon>build</ToolbarIcon>
                        {i18n.t('open_conf')}
                    </ToolbarButton>
                </div>
            );
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
                                this
                            );
                        })}
                        { children.map((id, ind) => {
                            let container = this.props.box.sortableContainers[id];
                            if (tabKey === "main") {
                                return (
                                    <Accordion key={'panel_' + id} className={"panelPluginToolbar"}>
                                        <Panel.Heading key={'panel_' + id} className={"panel-heading"}>
                                            <Panel.Title toggle className={"titleA"} style={{ color: 'white', paddingTop: '0', paddingBottom: '0', paddingLeft: '0', fontSize: '14.4px' }}>
                                                <ToolbarIcon>web_asset</ToolbarIcon>
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
                                                onColsChanged={this.h.onColsChanged}
                                                onRowsChanged={this.h.onRowsChanged}
                                                sortableProps={this.props.box.sortableContainers[id]}
                                                onSortablePropsChanged={this.h.onSortablePropsChanged}
                                                onSortableContainerResized={this.h.onSortableContainerResized}/>
                                        </Panel.Body>
                                    </Accordion>
                                );
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
     * Callback for opening global configuration modal
     */
    openConfigModal: PropTypes.func,
    /**
     * Plugin toolbars
     */
    pluginToolbarsById: PropTypes.object,
    /**
     * Object containing all exercises
     */
    exercises: PropTypes.object,
};
