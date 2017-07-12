import React, {Component} from 'react';
import {Tooltip, FormControl, OverlayTrigger, Popover, InputGroup, FormGroup, Radio, ControlLabel, Checkbox,  Button, ButtonGroup, PanelGroup, Accordion, Panel, Tabs, Tab} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import GridConfigurator from '../grid_configurator/GridConfigurator.jsx';
import RadioButtonFormGroup from '../radio_button_form_group/RadioButtonFormGroup.jsx';
import Select from 'react-select';
import VishProvider from './../../vish_provider/vish_provider/VishProvider';
import MarksList from './../../rich_plugins/marks_list/MarksList.jsx';
import ContentList from './../../rich_plugins/content_list/ContentList.jsx';
import Dali from './../../../core/main';
import {UPDATE_TOOLBAR, UPDATE_BOX, TOGGLE_NAV_ITEM, CHANGE_NAV_ITEM_NAME, TOGGLE_TITLE_MODE} from '../../../actions';
import {isSortableContainer, isCanvasElement, isContainedView, isSlide} from '../../../utils';
import i18n from 'i18next';

require('./_pluginToolbar.scss');

export default class PluginToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    render() {
        if (!isCanvasElement(this.props.navItemSelected, Dali.Config.sections_have_content)) {
            return (
                /* jshint ignore:start */
                <div id="wrap"
                     className="wrapper hiddenWrapper"
                     style={{
                        top: this.props.top
                     }}>
                    <div id="tools" className="toolbox">
                    </div>
                </div>
                /* jshint ignore:end */
            );
        }
        //when no plugin selected, but new navitem
        if (this.props.boxSelected === -1 && isCanvasElement(this.props.navItemSelected, Dali.Config.sections_have_content)) {
          let toolbar = this.props.toolbars[this.props.navItemSelected];
          return (
              /* jshint ignore:start */
              <div id="wrap"
                   className="wrapper"
                   style={{
                     right: '0px',
                      top: this.props.top
                   }}>
                   <div className="pestana"
                        onClick={() => {
                           this.setState({open: !this.state.open});
                        }}>
                   </div>
                  <div id="tools"
                       style={{
                          width: this.state.open ? '250px' : '40px'
                       }}
                       className="toolbox">
                       <OverlayTrigger placement="left"
                                       overlay={
                                           <Tooltip className={this.state.open ? 'hidden':''}
                                                    id="tooltip_props">
                                               {i18n.t('Properties')}
                                           </Tooltip>
                                       }>
                           <div onClick={() => {
                                   this.setState({open: !this.state.open});
                                }}
                                style={{display: this.props.carouselShow ? 'block' : 'block'}}
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
                       <div id="insidetools" style={{display: this.state.open ? 'block' : 'none'}}>
                         <div className="toolbarTabs">
                           {Object.keys(toolbar.controls).map((tabKey, index) => {
                               let tab = toolbar.controls[tabKey];
                               return (
                                 <div key={'key_'+index} className="toolbarTab">
                                   <PanelGroup>
                                     {Object.keys(tab.accordions).sort().map((accordionKey, index) => {
                                         return this.renderAccordion(
                                             tab.accordions[accordionKey],
                                             tabKey,
                                             [accordionKey],
                                             toolbar.state,
                                             index
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
              /* jshint ignore:end */
          );
        }
        let toolbar = this.props.toolbars[this.props.box.id];
        // We define the extra buttons we need depending on plugin's configuration
        let textButton;
        if (toolbar.config.needsTextEdition) {
            textButton = (
                /* jshint ignore:start */
                <Button key={'text'}
                        className={toolbar.showTextEditor ? 'toolbarButton textediting' : 'toolbarButton'}
                        onClick={() => {
                            this.props.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor);
                            if(!toolbar.showTextEditor && this.props.box && this.props.box.id) {
                                // Código duplicado en DaliBox, DaliShortcuts y PluginToolbar. Extraer a common_tools?
                                let CKstring = CKEDITOR.instances[this.props.box.id].getData();
                                let initString = "<p>" + i18n.t("text_here") + "</p>\n";
                                console.log(CKstring, initString, initString === CKstring);
                                if (CKstring === initString) {
                                    CKEDITOR.instances[this.props.box.id].setData("");
                                }
                            }

                        }}>
                        <i className="toolbarIcons material-icons">mode_edit</i>
                    {i18n.t("edit_text")}
                </Button>
                /* jshint ignore:end */
            );
        }
        let xmlButton;
        if (toolbar.config.needsXMLEdition) {
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
                            Dali.Plugins.get(toolbar.config.name).openConfigModal(UPDATE_BOX, toolbar.state, toolbar.id);
                        }}>
                        <i className="toolbarIcons material-icons">build</i>
                    {i18n.t('open_conf')}
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


        return (
            /* jshint ignore:start */
            <div id="wrap"
                 className="wrapper"
                 style={{
                        right: '0px',
                        top: this.props.top
                     }}>
                <div className="pestana"
                     onClick={() => {
                        this.setState({open: !this.state.open});
                     }}>
                </div>
                <div id="tools"
                     style={{
                        width: this.state.open ? '250px' : '40px'
                     }}
                     className="toolbox">
                    <OverlayTrigger placement="left"
                                    overlay={
                                        <Tooltip className={this.state.open ? 'hidden':''}
                                                 id="tooltip_props">
                                            {i18n.t('Properties')}
                                        </Tooltip>
                                    }>
                        <div onClick={() => {
                                this.setState({open: !this.state.open});
                             }}
                             style={{display:'block'}}
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
                    <div id="insidetools" style={{display: this.state.open ? 'block' : 'none'}}>
                        <div className="toolbarTabs">
                            {Object.keys(toolbar.controls).map((tabKey, index) => {
                                let tab = toolbar.controls[tabKey];
                                return (
                                    <div key={'key_'+index} className="toolbarTab">
                                        <PanelGroup>
                                            {Object.keys(tab.accordions).sort().map((accordionKey, index) => {
                                                return this.renderAccordion(
                                                    tab.accordions[accordionKey],
                                                    tabKey,
                                                    [accordionKey],
                                                    toolbar.state,
                                                    index
                                                );
                                            })}
                                            {this.props.box.children.map((id, index) => {
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
                                                                            (i18n.t('Block') + ' '+ (index + 1))
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

    handlecanvasToolbar (name, value){
      let navitem = this.props.navItems[this.props.navItemSelected];
      let toolbar = this.props.toolbars[this.props.navItemSelected].controls.main.accordions;
      switch (name){
      //change page/slide title
      case "custom_title":
          this.props.titleModeToggled(this.props.navItemSelected, {
              elementContent:{
                  documentTitle: value ,
                  documentSubTitle:  navitem.header.elementContent.documentSubTitle,
                  numPage: navitem.header.elementContent.numPage
              },
              display:{
                  courseTitle: navitem.header.display.courseTitle,
                  documentTitle: navitem.header.display.documentTitle,
                  documentSubTitle: navitem.header.display.documentSubTitle,
                  breadcrumb: navitem.header.display.breadcrumb,
                  pageNumber: navitem.header.display.pageNumber
              }
          });
          break;
      //change page/slide title
      case "custom_subtitle":
          this.props.titleModeToggled(this.props.navItemSelected, {
              elementContent:{
                  documentTitle: navitem.header.elementContent.documentTitle,
                  documentSubTitle: value,
                  numPage: navitem.header.elementContent.numPage
              },
              display:{
                  courseTitle: navitem.header.display.courseTitle,
                  documentTitle: navitem.header.display.documentTitle,
                  documentSubTitle: navitem.header.display.documentSubTitle,
                  breadcrumb: navitem.header.display.breadcrumb,
                  pageNumber: navitem.header.display.pageNumber
              }
          });
          break;
      //change page/slide title
      case "custom_pagenum":
          this.props.titleModeToggled(this.props.navItemSelected, {
              elementContent:{
                  documentTitle: navitem.header.elementContent.documentTitle,
                  documentSubTitle:  navitem.header.elementContent.documentSubTitle,
                  numPage: value
              },
              display:{
                  courseTitle: navitem.header.display.courseTitle,
                  documentTitle: navitem.header.display.documentTitle,
                  documentSubTitle: navitem.header.display.documentSubTitle,
                  breadcrumb: navitem.header.display.breadcrumb,
                  pageNumber: navitem.header.display.pageNumber
              }
          });
          break;
        //preview / export document
        case i18n.t('display_page'):
            this.props.onNavItemToggled(this.props.navItemSelected);
            break;
        //change document(navitem) name
        case i18n.t('NavItem_name'):
            if (isContainedView(this.props.navItemSelected)) {
              this.props.onContainedViewNameChanged(this.props.navItemSelected, value);
            } else {
              this.props.onNavItemNameChanged(this.props.navItemSelected, value);
            }
            break;
        //display - course title
        case i18n.t('course_title'):
            let courseTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                    elementContent:{
                        documentTitle: navitem.header.elementContent.documentTitle,
                        documentSubTitle:  navitem.header.elementContent.documentSubTitle,
                        numPage: navitem.header.elementContent.numPage
                    },
                    display:{
                        courseTitle: courseTitle,
                        documentTitle: navitem.header.display.documentTitle,
                        documentSubTitle: navitem.header.display.documentSubTitle,
                        breadcrumb: navitem.header.display.breadcrumb,
                        pageNumber: navitem.header.display.pageNumber
                    }
            });
            break;        //display - page title
        case i18n.t('Title')+i18n.t('document'):
            let docTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent:{
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle:  navitem.header.elementContent.documentSubTitle,
                    numPage: navitem.header.elementContent.numPage
                },
                display:{
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: docTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: navitem.header.display.pageNumber
                }
            });

            break;
        //display - page title
        case i18n.t('Title')+i18n.t('page'):
            let pageTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent:{
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle:  navitem.header.elementContent.documentSubTitle,
                    numPage: navitem.header.elementContent.numPage
                },
                display:{
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: pageTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: navitem.header.display.pageNumber
                }
            });

            break;
        //display - slide title
        case i18n.t('Title')+i18n.t('slide'):
            let slideTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent:{
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle:  navitem.header.elementContent.documentSubTitle,
                    numPage: navitem.header.elementContent.numPage
                },
                display:{
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: slideTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: navitem.header.display.pageNumber
                }
            });
            break;
        //display - subtitle
        case i18n.t('subtitle'):
            let subTitle = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent:{
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle: navitem.header.elementContent.documentSubTitle ? navitem.header.elementContent.documentSubTitle : i18n.t('subtitle'),
                    numPage: navitem.header.elementContent.numPage
                },
                display:{
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: navitem.header.display.documentTitle,
                    documentSubTitle: subTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: navitem.header.display.pageNumber
                }
            });
            break;
        //display - breadcrumb
        case i18n.t('Breadcrumb'):
            let breadcrumb = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent:{
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle:  navitem.header.elementContent.documentSubTitle,
                    numPage: navitem.header.elementContent.numPage
                },
                display:{
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: navitem.header.display.documentTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: breadcrumb,
                    pageNumber: navitem.header.display.pageNumber
                }
            });
            break;
        //display - pagenumber
        case i18n.t('pagenumber'):
            let pagenumber = value ? 'reduced' : 'hidden';
            this.props.titleModeToggled(this.props.navItemSelected, {
                elementContent:{
                    documentTitle: navitem.header.elementContent.documentTitle,
                    documentSubTitle:  navitem.header.elementContent.documentSubTitle,
                    numPage: navitem.header.elementContent.numPage
                },
                display:{
                    courseTitle: navitem.header.display.courseTitle,
                    documentTitle: navitem.header.display.documentTitle,
                    documentSubTitle: navitem.header.display.documentSubTitle,
                    breadcrumb: navitem.header.display.breadcrumb,
                    pageNumber: pagenumber
                }
            });
            break;
        default:
            break;
      }

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
                let buttonWidth = (buttonKeys[i] === '__width' || buttonKeys[i] === '__height') ? '60%' : '100%';
                let buttonMargin = (buttonKeys[i] === '__width' || buttonKeys[i] === '__height') ? '5%' : '0px';
                children.push(
                    /* jshint ignore:start */
                    <div key={'div_' + i }
                         style={{
                            width: buttonWidth,
                            marginRight: buttonMargin
                         }}>
                        {this.renderButton(accordion, tabKey, accordionKeys, buttonKeys[i], state, i)}

                    </div>
                    /* jshint ignore:end */
                );
            }

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
                             containedViews={this.props.containedViews}
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
        let children = null;
        let id;
        if(this.props.boxSelected === -1){
          id = this.props.navItemSelected;
        }else{
          id = this.props.box.id;
        }

        let props = {
            key: ('child_' + key),
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
            style: {width: '100%'},
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
                if(typeof e.target !== 'undefined'){
                    value = e.target.value;
                } else {
                    value = e.value;
                }
                if (buttonKey === '__width' || buttonKey === '__height') {
                    let newButton = Object.assign({}, (buttonKey === '__width' ? accordion.buttons.__width : accordion.buttons.__height));
                    let otherButton = Object.assign({}, (buttonKey === '__height' ? accordion.buttons.__width : accordion.buttons.__height));

                    switch (e.target.type) {
                        case "checkbox":
                            newButton.auto = e.target.checked;
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
                    if(accordion.buttons.__aspectRatio && accordion.buttons.__aspectRatio.checked){
                        otherButton.value = otherButton.value * newButton.value / button.value;
                        if(!otherButton.auto){
                            otherButton.displayValue = otherButton.value;
                        }
                    }

                    // If next values are going to be over 100%, prevent action
                    if((newButton.units === "%" && newButton.value > 100) || (otherButton.units === "%" && otherButton.value > 100)){
                        return;
                    }

                    if(buttonKey === "__width"){
                        this.props.onBoxResized(id, newButton, otherButton);
                    }else{
                        this.props.onBoxResized(id, otherButton, newButton);
                    }
                    return;
                }
                if (button.type === 'number') {
                    //If there's any problem when parsing (NaN) -> take min value if defined; otherwise take 0
                    value = parseInt(value, 10) || button.min || 0;
                    if (button.max && value > button.max) {
                        value = button.max;
                    }
                }

                if (button.type === 'checkbox') {
                    value = e.target.checked;
                }
                if (button.type === 'radio') {
                    value = button.options[value];
                    if (buttonKey === '__position') {
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, '__position', value);
                        this.props.onBoxMoved(id, 0, 0, value);
                        let parentId = this.props.box.parent;
                        let containerId = this.props.box.container;
                        if (isSortableContainer(containerId)) {
                          let newHeight = parseFloat(document.getElementById(containerId).clientHeight, 10);
                          this.props.onSortableContainerResized(containerId, parentId, newHeight);
                        }
                    }
                }

                if (button.type === 'select' && button.multiple === true) {
                    value = button.value;
                    let ind = button.value.indexOf(e);
                    value = e;  //[...e.target.options].filter(o => o.selected).map(o => o.value);
                }

                if (button.type === 'colorPicker') {
                    value = e.value;
                }
                this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, value);

                if (!button.autoManaged) {
                  if(!button.callback){
                      this.handlecanvasToolbar(button.__name, value);
                  }else{
                    button.callback(state, buttonKey, value, id, UPDATE_TOOLBAR);
                  }

                }
            }

        };

        if (button.options) {
            if (button.type === "colorPicker") {
                props.options = button.options;
                props.optionRenderer = this.renderOption;
                props.valueRenderer = this.renderValue;
                return React.createElement(
                    FormGroup,
                    {key: button.__name},
                    [
                        React.createElement(
                            ControlLabel,
                            {key: 'label_' + button.__name},
                            button.__name),
                        React.createElement(
                            Select,
                            props,
                            null)
                    ]
                );
            }

            if (button.type === "select") {
                if (!button.multiple) {
                    button.options.map((option, index) => {
                        if (!children) {
                            children = [];
                        }
                        children.push(React.createElement('option', {key: 'child_' + index, value: option}, option));
                    });
                    props.componentClass = 'select';
                    return React.createElement(
                        FormGroup,
                        {key: button.__name},
                        [
                            React.createElement(
                                ControlLabel,
                                {key: 'label_' + button.__name},
                                button.__name),
                            React.createElement(
                                FormControl,
                                props,
                                children)
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
                    {key: button.__name},
                    [
                        React.createElement(
                            ControlLabel,
                            {key: 'label_' + button.__name},
                            button.__name),
                        React.createElement(
                            Select,
                            props,
                            null)
                    ]
                );
            }

            if (button.type === 'radio') {
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
                        icons: button.icons
                    }, null);
                }
                return null;
            }
        }

        if (button.type === 'checkbox') {
            return React.createElement(
                FormGroup,
                {key: (button.__name)},
                React.createElement(
                    Checkbox,
                    props,
                    button.__name)
            );
        }

        if (button.type === 'conditionalText') {
            return React.createElement(
                FormGroup,
                {key: button.__name, style: {display: accordion.buttons[button.associatedKey].checked ? "block" : "none"}},
                [
                    React.createElement(
                        "span",
                        {key: 'output_span' + button.__name, className: 'rangeOutput'},
                        button.type === "range" ? button.value : null),
                    React.createElement(
                        FormControl,
                        props,
                        null)
                ]
            );
        }

        if (button.type === "vish_provider") {
            return React.createElement(VishProvider, {
                key: button.__name,
                formControlProps: props,
                isBusy: this.props.isBusy,
                fetchResults: this.props.fetchResults,
                onFetchVishResources: this.props.onFetchVishResources,
                onUploadVishResource: this.props.onUploadVishResource,
                onChange: props.onChange
            }, null);
        }

        // If it's none of previous types (number, text, color, range, ...)
        if (buttonKey === '__width' || buttonKey === '__height') {
            let advancedPanel = (
                /* jshint ignore:start */
                <FormGroup>
                    <Checkbox label={i18n.t("Auto")}
                              checked={button.auto}
                              onChange={props.onChange}>
                        {i18n.t("Auto")}
                    </Checkbox>
                    {/*Disable px size in slides*/}
                    {isSlide(this.props.navItems[this.props.navItemSelected].type) ? 
                    (<span></span>) :
                    (<div><ControlLabel>{i18n.t("Units")}</ControlLabel>
                    <FormControl componentClass='select'
                                 value={button.units}
                                 onChange={props.onChange}>
                        <option value="px">{i18n.t("Pixels")}</option>
                        <option value="%">{i18n.t("Percentage")}</option>
                    </FormControl></div>)}
                </FormGroup>
                /* jshint ignore:end */
            );

            props.value = button.auto ? 'auto' : button.value;
            props.type = button.auto ? 'text' : 'number';
            props.disabled = button.auto;
            return (
                /* jshint ignore:start */
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
                /* jshint ignore:end */
            );
        }

        return React.createElement(
            FormGroup,
            {key: button.__name},
            [
                React.createElement(
                    ControlLabel,
                    {key: 'label_' + button.__name},
                    button.__name),
                React.createElement(
                    "span",
                    {key: 'output_span' + button.__name, className: 'rangeOutput'},
                    button.type === "range" ? button.value : null),
                React.createElement(
                    FormControl,
                    props,
                    null)
            ]
        );
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
}
