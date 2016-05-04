import React, {Component} from 'react';
import {Input, ButtonInput, Button, Nav, NavItem, PanelGroup, NavDropdown, MenuItem, Accordion, Panel} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import GridConfigurator from '../components/GridConfigurator.jsx';

export default class PluginToolbar extends Component {
    constructor(props) {
      super(props);
      this.state = {
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
        let options;
        let aspectRatio = false

        buttons = toolbar.buttons.map((item, index) => {
            if(item.list){
                options= (<datalist key={index} id={item.list}>
                    {item.options.map((item,index)=>{
                        return (<option key={'option'+index} value={item}/>);
                    })}</datalist>)
            }
            if(item.name=='aspectRatio' && item.value =='checked'){
                aspectRatio= true;
            }
            return (
              <Input key={this.props.boxSelected + item.name + index}
                     ref={index}
                     type={item.type}
                     defaultValue={item.value}
                     value={item.value}
                     label={item.humanName}
                     min={item.min}
                     max={item.max}
                     step={item.step}
                     list={item.list}
                     tab={item.tab}
                     checked={item.value=='checked'}
                     accordion={item.accordion}
                     style={{width: '100%'}}
                     onChange={e => {
                        let value = e.target.value;
                        // if (item.type == 'color')console.log(item.value)
                        if(item.name == 'width'){
                            if(!aspectRatio){
                                this.props.onBoxResized( this.props.boxSelected, value+'%', this.props.box.height);
                                this.props.onToolbarUpdated(toolbar.id, index, 'width', value);
                            } else {
                                let newHeight = (parseFloat(this.props.box.height)*value/parseFloat(this.props.box.width))
                                this.props.onBoxResized( this.props.boxSelected, value+'%', newHeight+'%');
                                this.props.onToolbarUpdated(toolbar.id, index, 'width', value);
                              
                                this.props.onToolbarUpdated(toolbar.id, index+1, 'height', newHeight);
                            }
                        }
                        if(item.name == 'height'){
                            if(!aspectRatio){
                                this.props.onBoxResized( this.props.boxSelected,  this.props.box.width, value+'%');
                                this.props.onToolbarUpdated(toolbar.id, index, 'height', value);
                            } else {
                                let newWidth = (parseFloat(this.props.box.width)*value/parseFloat(this.props.box.height))
                                this.props.onBoxResized( this.props.boxSelected, newWidth+'%', value+'%' );
                                this.props.onToolbarUpdated(toolbar.id, index-1, 'width', newWidth);
                                this.props.onToolbarUpdated(toolbar.id, index, 'height', value);
                            }   
                        }
                        if(item.type === 'number'){
                            value = parseFloat(value) || 0;
                        }
                        if(item.type === 'checkbox'){
                            value = item.value=='checked' ? 'unchecked':'checked'
                        }
                        this.props.onToolbarUpdated(toolbar.id, index, item.name, value);
                        if(!item.autoManaged){
                            item.callback(toolbar.state, item.name, value, toolbar.id);
                        }
                        }}/>)
        });

        if(toolbar.config && toolbar.config.needsTextEdition){
            buttons.push(<ButtonInput key={'text'}
                                      onClick={() => {
                                        this.props.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor, (toolbar.showTextEditor) ? CKEDITOR.instances[this.props.id].getData() : null)}}
                                      bsStyle={toolbar.showTextEditor ? 'primary' : 'default'}>
                Edit text</ButtonInput>);
        }
        if(toolbar.config && toolbar.config.needsConfigModal){
            buttons.push(<ButtonInput key={'config'}
                                      onClick={() => {
                                        Dali.Plugins.get(toolbar.config.name).openConfigModal(true, toolbar.state, toolbar.id)}}>
                Open config</ButtonInput>);
        }
        let deletebutton;
        if(this.props.box.id[1]!='s' ){
            deletebutton = (<Button key={'delete'}
                                    block
                                    onClick={e => {
                                        this.props.onBoxDeleted();
                                        e.stopPropagation();
                                    }}><i className="fa fa-trash-o fa-2x"></i></Button>);
        }

        let indexTab = 1,
            indexAcc = 1,
            tabName = '',
            accordion = [],
            visible = (buttons.length !== 0 || this.props.box.children.length !== 0) ? 'visible' : 'hidden';
    
        return (<div id="wrap"
                     className="wrapper"
                     style={{
                        right: '0px',
                        top: '39px',
                        visibility: visible
                     }}>
                <div className="pestana" onClick={() => {this.toggleWidth() }}>
                    <i className="fa fa-gear fa-2x"></i>
                </div>
                <div id="tools" style={{width: this.state.open? '250px':'0px'}} className="toolbox">
                    <div id="insidetools">
                        <Nav bsStyle="tabs"
                             activeKey={this.state.currentTab}
                             onSelect={( selectedKey) => {this.handleSelect(selectedKey)}}>
                            {tools.map((section, index) => {
                                //Tabs
                                if( indexTab == this.state.currentTab){
                                    accordion = section.accordion
                                }
                                return(<NavItem key={indexTab} eventKey={indexTab++}>{section.tab}</NavItem>)
                            })
                        }
                        </Nav>
                        <div className="botones">
                        {deletebutton}
                        <br/> 
                        <PanelGroup>
                            {accordion.map((title, index) =>{
                                return (
                                    //Accordions
                                    <Panel key={title} className="panelPluginToolbar" collapsible header={title} eventKey={indexAcc++}>
                                    {buttons.map(( button) => {
                                        // Inputs
                                        if (button.props.accordion == title)
                                            return (<span key={button.name}>{button}</span>);
                                    })}
                                    </Panel>)
                            })}
                            {this.props.box.children.map((id, index) => {
                                let container = this.props.box.sortableContainers[id];
                                  if (this.state.currentTab == 1)
                                      return (
                                      <Panel key={id} className="panelPluginToolbar" collapsible header={'Caja '+(index+1) } eventKey={indexAcc++} >
                                          <GridConfigurator key={(index)}
                                                            id={id}
                                                            parentId={this.props.box.id}
                                                            container={container}
                                                            onColsChanged={this.props.onColsChanged}
                                                            onRowsChanged={this.props.onRowsChanged} />
                                      </Panel>)
                            })
                            }{ //Sortables
                                (this.props.box.container != '0') ?
                                    (<Panel key={0} className="panelPluginToolbar" collapsible header={'Size'} eventKey={indexAcc++} >
                                        {buttons.map(( button) => {
                                            if (button.props.accordion == 'Sortable')
                                                return (<span key={button.name}>{button}</span>);
                                            })}
                                    </Panel>) :
                                    (<br/>)
                            }
                        </PanelGroup>
                        {options}
                        {buttons.map(button => {
                            if (!button.props.accordion && this.state.currentTab == 1 ) {
                                return ( <span key={button.name}>{button}</span>);
                            }})
                        }
                        </div>
                    </div>
                </div>
        </div>);
    }
}

 