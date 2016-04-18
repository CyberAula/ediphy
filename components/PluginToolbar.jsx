import React, {Component} from 'react';
import {Input, ButtonInput, Button, Nav, NavItem, PanelGroup, NavDropdown, MenuItem, Accordion, Panel} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import GridConfigurator from '../components/GridConfigurator.jsx';

export default class PluginToolbar extends Component {
    constructor(props) {
      super(props);
      this.state = {
          x: 20,
          y: 20,
          currentTab:1,
          open: false
      };
    }
 
    handleSelect( selectedKey) {
      this.setState({currentTab:  selectedKey})
    }


    toggleWidth(){
      if( $("#tools").css("width") != '250px' ){
        $("#tools").animate({width: '250px'})
      } else {
        $("#tools").animate({ width: '0px'})
      }
      this.setState({ open: !this.state.open})
    } 

    render() {
      
        if(this.props.boxSelected === -1){
            return <div></div>;
        }
        let toolbar = this.props.toolbars[this.props.box.id];
        let tools = toolbar.sections
        let buttons = [];
        buttons = toolbar.buttons.map((item, index) => {
          return (<Input key={index}
                        ref={index}
                        type={item.type}
                        defaultValue={item.value}
                        value={item.value}
                        label={item.humanName}
                        min={item.min}
                        max={item.max}
                        step={item.step}
                        tab={item.tab}
                        accordion={item.accordion}
                        style={{width: '100%'}}
                        onChange={e => {
                              let value = e.target.value;
                              if(item.type === 'number')
                                  value = parseFloat(value) || 0;
                              this.props.onToolbarUpdated(toolbar.id, index, item.name, value);
                              if(!item.autoManaged)
                                  item.callback(toolbar.state, item.name, value, toolbar.id);
                        }}

              />)
        });

        if(toolbar.config && toolbar.config.needsTextEdition){
            buttons.push(<ButtonInput key={'text'}
                                      onClick={() => {
                                        this.props.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor);}}
                                      bsStyle={toolbar.showTextEditor ? 'primary' : 'default'}>
                Edit text</ButtonInput>);
        }
        if(toolbar.config && toolbar.config.needsConfigModal){
            buttons.push(<ButtonInput key={'config'}
                                      onClick={() => {
                                        Dali.Plugins.get(toolbar.config.name).openConfigModal(true, toolbar.state, toolbar.id)}}>
                Open config</ButtonInput>);
        }
        buttons.push(<Button onClick={e => {
                                this.props.onBoxDeleted();
                                e.stopPropagation();
                             }}>
                <i className="fa fa-trash-o"></i></Button>);

        let indexTab = 1,
            indexAcc = 1,
            tabName = '',
            accordion = [],
            visible = (buttons.length !== 0 || this.props.box.children.length !== 0) ? 'visible' : 'hidden';
         

        return (<div id="wrap" className="wrapper" style={{
                    right: '0px', 
                    top: '39px',
                    visibility: visible }} >

                        <div className="pestana" onClick={() => {this.toggleWidth() }}>
                            <i className="fa fa-gear fa-2x"> </i>
                        </div>
                        <div id="tools" style={{width: this.state.open? '250px':'0px'}} className="toolbox">
                          <div id="insidetools">
                            <Nav bsStyle="tabs" activeKey={this.state.currentTab} onSelect={( selectedKey) => {this.handleSelect(selectedKey)}}>
                               {
                                tools.map((section, index) => {
                                    if( indexTab == this.state.currentTab){
                                      accordion = section.accordion
                                    }
                                    return(<NavItem key={index} eventKey={indexTab++} >{section.tab}</NavItem>)
                                })
                              }
                            </Nav>
                            <div className="botones">
                            <PanelGroup>
                               { accordion.map((title, index) =>{
                                  return ( 
                                    <Panel key={index} className="panelPluginToolbar" collapsible header={title} eventKey={indexAcc++} >
                                      {buttons.map(button => {
                                        if (button.props.accordion == title) return button;
                                      })}
                                    </Panel>)
                                   })
                                }
                                { this.props.box.children.map((id, index) => {
                                    let container = this.props.box.sortableContainers[id];
                                    if ( this.state.currentTab == 1 )
                                      return (
                                        <Panel className="panelPluginToolbar" collapsible header={id} eventKey={indexAcc++} >
                                                  <GridConfigurator key={index}
                                                     id={id}
                                                     parentId={this.props.box.id}
                                                     container={container}
                                                     onColsChanged={this.props.onColsChanged}
                                                     onRowsChanged={this.props.onRowsChanged} />
                                        </Panel>)
                                  })
                                }
                            </PanelGroup>
                              {
                                buttons.map(button => {
                                  if (!button.props.accordion && this.state.currentTab == 1 ) return button; })
                              }
                            </div>
                        </div>
                    </div>
                </div>);

    }
}

 