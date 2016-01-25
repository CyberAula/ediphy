import React, {Component} from 'react';
import {Input} from 'react-bootstrap';
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

    //componentWillReceiveProps(nextProps){
    //    if(nextProps.box && this.state.x === 0 && this.state.y === 0)
    //        this.setState({x: nextProps.box.position.x + 90, y: nextProps.box.position.y});
    //}

    render() {
        let showToolbar = this.props.boxSelected !== -1 && this.props.toolbars[this.props.boxSelected];
        let visible = showToolbar ? 'visible' : 'hidden';
        let buttons;
        if(showToolbar){
            buttons = this.props.toolbars[this.props.boxSelected].map((item, index) => {
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
                                    let value = parseFloat(e.target.value);
                                    this.props.onToolbarUpdated(this.props.boxSelected, index, value);
                                    if(!item.autoManaged)
                                        item.callback(value);
                              }}
                    />
            });
        }
        return (<div style={{
            position: 'absolute',
            right: this.state.x,
            top: this.state.y,
            padding: 5,
            backgroundColor: '#666',
            visibility: visible}}>
            {buttons}
        </div>);
    }

    componentDidMount() {
        interact(ReactDOM.findDOMNode(this))
            .draggable({
                restrict: {
                    restriction: "parent",
                    endOnly: true,
                    elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                },
                autoScroll: true,
                onmove: (event) => {
                    var target = event.target;

                    target.style.right = (parseInt(target.style.right) || 0) + (-event.dx) + 'px';
                    target.style.top = (parseInt(target.style.top) || 0) + event.dy + 'px';
                },
                onend: (event) => {
                    //this.props.onToolbarMoved(this.props.id, parseInt(event.target.style.left), parseInt(event.target.style.top));
                }
            });
    }
}
