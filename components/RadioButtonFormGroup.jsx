import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Button, FormControl, InputGroup, FormGroup, ControlLabel, Tooltip, OverlayTrigger} from 'react-bootstrap'; 
import i18n from 'i18next';

/*
Radio Button that displays material icons instead of plain text options
Example usage:

 <RadioButtonFormGroup  key="alignment"         
                        title='Alineación'       // Label for Input
                        options={['left', 'center', 'right']}      // The actual value of the option
                        selected={this.props.box.textAlign}        // Current value               
                        click={(option) => {this.props.onChangeSortableProps(this.props.id, this.props.parentId, 'textAlign', option)}}  // Change handler
                        tooltips={['Alinear a la izquierda', 'Alinear al centro','Alinear a la derecha']} // Optional: Help message for the user. Default: option value
                        icons={['format_align_left', 'format_align_center', 'format_align_right']} />  // Material icon code in the same order as the options

*/
export default class RadioButtonFormGroup extends Component {
    constructor(props) {
        super(props);
        

    }
    tooltip(text){
      return (
        /* jshint ignore:start */ 
         <Tooltip id="tooltip_radio">{text}</Tooltip>
        /* jshint ignore:end */ 
      );
    }
    render() {
       /* jshint ignore:start */ 
      return  React.createElement(FormGroup, {},
                    React.createElement(ControlLabel, {key: 'label'}, this.props.title), <br key="space"/>,
                        this.props.options
                            .map((option, index) => {
                                return (<OverlayTrigger placement="top" key={'item_' + index} overlay={this.props.tooltips ? this.tooltip(this.props.tooltips[index]) :  this.tooltip(option)}>
                                          {React.createElement('button', 
                                            {value: option, 
                                             className: (this.props.selected === option ? 'ribShortcut selectedAlignment' : 'ribShortcut unselectedAlignment'), 
                                             onClick: e => {this.props.click(option); e.stopPropagation();}
                                            }, 
                                            <i className="material-icons">{this.props.icons[index]}</i>)}
                                        </OverlayTrigger>)
                            })
                    )
                
       /* jshint ignore:end */
    }

    componentWillUpdate(nextProps, nextState) {
          return true;
    }
}

 
