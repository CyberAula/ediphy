import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button, Grid, Row, Col} from 'react-bootstrap';
import DaliBox from '../components/DaliBox';

export default class PluginPlaceholder extends Component {
    render() {
        let container = this.props.parentBox.sortableContainers[this.props.pluginContainer];
        let contentFull = (
            <Grid fluid={true} style={{
                        width: "100%",
                        height: "100%",
                        position: 'relative',
                        padding: 0,
                        backgroundColor: "#ddd",
                        opacity: 0.3}}>
                {container ?
                    container.rows.map((row, i) => {
                        return (
                            <Row key={i}
                                 style={{height: (100 / 12 * row) + "%", margin: 0}}>
                                {container.cols.map((col, j) => {
                                    return(<Col lg={col}
                                                md={col}
                                                sm={col}
                                                xs={col}
                                                key={j}
                                                style={{height: "100%", padding: 0}}>
                                        {container.children.map((idBox, index) => {
                                            if(this.props.boxes[idBox].row === i && this.props.boxes[idBox].col === j) {
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
                                            }
                                        })}
                                    </Col>)
                                })}
                            </Row>
                        )
                    })
                    : ""}

                <Button style={{position: 'absolute', bottom: 0}} ref={e => {
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
            </Grid>
        );
        let contentEmpty = (
            <div style={{width: '100%', height: 50, position: 'relative'}}>
                <button ref={"buttonAddNew"} style={{width: 90,
                                minWidth: 90,
                                height: 40,
                                minHeight: 40,
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                margin: 'auto',
                                backgroundColor: "transparent",
                                border: "1px dotted black"}}>
                    <i className="fa fa-plus"></i>
            </button></div>);

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
