import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './_rangeslider.scss';
/**
 * Range slider component with min and max draggable values
 */
export default class RangeSlider extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super();
        let min = props.minValue || props.min;
        let max = props.maxValue || props.max;

        /**
         * Co;ponent's initial state
         */
        this.state = {
            min: props.min,
            max: props.max,
            minElement: { value: min },
            maxElement: { value: max },
            minRange: props.minRange || 500,
        };
    }

    /**
     * Keep state in sync if we get new props
     * @param props
     */
    UNSAFE_componentWillReceiveProps() {
        let min = this.props.minValue || this.props.min;
        let max = this.props.maxValue || this.props.max;

        this.state.minElement.value = min;
        this.state.maxElement.value = max;
        this.setState({ min: min, max: max });
    }

    UNSAFE_componentWillMount() {
        let min = this.props.minValue || this.props.min;
        let max = this.props.maxValue || this.props.max;

        this.state.minElement.value = min;
        this.state.maxElement.value = max;
        this.setState({ min: min, max: max });
    }

    /**
     * Render React Component
     * @returns {code}
     */
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
                    defaultValue={(this.state.min > 0) ? this.state.min : 0}
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
                    defaultValue={(this.state.min < 100) ? this.state.max : 100}
                    step={this.props.step}
                    type="range"/>
                </div>
            </div>
        );
    }
}
RangeSlider.propTypes = {
    /**
     * Class to apply
     */
    className: PropTypes.string,
    /**
     * Mínimo valor posible
     */
    min: PropTypes.number.isRequired,
    /**
     * Máximo valor posible
     */
    max: PropTypes.number.isRequired,
    /**
     * Diferencia mínima permitida entre el máximo y el mínimo valor
     */
    minRange: PropTypes.number.isRequired,
    /**
     * Valor inferior seleccionado
     */
    minValue: PropTypes.number.isRequired,
    /**
     * Valor superior seleccionado
     */
    maxValue: PropTypes.number.isRequired,
    /**
     * Modifica el valor del input
     */
    onChange: PropTypes.func.isRequired,
    /**
     * Incremento de valor mínimo
     */
    step: PropTypes.number.isRequired,
    /**
      * Style to apply
      */
    style: PropTypes.object,
};
