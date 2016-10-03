import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class ContentList extends Component {
    render() {
        return (
            /* jshint ignore: start */
            <div>
                {
                    Object.keys(this.props.state.__marks).map(id => {
                        let mark = this.props.state.__marks[id];
                        return (
                            <div key={id}
                                 onClick={() => {
                                    if(mark.connectMode === "existing"){
                                        this.props.onNavItemSelected(mark.connection);
                                    }else if(mark.connectMode === "external"){
                                        window.open(mark.connection, '_blank');
                                    }
                                 }}>
                                {mark.title}
                                &nbsp;->&nbsp;
                                {mark.connectMode === "existing" ? this.props.navItems[mark.connection].name : mark.connection}
                            </div>
                        );
                    })
                }
            </div>
            /* jshint ignore: end */
        );
    }
}