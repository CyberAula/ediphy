import React, {Component} from 'react';
import {Input, ButtonInput, Button} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import GridConfigurator from '../components/GridConfigurator.jsx';

export default class PluginToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: 20,
            y: 20
        };
    }

    render() {
        if(this.props.boxSelected === -1){
            return <div></div>;
        }
        let toolbar = this.props.toolbars[this.props.box.id];
        let buttons = [];
        buttons = toolbar.buttons.map((item, index) => {
            return <Input key={index}
                          ref={index}
                          type={item.type}
                          defaultValue={item.value}
                          value={item.value}
                          label={item.humanName}
                          min={item.min}
                          max={item.max}
                          step={item.step}
                          style={{width: '100%'}}
                          onChange={e => {
                                let value = e.target.value;
                                if(item.type === 'number')
                                    value = parseFloat(value) || 0;
                                this.props.onToolbarUpdated(toolbar.id, index, item.name, value);
                                if(!item.autoManaged)
                                    item.callback(toolbar.state, item.name, value, toolbar.id);
                          }}

                />
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

        let visible = (buttons.length !== 0 || this.props.box.children.length !== 0) ? 'visible' : 'hidden';
        return (<div id="wrap" className="wrapper" style={{
                    right: '0px', /*this.state.x,*/
                    top: '39px',
                    visibility: visible /*this.state.y,*/}} >
            <div className="pestana" onClick={() => {toggleWidth() }}>
                <i className="fa fa-gear fa-2x"> </i>
            </div>
            <div id="tools" className="toolbox">
                <div className="botones">
                    {buttons}
                    {
                        this.props.box.children.map((id, index) => {
                            let container = this.props.box.sortableContainers[id];
                            return <GridConfigurator key={index}
                                                     id={id}
                                                     parentId={this.props.box.id}
                                                     container={container}
                                                     onColsChanged={this.props.onColsChanged}
                                                     onRowsChanged={this.props.onRowsChanged} />

                        })
                    }
                </div>
            </div>
        </div>);
    }
}

function toggleWidth(){
     if( $("#tools").css("width") != '250px' ){
         $("#tools").animate({width: '250px'})
     } else {
         $("#tools").animate({ width: '0px'})
     }
    // $("#tools").toggle()
}