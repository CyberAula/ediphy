import React, {Component} from 'react';
import {Input, ButtonInput, Button, Nav, NavItem, PanelGroup, NavDropdown, MenuItem, Accordion, Panel, Tabs, Tab} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import GridConfigurator from '../components/GridConfigurator.jsx';

export default class PluginToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    render() {
        if (this.props.boxSelected === -1) {
            return <div></div>;
        }
        let toolbar = this.props.toolbars[this.props.box.id];
        let options;
        let aspectRatio = false;
        let textButton;
        if (toolbar.config && toolbar.config.needsTextEdition) {
            textButton = (<ButtonInput key={'text'}
                                       onClick={() => {
                                            this.props.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor, (toolbar.showTextEditor) ? CKEDITOR.instances[this.props.id].getData() : null)}}
                                       bsStyle={toolbar.showTextEditor ? 'primary' : 'default'}>
                Edit text</ButtonInput>);
        }
        let configButton;
        if (toolbar.config && toolbar.config.needsConfigModal) {
            configButton = (<ButtonInput key={'config'}
                                         onClick={() => {
                                            Dali.Plugins.get(toolbar.config.name).openConfigModal(true, toolbar.state, toolbar.id)
                                         }}>
                Open config</ButtonInput>);
        }
        let deletebutton;
        if (this.props.box.id[1] != 's') {
            deletebutton = (<Button key={'delete'}
                                    block
                                    onClick={e => {
                                        this.props.onBoxDeleted();
                                        e.stopPropagation();
                                    }}><i className="fa fa-trash-o fa-2x"></i></Button>);
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
                    <Tabs defaultActiveKey={0} animation={false}>
                        {Object.keys(toolbar.controls).map((tabKey, index) => {
                            let tab = toolbar.controls[tabKey];
                            return (
                                <Tab key={index} eventKey={index} title={tab.__name}>
                                    {deletebutton}
                                    <br />
                                    <PanelGroup>
                                        {Object.keys(tab.accordions).map((accordionKey, index) => {
                                            let accordion = tab.accordions[accordionKey];
                                            return (
                                                <Panel key={index} className="panelPluginToolbar" collapsible
                                                       header={accordion.__name}>
                                                    {Object.keys(accordion.buttons).map((buttonKey, index) => {
                                                        let button = accordion.buttons[buttonKey];
                                                        if (button.list) {
                                                            options = (<datalist key={button.list} id={button.list}>
                                                                {button.options.map((option, index) => {
                                                                    return (<option key={index} value={option}/>);
                                                                })}</datalist>);
                                                        }
                                                        if (button.name == 'aspectRatio' && button.value == 'checked') {
                                                            aspectRatio = true;
                                                        }
                                                        return (
                                                            <Input key={index}
                                                                   type={button.type}
                                                                   defaultValue={button.value}
                                                                   value={button.value}
                                                                   label={button.__name}
                                                                   min={button.min}
                                                                   max={button.max}
                                                                   step={button.step}
                                                                   list={button.list}
                                                                   checked={button.value=='checked'}
                                                                   style={{width: '100%'}}
                                                                   onChange={e => {
                                                                let value = e.target.value;
                                                                if(buttonKey == 'width'){
                                                                    if(!aspectRatio){
                                                                        this.props.onBoxResized(this.props.box.id, value + '%', this.props.box.height);
                                                                        this.props.onToolbarUpdated(toolbar.id, tabKey, accordionKey, buttonKey, value);
                                                                    } else {
                                                                        let newHeight = (parseFloat(this.props.box.height) * value / parseFloat(this.props.box.width));
                                                                        this.props.onBoxResized(this.props.box.id, value + '%', newHeight + '%');
                                                                        this.props.onToolbarUpdated(toolbar.id, tabKey, accordionKey, buttonKey, value);
                                                                        this.props.onToolbarUpdated(toolbar.id, tabKey, accordionKey, 'height', newHeight);
                                                                    }
                                                                }
                                                                if(buttonKey == 'height'){
                                                                    if(!aspectRatio){
                                                                        this.props.onBoxResized(this.props.box.id, this.props.box.width, value + '%');
                                                                        this.props.onToolbarUpdated(toolbar.id, tabKey, accordionKey, buttonKey, value);
                                                                    } else {
                                                                        let newWidth = (parseFloat(this.props.box.width) * value / parseFloat(this.props.box.height))
                                                                        this.props.onBoxResized(this.props.boxSelected, newWidth + '%', value + '%' );
                                                                        this.props.onToolbarUpdated(toolbar.id, tabKey, accordionKey, buttonKey, value);
                                                                        this.props.onToolbarUpdated(toolbar.id, tabKey, accordionKey, 'width', newWidth);
                                                                    }
                                                                }
                                                                if(button.type === 'number'){
                                                                    value = parseFloat(value) || 0;
                                                                }
                                                                if(button.type === 'checkbox'){
                                                                    value = (button.value=='checked') ? 'unchecked' : 'checked';
                                                                }
                                                                this.props.onToolbarUpdated(toolbar.id, tabKey, accordionKey, buttonKey, value);
                                                                if(!button.autoManaged){
                                                                    button.callback(toolbar.state, buttonKey, value, toolbar.id);
                                                                }
                                                           }}/>);
                                                    })}
                                                </Panel>
                                            );
                                        })}
                                        {this.props.box.children.map((id, index) => {
                                            let container = this.props.box.sortableContainers[id];
                                            if (tabKey === "main") {
                                                return (<Panel key={id} className="panelPluginToolbar" collapsible header={'Caja '+ (index + 1)}>
                                                    <GridConfigurator id={id}
                                                                      parentId={this.props.box.id}
                                                                      container={container}
                                                                      onColsChanged={this.props.onColsChanged}
                                                                      onRowsChanged={this.props.onRowsChanged}/>
                                                </Panel>)
                                            }
                                        })}
                                    </PanelGroup>
                                    {options}
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
}

 