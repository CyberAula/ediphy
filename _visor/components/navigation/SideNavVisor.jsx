import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import VisorNavSection from './VisorNavSection';
import { isSlide, isPage, isSection } from './../../../utils';

export default class SideNavVisor extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let navItemSelected = this.getCurrentNavItem(this.props.currentViews);

        return(
            /* jshint ignore:start */
            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <li className="sidebar-brand">
                        <h1>{this.props.courseTitle}</h1>
                    </li>
                    {this.props.navItemsIds.map(page => {
                        let level = this.props.navItemsById[page].level;
                        let marginPage = level * 10 + 10 + "px";
                        if(level === 1) {
                            if (isSection(page)) {
                                return (<VisorNavSection display
                                    key={page}
                                    pageName={page}
                                    navItemsById={this.props.navItemsById}
                                    navItemSelected={navItemSelected}
                                    changeCurrentView={(pageNum) => {this.props.changeCurrentView(pageNum);}} />);
                            }
                            return (<li key={page}
                                onClick={(e)=>{this.props.changeCurrentView(page);}}
                                className="visorNavListEl">
                                <a style={{ paddingLeft: marginPage }}
                                    className={navItemSelected === page ? "indexElementTitle selectedNavItemVisor" : "indexElementTitle"}
                                    href="#">
                                    {isSlide(this.props.navItemsById[page].type) ? (<i className="material-icons">slideshow</i>) : (<i className="material-icons">insert_drive_file</i>)}
                                    <span>{this.props.navItemsById[page].name}</span>
                                    {/* this.props.navItemsById[page].name*/}

                                </a>
                            </li>);

                        }
                        return null;
                    })}

                </ul>
            </div>
            /* jshint ignore:end */
        );
    }
    getCurrentNavItem(ids) {
        let navs = ids.filter(isPage);
        return navs.length > 0 ? navs[navs.length - 1] : 0;
        /* return ids.reduce(e=>{
            if (isPage(e)){
                console.log(e)
                return e;
            }
        });*/
    }
}
