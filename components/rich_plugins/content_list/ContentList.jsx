import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Utils, {isContainedView} from './../../../utils';

export default class ContentList extends Component {
    render() {
        let alreadyShown = [];
        return (
            /* jshint ignore: start */
            <div>
                {
                    Object.keys(this.props.state.__marks).map(id => {
                        let mark = this.props.state.__marks[id];
                        if (mark.connectMode === "new") {
                            alreadyShown.push(mark.connection);
                        }

                        let allViews = Object.assign({},this.props.navItems, this.props.containedViews);

                        return (
                            <div key={id}
                                 onClick={() => {
                                    if(mark.connectMode === "existing"){
                                        if(isContainedView(mark.connection)){
                                            this.props.onContainedViewSelected(mark.connection);
                                        } else{
                                            this.props.onNavItemSelected(mark.connection);
                                        }
                                    }else if(mark.connectMode === "new"){
                                        this.props.onContainedViewSelected(mark.connection);
                                    }else if(mark.connectMode === "external"){
                                        window.open(mark.connection, '_blank');
                                    }
                                 }}>
                                {mark.title}
                                &nbsp;->&nbsp;
                                {mark.connectMode === "existing" ?  mark.connection: allViews[mark.connection].name }
                            </div>
                        );
                    })
                }
                {
                    this.props.box.containedViews.map(id => {
                        if (alreadyShown.indexOf(id) === -1) {
                            return (
                                <div key={id}
                                     onClick={() => {
                                        this.props.onContainedViewSelected(id);
                                     }}>
                                    UNASSIGNED&nbsp;->&nbsp;{id}
                                </div>
                            );
                        }
                    })
                }
            </div>
            /* jshint ignore: end */
        );
    }
}