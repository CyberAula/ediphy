import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';

export default class MarksList extends Component {
    render() {
        return (
            /* jshint ignore: start */
            <div>
                <Button onClick={e => {
                    this.props.onRichMarksModalToggled();
                    e.stopPropagation();
                    }}>
                    Add mark
                </Button>
                {
                    Object.keys(this.props.state.__marks).map(id => {
                        let mark = this.props.state.__marks[id];
                        return (
                            <div key={id}>
                                {mark.title}
                                <i className="material-icons"
                                   onClick={() => {
                                        this.props.onRichMarkEditPressed(mark);
                                        this.props.onRichMarksModalToggled();
                                   }}>edit</i>
                                <i className="material-icons"
                                   onClick={() => {
                                        this.props.onRichMarkDeleted(id);
                                   }}>delete</i>
                            </div>
                        );
                    })
                }
            </div>
            /* jshint ignore: end */
        );
    }
}