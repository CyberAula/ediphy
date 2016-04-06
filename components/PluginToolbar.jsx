import React, {Component} from 'react';
import {Input, ButtonInput, Button} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import interact from 'interact.js';

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
        let toolbar = this.props.toolbars[this.props.boxSelected];
        let showToolbar = this.props.boxSelected !== -1 && toolbar.buttons;
        let visible = showToolbar ? 'visible' : 'hidden';
        let buttons;
        if(showToolbar){
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
                                        value = parseFloat(value);
                                    this.props.onToolbarUpdated(this.props.boxSelected, index, item.name, value);
                                    if(!item.autoManaged)
                                        item.callback(toolbar.state, item.name, value, toolbar.id);
                              }} 
                            
                    />
            });
            if(toolbar.config.needsTextEdition){
                buttons.push(<ButtonInput key={'text'}
                                          onClick={() => {
                                            this.props.onTextEditorToggled(this.props.boxSelected, !toolbar.showTextEditor);}}
                                          bsStyle={toolbar.showTextEditor ? 'primary' : 'default'}>
                    Edit text</ButtonInput>);
            }
            if(toolbar.config.needsConfigModal){
                buttons.push(<ButtonInput key={'config'}
                                          onClick={() => {
                                            Dali.Plugins.get(toolbar.config.name).openConfigModal(true, toolbar.state, toolbar.id)}}>
                    Open config</ButtonInput>);
            }
        }
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
                </div>
            </div>
        </div>);
    }

    componentDidMount() {
        interact(ReactDOM.findDOMNode(this))
            .ignoreFrom('input, textarea, a')
            .draggable({

                restrict: {
                    restriction: "parent",
                    endOnly: true,
                    elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                },
                autoScroll: true,
                onmove: (event) => {
                    var target = event.target;
                    event.stopPropagation()
                    target.style.right = (parseInt(target.style.right) || 0) + (-event.dx) + 'px';
                    target.style.top = (parseInt(target.style.top) || 0) + event.dy + 'px';
                },
                onend: (event) => {
                    this.setState({x: parseInt(event.target.style.right), y: parseInt(event.target.style.top)});
                    event.stopPropagation();
                }
            });
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