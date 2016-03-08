import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import DaliBox from '../components/DaliBox';

export default class PluginPlaceholder extends Component {
    render() {
        let content;
        if(Object.keys(this.props.parentBox.sortableContainers).length && this.props.parentBox.sortableContainers[this.props.pluginContainer]){
            content = (
                <div style={{
                        width: '100%',
                        height: this.props.parentBox.sortableContainers[this.props.pluginContainer].height,
                        position: 'relative'}}>
                    {this.props.parentBox.sortableContainers[this.props.pluginContainer].children.map((idBox, index) => {
                        let box = this.props.boxes[idBox];
                        let isSelected = (idBox === this.props.boxSelected);
                        return (<DaliBox box={box}
                                         id={idBox}
                                         key={index}
                                         isSelected={isSelected}
                                         toolbar={this.props.toolbars[idBox]}
                                         onBoxSelected={this.props.onBoxSelected}
                                         onBoxMoved={this.props.onBoxMoved}
                                         onBoxResized={this.props.onBoxResized}
                                         onBoxDeleted={this.props.onBoxDeleted}
                                         onBoxModalToggled={this.props.onBoxModalToggled}
                                         onTextEditorToggled={this.props.onTextEditorToggled} />);
                    })}
                    <div style={{position: 'absolute', bottom: 0}}>
                        <Button onClick={e => this.props.onBoxModalToggled(this.props.parentBox.id, false, this.props.pluginContainer)}>
                            <i className="fa fa-plus"></i>
                        </Button>
                    </div>
                </div>
            );
        }else{
            content = (
                <button style={{width: "100%",
                            height: "100%",
                            backgroundColor: "transparent",
                            border: "1px dotted black"}}
                        onClick={e =>{
                        this.props.onBoxModalToggled(this.props.parentBox.id, false, this.props.pluginContainer);
                        e.stopPropagation();
                    }}>
                    <i className="fa fa-plus"></i>
                </button>);
        }
        return content;
    }
}
