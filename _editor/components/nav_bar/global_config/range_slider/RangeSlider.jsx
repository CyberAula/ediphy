import React, { Component } from 'react';
import ReactDOM from 'react-dom';

require('./_rangeslider.scss');

export default class RangeSlider extends Component {

    constructor(props) {
        super();
        let min = props.minValue || props.min;
        let max = props.maxValue || props.max;
        this.state = {
            min: props.min,
            max: props.max,
            minElement: { value: min },
            maxElement: { value: max },
            minRange: props.minRange || 500,
        };
    }
    componentDidMount() {
        /* let min = this.props.minValue || this.props.min;
        let max = this.props.maxValue || this.props.max;
        this.state.minElement.value = min;
        this.state.maxElement.value = max;
        this.setState({ min: min, max: max }); */
    }
    componentWillReceiveProps(props) {
        // keep state in sync if we get new props
        // TODO: consolidate with CDM
        let min = this.props.minValue || this.props.min;
        let max = this.props.maxValue || this.props.max;
        this.state.minElement.value = min;
        this.state.maxElement.value = max;
        this.setState({ min: min, max: max });
    }
    render() {
        let classN = (this.props.className ? this.props.className : '') + ' W(100%)';
        return (
            <div style={this.props.style} className={classN}>
                <div className="D(ib) C(#4e5b65)">{this.state.min}</div>
                <div className="D(ib) Fl(end) C(#4e5b65)">{this.state.max}{(this.props.max === this.state.max) ? '+' : ''}</div>
                <div style={this.props.style}
                    className={this.props.className + ' range-slider Pos(r) Ta(c) H(35px)'}>
                    <div style={{
                        position: 'absolute',
                        boxSizing: 'border-box',
                        width: '100%',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        top: '7px' }}>
                        <div style={{
                            marginLeft: (this.state.min - this.props.min) / (this.props.max - this.props.min) * 100 + '%',
                            width: (100 - (this.state.min - this.props.min + this.props.max - this.state.max) / (this.props.max - this.props.min) * 100) + '%',
                            height: '4px',
                            backgroundColor: '#5FCCC7' }}/>
                    </div>
                    <input onChange={
                        (ev)=>{
                            if (ev.target.value < this.state.max - this.state.minRange) {
                                this.setState(
                                    { min: parseInt(ev.target.value, 10) },
                                    function() {
                                        this.props.onChange(this.state);
                                    }
                                );
                            } else {
                                this.state.minElement.value = this.state.min;
                                this.setState(
                                    { min: parseInt(this.state.min, 10) },
                                    function() {
                                        this.props.onChange(this.state);
                                    }
                                );
                            }
                        }
                    }
                    ref={(el)=>{this.state.minElement = el;}}
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                    type="range" />
                    <input onChange={
                        (ev)=>{
                            if (ev.target.value > this.state.min + this.state.minRange) {
                                this.setState(
                                    { max: parseInt(ev.target.value, 10) },
                                    function() {
                                        this.props.onChange(this.state);
                                    }
                                );
                            }
                            else {
                                this.state.maxElement.value = this.state.max;
                                this.setState(
                                    { max: parseInt(this.state.max, 10) },
                                    function() {
                                        this.props.onChange(this.state);
                                    }
                                );
                            }
                        }
                    }
                    ref={(el)=>{this.state.maxElement = el;}}
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                    type="range" />
                </div>
            </div>
        );
    }
}
