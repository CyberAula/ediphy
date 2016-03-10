import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import DaliBox from '../components/DaliBox';

export default class PluginPlaceholder extends Component {
    render() {
        let container = this.props.parentBox.sortableContainers[this.props.pluginContainer];
        let contentFull = (
            <div style={{
                        width: '100%',
                        height: (container) ? container.height : 0,
                        position: 'relative'}}>
                {container ? container.children.map((idBox, index) => {
                    return (<DaliBox id={idBox}
                                     key={index}
                                     boxes={this.props.boxes}
                                     boxSelected={this.props.boxSelected}
                                     toolbars={this.props.toolbars}
                                     onBoxSelected={this.props.onBoxSelected}
                                     onBoxMoved={this.props.onBoxMoved}
                                     onBoxResized={this.props.onBoxResized}
                                     onBoxDeleted={this.props.onBoxDeleted}
                                     onBoxModalToggled={this.props.onBoxModalToggled}
                                     onTextEditorToggled={this.props.onTextEditorToggled}/>);
                }) : ""}
                <div style={{position: 'absolute', bottom: 0}}>
                    <Button ref={e => {
                        if(e !== null){
                            if(!($._data( ReactDOM.findDOMNode(e), "events" ) && $._data( ReactDOM.findDOMNode(e), "events" ).click)){
                                $(ReactDOM.findDOMNode(e)).click(function(e){
                                    this.props.onBoxModalToggled(this.props.parentBox.id, false, this.props.pluginContainer);
                                    e.stopPropagation();
                                }.bind(this));
                            }
                        }
                    }}>
                        <i className="fa fa-plus"></i>
                    </Button>
                </div>
            </div>
        );
        let contentEmpty = (
            <button ref={"buttonAddNew"} style={{width: "100%",
                            height: "100%",
                            backgroundColor: "transparent",
                            border: "1px dotted black"}}>
                <i className="fa fa-plus"></i>
            </button>);

        if (Object.keys(this.props.parentBox.sortableContainers).length && this.props.parentBox.sortableContainers[this.props.pluginContainer]) {
            return contentFull;
        }
        return contentEmpty;
    }

    componentDidMount(){
        $(this.refs.buttonAddNew).click(function(e){
            this.props.onBoxModalToggled(this.props.parentBox.id, false, this.props.pluginContainer);
            e.stopPropagation();
        }.bind(this));
    }

    componentWillUnmount(){
        console.log("unmount");
    }
}
