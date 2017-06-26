import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import VisorNavSection from './VisorNavSection';
import {isSlide} from './../../../utils';

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
                        <h1>{this.props.courseTitle}</h1>
                    </li>
                    {this.props.navItemsIds.map(page => {
                        let level = this.props.navItemsById[page].level;
                        let marginPage = level*10 + 10 + "px";
                        if(level == 1) {
                            if (page.indexOf("se") != -1){
                                return (<VisorNavSection display={true}
                                                         key={page}
                                                         pageName={page}
                                                         navItemsById={this.props.navItemsById}
                                                         navItemSelected={this.props.navItemSelected}
                                                         changePage={(page)=> {this.props.changePage(page)}} />);
                            } else {
                                return (<li key={page}
                                            onClick={(e)=>{this.props.changePage(page)}}
                                            className="visorNavListEl">
                                            <a style={{paddingLeft: marginPage}}
                                                className={this.props.navItemSelected == page ? "indexElementTitle selectedNavItemVisor":"indexElementTitle"}
                                                href="#">
                                                {isSlide(this.props.navItemsById[page].type) ? (<i className="material-icons">slideshow</i>):(<i className="material-icons">insert_drive_file</i>)}
                                                <span>{this.props.navItemsById[page].name}</span>
                                                {/*this.props.navItemsById[page].name*/}

                                            </a>
                                </li>);
                            }
                        }
                    })}

                </ul>
            </div>
            /* jshint ignore:end */
        );
    }
}
