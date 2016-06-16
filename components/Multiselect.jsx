import React from 'react';
import Select from 'react-select';

 

var Multiselect = React.createClass({
	displayName: 'Multiselect',

	handleSelectChange (value) {
		console.log('You\'ve selected:', value);
		this.props.onChange(value)
		console.log(this.props.value)
	},
 
 
	render () {
		return (
		 
				<Select multi simpleValue   value={this.props.value} placeholder="No has elegido ninguna opción" options={this.props.options} onChange={this.handleSelectChange} />
 
		);
	}
});

module.exports = Multiselect;
