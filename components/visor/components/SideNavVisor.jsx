import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';

export default class SideNavVisor extends Component {
    constructor(props) {
        super(props);
         
    }

    render() {
        return( 
            /* jshint ignore:start */
            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <li className="sidebar-brand">
                        <a href="#">Content</a>
                    </li>
                    {this.props.navItemsIds.map(page => {
                        let margin = this.props.navItemsById[page].level*10 + "px";
                        return (<li key={page} style={{marginLeft: margin}} onClick={(e)=>{this.props.changePage(page)}}>
                                <a href="#">{this.props.navItemsById[page].name}</a>
                            </li>);
                    })}
                     
                </ul>
            </div>
            /* jshint ignore:end */
        );
    }
}
