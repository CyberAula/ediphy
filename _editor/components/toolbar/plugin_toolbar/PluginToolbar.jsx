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
                            // Ediphy.Plugins.get(toolbar.pluginId).openConfigModal(UPDATE_BOX, toolbar.state, toolbar.id);
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
        });
    }

}

PluginToolbar.propTypes = {
    /**
   * Id of the selected page
   */
    navItemSelected: PropTypes.any,
    /**
   * Toolbar top position
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
   * Whether the index has been expanded or not
   */
    carouselShow: PropTypes.bool,
    /**
   * Selected box
   */
    box: PropTypes.object,
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
   * Callback for change sortable container properties
   */
    onSortablePropsChanged: PropTypes.func.isRequired,
    /**
   * Callback for resize sortable container
   */
    onSortableContainerResized: PropTypes.func.isRequired,
    /**
   * Object that contains all created views (identified by its *id*)
   */
    navItems: PropTypes.object.isRequired,
    /**
   * Callback for change the view background (color or image(slides))
   */
    onBackgroundChanged: PropTypes.func.isRequired,
    /**
   * Callback for toggling visibility or content on titles, subtitles, breadcrumbs
   */
    titleModeToggled: PropTypes.func.isRequired,
    /**
   * Callback for toggling navItem inclusion in the course
   */
    onNavItemToggled: PropTypes.func.isRequired,
    /**
   * Callback for edit contained view name
   */
    onContainedViewNameChanged: PropTypes.func.isRequired,
    /**
   * Callback for edit view name
   */
    onNavItemNameChanged: PropTypes.func.isRequired,
    /**
   * Callback for show/hide the rich marks modal
   */
    onRichMarksModalToggled: PropTypes.func.isRequired,
    /**
   * Callback for toggling edit mark
   */
    onRichMarkEditPressed: PropTypes.func.isRequired,
    /**
   * Callback for delete mark
   */
    onRichMarkDeleted: PropTypes.func.isRequired,
    /**
   * Callback for resizing a box
   */
    onBoxResized: PropTypes.func.isRequired,
    /**
   * Callback for updating toolbar
   */
    onToolbarUpdated: PropTypes.func.isRequired,
    /**
   * Callback for moving a box
   */
    onBoxMoved: PropTypes.func.isRequired,
    /**
   * Callback for vertically align a box (in a sortable container)
   */
    onVerticallyAlignBox: PropTypes.func.isRequired,
    /**
   * Indicates if there is a current server operation
   */
    isBusy: PropTypes.any,
    /**
   * Object containing all the resources search results
   */
    fetchResults: PropTypes.any,
    /**
   * Callback for fetch Vish Resources
   */
    onFetchVishResources: PropTypes.func.isRequired,
    /**
   * Callback for upload Vish Resources
   */
    onUploadVishResource: PropTypes.func.isRequired,
};
