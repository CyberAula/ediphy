import React, {Component} from 'react';
import {Tooltip, FormControl, OverlayTrigger, FormGroup, Radio, ControlLabel, Checkbox,  Button, ButtonGroup, PanelGroup, Accordion, Panel, Tabs, Tab} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import GridConfigurator from '../components/GridConfigurator.jsx';
import RadioButtonFormGroup from '../components/RadioButtonFormGroup.jsx';
import Select from 'react-select';
import VishSearcher from './VishSearcher';
import MarksList from './rich_plugins/MarksList.jsx';
import ContentList from './rich_plugins/ContentList.jsx';
import Dali from './../core/main';
import {UPDATE_TOOLBAR} from '../actions';
import {ID_PREFIX_SORTABLE_CONTAINER} from '../constants';
import i18n from 'i18next';

export default class PluginToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            activeKey: 0
        };
        this.aspectRatio = false;
        this.heightAuto = true;
    }

    handleSelect(key) {
        this.setState({activeKey: key});
    }

    render() {
        if (this.props.boxSelected === -1) {
            return (
                /* jshint ignore:start */
                <div id="wrap"
                     className="wrapper hiddenWrapper"
                     style={{
                        top: this.props.top,
                     }}>
                    <div id="tools" className="toolbox">
                    </div>
                </div>
                /* jshint ignore:end */
            );
        }

        let toolbar = this.props.toolbars[this.props.box.id];
        let textButton;
        if (toolbar.config && toolbar.config.needsTextEdition) {
            textButton = (
                /* jshint ignore:start */
                <Button key={'text'}
                        className={toolbar.showTextEditor ? 'toolbarButton textediting' : 'toolbarButton'}
                        onClick={() => {
                            this.props.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor);
                        }}>
                    Edit text
                </Button>
                /* jshint ignore:end */
            );
        }
        let xmlButton;
        if (toolbar.config && toolbar.config.needsXMLEdition) {
            xmlButton = (
                /* jshint ignore:start */
                <Button key={'xml'}
                        className={toolbar.showXMLEditor ? 'toolbarButton textediting' : 'toolbarButton'}
                        onClick={() => {
                            this.props.onXMLEditorToggled();
                        }}>
                    Edit XML
                </Button>
                /* jshint ignore:end */
            );
        }
        let configButton;
        if (toolbar.config && toolbar.config.needsConfigModal) {
            configButton = (
                /* jshint ignore:start */
                <Button key={'config'}
                        className='toolbarButton'
                        onClick={() => {
                            Dali.Plugins.get(toolbar.config.name).openConfigModal(true, toolbar.state, toolbar.id);
                        }}>
                    Open config
                </Button>
                /* jshint ignore:end */
            );
        }


        let deletebutton;
        if (this.props.box.id[1] !== 's') {
            deletebutton = (
                /* jshint ignore:start */
                <Button key={'delete'}
                        className="pluginToolbarMainButton"
                        onClick={e => {
                            this.props.onBoxDeleted(this.props.box.id, this.props.box.parent, this.props.box.container);
                            e.stopPropagation();
                        }}>
                    <i className="material-icons">delete</i>
                </Button>
                /* jshint ignore:end */
            );
        }
        let duplicateButton;
        if (this.props.box.id[1] !== 's') {
            duplicateButton = (
                /* jshint ignore:start */
                <Button key={'duplicate'}
                        className="pluginToolbarMainButton"
                        onClick={e => {
                            this.props.onBoxDuplicated(this.props.box.id, this.props.box.parent, this.props.box.container);
                            e.stopPropagation();
                        }}>
                    <i className="material-icons">content_copy</i>
                </Button>
                /* jshint ignore:end */
            );
        }

        let visible = (Object.keys(toolbar.controls).length !== 0 || this.props.box.children.length !== 0); //? 'visible' : 'hidden';

        return (
            /* jshint ignore:start */
            <div id="wrap"
                 className="wrapper"
                 style={{
                        right: '0px',
                        top: this.props.top,
                        visibility: visible
                     }}>
                <div className="pestana" onClick={() => {this.setState({open: !this.state.open})}}></div>
                <div id="tools" style={{width:  this.state.open? '250px':'40px'}} className="toolbox">
                    <OverlayTrigger placement="left"
                                    overlay={ <Tooltip className={this.state.open ? 'hidden':''} id="tooltip_props" >{i18n.t('Properties')}</Tooltip>}>
                        <div onClick={() => {this.setState({open: !this.state.open})}}
                             style={{display: this.props.carouselShow? 'block':'none'}}
                             className={this.state.open ? 'carouselListTitle toolbarSpread':'carouselListTitle toolbarHide'}>

                            <div className="toolbarTitle"><i className="material-icons">settings</i><span
                                className="toolbarTitletxt">{i18n.t('Properties')}</span></div>
                            <div
                                className="pluginTitleInToolbar"> {toolbar.config.displayName || toolbar.config.name || ""}</div>
                        </div>
                    </OverlayTrigger>
                    <div id="insidetools" style={{display: this.state.open? 'block':'none'}}>
                        <div className="toolbarTabs" id="controlledTabs">
                            {Object.keys(toolbar.controls).map((tabKey, index) => {
                                let tab = toolbar.controls[tabKey];
                                return (
                                    <div key={'key_'+index} className={"toolbarTab"}>
                                        <PanelGroup >
                                            {Object.keys(tab.accordions).sort().map((accordionKey, index) => {
                                                let accordion = tab.accordions[accordionKey];
                                                return this.renderAccordion(accordion, tabKey, [accordionKey], toolbar.state, index);
                                            })}
                                            {this.props.box.children.map((id, index) => {
                                                let container = this.props.box.sortableContainers[id];
                                                if (tabKey === "main") {
                                                    return (
                                                        <Panel key={'panel_' + id}
                                                               className="panelPluginToolbar"
                                                               collapsible
                                                               onEnter={(panel) => {panel.parentNode.classList.add("extendedPanel")}}
                                                               onExited={(panel) => {panel.parentNode.classList.remove("extendedPanel")}}
                                                               header={<span><i className="toolbarIcons material-icons">web_asset</i>{(this.props.toolbars[this.props.box.id].state && this.props.toolbars[this.props.box.id].state.__pluginContainerIds && this.props.toolbars[this.props.box.id].state.__pluginContainerIds[container.key].name) ? this.props.toolbars[this.props.box.id].state.__pluginContainerIds[container.key].name : (i18n.t('Block') + ' '+ (index + 1))}</span>}>
                                                            <GridConfigurator id={id}
                                                                              parentId={this.props.box.id}
                                                                              container={container}
                                                                              onColsChanged={this.props.onColsChanged}
                                                                              onRowsChanged={this.props.onRowsChanged}
                                                                              sortableProps={this.props.box.sortableContainers[id]}
                                                                              onChangeSortableProps={this.props.onChangeSortableProps}
                                                                              onSortableContainerResized={this.props.onSortableContainerResized}/>
                                                        </Panel>)
                                                }
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
            /* jshint ignore:end */
        );
    }

    renderAccordion(accordion, tabKey, accordionKeys, state, key) {
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
                /* jshint ignore:start */
                <span key={'span' + key}>
                    <i className="toolbarIcons material-icons">
                        {accordion.icon ? accordion.icon : <span className="toolbarIcons"/>}
                    </i>{accordion.__name}
                </span>
                /* jshint ignore:end */
            )
        };
        let children = [];
        if (accordion.order) {
            for (let i = 0; i < accordion.order.length; i++) {
                if (accordion.accordions[accordion.order[i]]) {
                    children.push(this.renderAccordion(accordion.accordions[accordion.order[i]], tabKey, [accordionKeys[0], accordion.order[i]], state, i));
                } else if (accordion.buttons[accordion.order[i]]) {
                    children.push(this.renderButton(accordion, tabKey, accordionKeys, accordion.order[i], state, i));
                } else {
                    console.error("Element %s not defined", accordion.order[i]);
                }
            }
        } else {
            let buttonKeys = Object.keys(accordion.buttons);
            for (let i = 0; i < buttonKeys.length; i++) {
                let w = (buttonKeys[i] === 'width' || buttonKeys[i] === 'height') ? '40%' : '100%';
                let m = (buttonKeys[i] === 'width' || buttonKeys[i] === 'height') ? '5%' : '0px';
                children.push(
                    /* jshint ignore:start */
                    <div key={'div_' + i } style={{width: w, marginRight: m, display: 'inline-block'}}>
                        {this.renderButton(accordion, tabKey, accordionKeys, buttonKeys[i], state, i)}
                    </div>
                    /* jshint ignore:end */
                );

            }

        }

        if (accordion.key === 'structure' && this.props.box.container.length && this.props.box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1) {
            children.push(
                /* jshint ignore:start */
                <RadioButtonFormGroup key="verticalalignment"
                                      title={i18n.t('Vertical_align')}
                                      options={['top', 'middle', 'bottom']}
                                      selected={this.props.box.verticalAlign ? this.props.box.verticalAlign : 'top'}
                                      click={(option) => {this.props.onVerticallyAlignBox(this.props.boxSelected, option)}}
                                      tooltips={[i18n.t('messages.align_top'),i18n.t('messages.align_middle'),i18n.t('messages.align_bottom')]}
                                      icons={['vertical_align_top', 'vertical_align_center', 'vertical_align_bottom']}/>
                /* jshint ignore:end */
            );
        }

        if (accordion.key === 'marks_list') {
            children.push(
                /* jshint ignore:start */
                <MarksList key="marks_list"
                           state={state}
                           onRichMarksModalToggled={this.props.onRichMarksModalToggled}
                           onRichMarkEditPressed={this.props.onRichMarkEditPressed}
                           onRichMarkDeleted={this.props.onRichMarkDeleted}/>
                /* jshint ignore:end */
            );
        }

        if (accordion.key === 'content_list') {
            children.push(
                /* jshint ignore:start */
                <ContentList key="content_list"
                             state={state}
                             box={this.props.box}
                             navItems={this.props.navItems}
                             onContainedViewSelected={this.props.onContainedViewSelected}
                             onNavItemSelected={this.props.onNavItemSelected}
                             onRichMarkDeleted={this.props.onRichMarkDeleted}/>
                /* jshint ignore:end */
            );
        }
        return React.createElement(Panel, props, children);
    }

    renderButton(accordion, tabKey, accordionKeys, buttonKey, state, key) {
        let button = accordion.buttons[buttonKey];
        if (buttonKey === '__aspectRatio') {
            this.aspectRatio = (button.value === "checked");
        }
        if (buttonKey === '___heightAuto') {
            this.heightAuto = (button.value === "checked");
        }
        let children;
        let id = this.props.box.id;
        let props = {
            key: ('child_' + key),
            type: button.type,
            value: button.type === 'number' ? parseFloat(button.value) : button.value,
            label: button.__name,
            min: button.min,
            max: button.max,
            step: button.step,
            disabled: false,
            title: button.title ? button.title : '',
            className: button.class,
            style: {width: '100%'},
            onChange: e => {
                let value = e.target ? e.target.value : e.target;
                if (buttonKey === '___heightAuto') {
                    let units = (!(this.props.box.container.length && this.props.box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1)) ? 'px' : '%';
                    this.heightAuto = this.props.box.height !== 'auto';
                    
                    this.props.onToolbarUpdated(id, tabKey, accordionKeys, 'height', this.heightAuto ? 'auto' : (100 + units));
                    this.props.onBoxResized(id, this.props.box.width, this.heightAuto ? 'auto' : ('100' + units));

                }
                if (buttonKey === 'width') {
                    let units = (!(this.props.box.container.length && this.props.box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1)) ? 'px' : '%';
                    if (!this.aspectRatio) {
                        let newHeight = parseFloat(value);
                        if (this.heightAuto) {
                            newHeight = 'auto';
                        }
                        this.props.onBoxResized(id, value + units, this.props.box.height);
                        this.props.onToolbarIntermediateUpdated(id, tabKey, accordionKeys, buttonKey, parseFloat(value));
                    } else {
                        let newHeight = this.heightAuto ? 'auto' : (parseFloat(this.props.box.height) * parseFloat(value) / parseFloat(this.props.box.width));
                        this.props.onBoxResized(id, value + units, this.heightAuto ? newHeight : (newHeight + units));
                        this.props.onToolbarIntermediateUpdated(id, tabKey, accordionKeys, buttonKey, parseFloat(value));
                        this.props.onToolbarIntermediateUpdated(id, tabKey, accordionKeys, 'height', newHeight);

                    }
                }
                if (buttonKey === 'height') {
                    let units = (!(this.props.box.container.length && this.props.box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1)) ? 'px' : '%';
                    if (!this.aspectRatio) {
                        this.props.onBoxResized(id, this.props.box.width, value + units);
                        this.props.onToolbarIntermediateUpdated(id, tabKey, accordionKeys, buttonKey, parseFloat(value));
                    } else {
                        let newWidth = (parseFloat(this.props.box.width) * parseFloat(value) / parseFloat(this.props.box.height));
                        this.props.onBoxResized(id, newWidth + units, value + units);
                        this.props.onToolbarIntermediateUpdated(id, tabKey, accordionKeys, buttonKey, parseFloat(value));
                        this.props.onToolbarIntermediateUpdated(id, tabKey, accordionKeys, 'width', newWidth);
                    }
                }

                if (button.type === 'number') {
                    value = parseFloat(value) || 0;
                    if (button.units) {
                        value = value + button.units;
                    }
                }
                if (button.type === 'checkbox') {
                    value = ( value === 'checked') ? 'unchecked' : 'checked';
                }
                if (button.type === 'radio') {
                    value = button.options[value];
                    if (buttonKey === '___position') {
                        this.props.onToolbarIntermediateUpdated(id, tabKey, accordionKeys, '___position', value);
                        this.props.onBoxMoved(id, 0, 0, value);

                    }
                }

                if (button.type === 'select' && button.multiple === true) {
                    value = button.value;
                    let ind = button.value.indexOf(e);
                    value = e;  //[...e.target.options].filter(o => o.selected).map(o => o.value);
                }
                /*                if (buttonKey == 'borderRadius'){
                 value = value + '%';
                 }*/
                if (button.type === 'colorPicker') {
                    value = e.value;
                }
                this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, value);

                if (!button.autoManaged ) {
                    button.callback(state, buttonKey, value, id, UPDATE_TOOLBAR);
                }
            }

        };
        if (buttonKey === 'height') {
            props.value = this.heightAuto ? 'auto' : parseFloat(this.props.box.height);
            props.disabled = this.heightAuto;
            props.type = this.heightAuto ? 'text' : 'number';
        }
        if (buttonKey === 'width') {
            props.value = parseFloat(this.props.box.width);
        }
        if (button.options && button.type === 'colorPicker') {
            props.options = button.options;
            props.optionRenderer = this.renderOption;
            props.valueRenderer = this.renderValue;
            return React.createElement(FormGroup, {key: button.__name}, [React.createElement(ControlLabel, {key: 'label_' + button.__name}, button.__name),
                React.createElement(Select, props, null)]);

        }

        if (button.options && button.type === 'select') {
            if (!button.multiple) {
                button.options.map((option, index) => {
                    if (!children) {
                        children = [];
                    }
                    children.push(React.createElement('option', {key: 'child_' + index, value: option}, option));
                });
                props.componentClass = 'select';

                return React.createElement(FormGroup, {key: button.__name}, [React.createElement(ControlLabel, {key: 'label_' + button.__name}, button.__name),
                    React.createElement(FormControl, props, children)]);

            } else {
                props.multiple = 'multiple';
                props.options = button.options;
                props.multi = true;
                props.simpleValue = true;
                props.placeholder = "No has elegido ninguna opción";
                return React.createElement(FormGroup, {key: button.__name}, [React.createElement(ControlLabel, {key: 'label_' + button.__name}, button.__name),
                    React.createElement(Select, props, null)]);
            }


        } else if (button.type === 'checkbox') {
            props.checked = button.value === 'checked';
            return React.createElement(FormGroup, {key: (button.__name)},
                React.createElement(Checkbox, props, button.__name));

        } else if (button.options && button.type === 'radio') {
            button.options.map((radio, index) => {
                if (!children) {
                    children = [];
                    children.push(React.createElement(ControlLabel, {key: 'child_' + index}, button.__name));
                }
                children.push(React.createElement(Radio, {
                    key: index,
                    name: button.__name,
                    value: index,
                    id: (button.__name + radio),
                    onChange: props.onChange,
                    checked: (button.value === button.options[index])
                }, radio));
            });
            return React.createElement(FormGroup, props, children);
        } else if (button.type === "vish_searcher") {
            return React.createElement(VishSearcher, {
                key: ('key' + button.__name),
                formControlProps: props,
                isBusy: this.props.isBusy,
                fetchResults: this.props.fetchResults,
                onFetchVishResources: this.props.onFetchVishResources,
                onChange: props.onChange
            }, null);
        } else {
            let output = button.type === "range" ? "   " + button.value : null;
            return React.createElement(FormGroup, {key: ('key' + button.__name)}, [React.createElement(ControlLabel, {key: 'label_' + button.__name}, button.__name), React.createElement("span", {
                key: 'output_span' + button.__name,
                className: 'rangeOutput'
            }, output),
                React.createElement(FormControl, props, null)]);
        }

    }

    renderOption(option) {
        return (
            /* jshint ignore:start */
            <span>{option.label}<i style={{color: option.color, float: 'right'}} className="fa fa-stop"></i></span>
            /* jshint ignore:end */
        );
    }

    renderValue(option) {
        return (
            /* jshint ignore:start */
            <span>{option.label}</span>
            /* jshint ignore:end */
        );
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.box && nextProps.box && this.props.box.id !== nextProps.box.id) {
            this.setState({activeKey: 0});
            nextState.activeKey = 0;
        }
    }


}
