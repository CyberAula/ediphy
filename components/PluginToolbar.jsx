import React, {Component} from 'react';
import { FormControl, FormGroup, Radio, ControlLabel, Checkbox,  Button, ButtonGroup, PanelGroup, Accordion, Panel, Tabs, Tab} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import GridConfigurator from '../components/GridConfigurator.jsx';
import Select from 'react-select';
  

export default class PluginToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            activeKey: 0
        };
        this.aspectRatio = false;
    }

    handleSelect(key) {
        this.setState({activeKey: key});
    }

    render() {
        if (this.props.boxSelected === -1) {
            return <div></div>;
        }
        let toolbar = this.props.toolbars[this.props.box.id];
        let textButton;
        if (toolbar.config && toolbar.config.needsTextEdition) {
            textButton = (<Button key={'text'}
                                  onClick={() => {
                                    this.props.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor, (toolbar.showTextEditor) ? CKEDITOR.instances[toolbar.id].getData() : null)}}
                                  bsStyle={toolbar.showTextEditor ? 'primary' : 'default'}>
                Edit text</Button>);
        }
        let configButton;
        if (toolbar.config && toolbar.config.needsConfigModal) {
            configButton = (<Button key={'config'}
                                    onClick={() => {
                                      Dali.Plugins.get(toolbar.config.name).openConfigModal(true, toolbar.state, toolbar.id)
                                    }}>
                Open config</Button>);
        }


        let deletebutton;
        if (this.props.box.id[1] != 's') {
            deletebutton = (<Button key={'delete'}
                                    className="pluginToolbarMainButton" 
                                    onClick={e => {
                                        this.props.onBoxDeleted(this.props.box.id, this.props.box.parent, this.props.box.container);
                                        e.stopPropagation();
                                    }}><i className="fa fa-trash-o fa-2x"></i></Button>);
        }
        let duplicateButton;
        if (this.props.box.id[1] != 's') {
            duplicateButton = (<Button key={'duplicate'}
                                       className="pluginToolbarMainButton" 
                                       onClick={e => {
                                          this.props.onBoxDuplicated(this.props.box.id, this.props.box.parent, this.props.box.container);
                                          e.stopPropagation();
                                       }}><i className="fa fa-files-o fa-2x"></i></Button>);
        }

        let visible = (Object.keys(toolbar.controls).length !== 0 || this.props.box.children.length !== 0) ? 'visible' : 'hidden';

        return (<div id="wrap"
                     className="wrapper"
                     style={{
                        right: '0px',
                        top: '39px',
                        visibility: visible
                     }}>
            <div className="pestana" onClick={() => {this.setState({open: !this.state.open})}}>
                <i className="fa fa-gear fa-2x"></i>
            </div>
            <div id="tools" style={{width: this.state.open? '250px':'0px'}} className="toolbox">
                <div id="insidetools">

                    <Tabs className="toolbarTabs" ref="tabs" activeKey={this.state.activeKey} animation={false}
                          onSelect={(key) => this.handleSelect(key)} id="controlledTabs">
                        {Object.keys(toolbar.controls).map((tabKey, index) => {
                            let tab = toolbar.controls[tabKey];
                            return (
                                <Tab key={index} className="toolbarTab" eventKey={index} title={tab.__name}>
                                <ButtonGroup style={{width: '100%'}}> {deletebutton} {duplicateButton} </ButtonGroup>
                                    <br/><br/>
                                    <PanelGroup>
                                        {Object.keys(tab.accordions).map((accordionKey, index) => {
                                            let accordion = tab.accordions[accordionKey];
                                            return this.renderAccordion(accordion, tabKey, [accordionKey], toolbar.state, index);
                                        })}
                                        {this.props.box.children.map((id, index) => {
                                            let container = this.props.box.sortableContainers[id];
                                            if (tabKey === "main") {
                                                return (<Panel key={id} className="panelPluginToolbar" collapsible
                                                               header={'Caja '+ (index + 1)}>
                                                    <GridConfigurator id={id}
                                                                      parentId={this.props.box.id}
                                                                      container={container}
                                                                      onColsChanged={this.props.onColsChanged}
                                                                      onRowsChanged={this.props.onRowsChanged}/>
                                                </Panel>)
                                            }
                                        })}
                                    </PanelGroup>
                                     
                                    {textButton}
                                    {configButton}

                                </Tab>
                            );
                        })}
                    </Tabs>
                </div>
            </div>
        </div>);
    }

    renderAccordion(accordion, tabKey, accordionKeys, state, key) {
        let props = {key: key, className: "panelPluginToolbar", collapsible: true, header: accordion.__name};
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
                children.push(this.renderButton(accordion, tabKey, accordionKeys, buttonKeys[i], state, i));
            }
        }

        return React.createElement(Panel, props, children);
    }

    renderButton(accordion, tabKey, accordionKeys, buttonKey, state, key) {
        let button = accordion.buttons[buttonKey];
        if (buttonKey === '__aspectRatio') {
            this.aspectRatio = (button.value === "checked");
        }
        let children;
        let id = this.props.box.id;
        let props = {
            key: key,
            type: button.type,
            value: button.value,
            label: button.__name,
            min: button.min,
            max: button.max,
            step: button.step,
            className: button.class,
            style: {width: '100%'},
            onChange: e => {
                 let value = e.target ? e.target.value : e.target;
                if (buttonKey == 'width') {
                    if (!this.aspectRatio) {
                        this.props.onBoxResized(id, value + '%', this.props.box.height);
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, value);
                    } else {
                        let newHeight = (parseFloat(this.props.box.height) * value / parseFloat(this.props.box.width));
                        this.props.onBoxResized(id, value + '%', newHeight + '%');
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, value);
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, 'height', newHeight);
                    }
                }
                if (buttonKey == 'height') {
                    if (!this.aspectRatio) {
                        this.props.onBoxResized(id, this.props.box.width, value + '%');
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, value);
                    } else {
                        let newWidth = (parseFloat(this.props.box.width) * value / parseFloat(this.props.box.height));
                        this.props.onBoxResized(id, newWidth + '%', value + '%');
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, value);
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, 'width', newWidth);
                    }
                }
                if (button.type === 'number') {
                    value = parseFloat(value) || 0;
                }
                if (button.type === 'checkbox') {
                    value = ( value === 'checked') ? 'unchecked' : 'checked';
                }
                if (button.type === 'radio') {
                    value = button.options[value]
                }

                if (button.type === 'select' && button.multiple === true){
                    value = button.value;
                    let ind = button.value.indexOf(e)
                    value = e  //[...e.target.options].filter(o => o.selected).map(o => o.value);
                }

                if (button.type === 'colorPicker'){
                    value = e.value;
                 }

                this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, value);

                if (!button.autoManaged) {
                    button.callback(state, buttonKey, value, id);
                }

               /* 
                    e.stopPropagation();
               */
            } 

        }

        if (button.options && button.type === 'colorPicker'){
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
                props.multiple = 'multiple'
                props.options = button.options;
                props.multi = true;
                props.simpleValue = true;
                props.placeholder = "No has elegido ninguna opción" 
                return React.createElement(FormGroup, {key: button.__name}, [React.createElement(ControlLabel, {key: 'label_' + button.__name}, button.__name),
                                                                             React.createElement(Select, props, null)]);
            }

               
              
        } else if (button.type === 'checkbox') {
            props.checked = button.value == 'checked';
            return React.createElement(FormGroup, {key: button.__name},
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
                    checked: (button.value == button.options[index])
                }, radio));
            });
            return React.createElement(FormGroup, props, children);

        } else {
            return React.createElement(FormGroup, {key: button.__name}, [React.createElement(ControlLabel, {key: 'label_' + button.__name}, button.__name),
                React.createElement(FormControl, props, null)]);
        }

    }

    renderOption(option) {
        return <span>{option.label}<i style={{color: option.color, float: 'right'}} className="fa fa-stop"></i></span>;
    }

    renderValue(option) {
        return <span>{option.label}</span>;
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.box && nextProps.box && this.props.box.id != nextProps.box.id) {
            this.setState({activeKey: 0})
            nextState.activeKey = 0;
        }
    }



}

 


