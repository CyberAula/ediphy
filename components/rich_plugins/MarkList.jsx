import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';

export default class MarkList extends Component {
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
                        return this.props.state.__marks[id].title;
                    })
                }
            </div>
            /* jshint ignore: end */
        );
    }
}