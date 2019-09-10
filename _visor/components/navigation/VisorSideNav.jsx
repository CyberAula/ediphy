import React, { Component } from 'react';
import PropTypes from 'prop-types';
import iconPDF from './../../../dist/images/file-pdf.svg';
import VisorNavSection from './VisorNavSection';
import NavScore from '../score/NavScore';
import ProgressBall from './ProgressBall';

import { isSlide, isPage, isSection } from '../../../common/utils';
export default class VisorSideNav extends Component {
    render() {
        let navItemSelected = this.getCurrentNavItem(this.props.currentViews);
        let visited = this.props.scoreInfo.visited || [];
        let prog = this.calculateProgress();
        let last = this.props.navItemsIds.length > 0 ? this.props.navItemsIds[this.props.navItemsIds.length - 1] : null;
        let first = this.props.navItemsIds.length > 0 ? this.props.navItemsIds[0] : null;

        return(
            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <li className="sidebar-brand" id="tituloCurso">
                        <h1>{this.props.courseTitle}</h1>
                    </li>
                    <NavScore show={this.props.showScore} scoreInfo={this.props.scoreInfo}/>

                    {this.props.navItemsIds.map(page => {
                        let pageObj = this.props.navItemsById[page];
                        let level = pageObj.level;
                        let marginPage = level * 10 + 30 + "px";
                        if(level === 1 && !pageObj.hidden) {
                            if (isSection(page)) {
                                return (<VisorNavSection display
                                    key={page}
                                    pageName={page}
                                    navItemsById={this.props.navItemsById}
                                    navItemSelected={navItemSelected}
                                    viewToolbars={this.props.viewToolbars}
                                    progress={prog}
                                    first={first} last={last}
                                    navItemsIds={this.props.navItemsIds}
                                    changeCurrentView={(pageNum) => {this.props.changeCurrentView(pageNum);}} />);
                            }
                            let isVisited = false;

                            if (visited.length > 0) {
                                isVisited = prog[page];
                            }

                            return (<li key={page} id={'nav-' + page}
                                onClick={()=>{this.props.changeCurrentView(page);}}
                                className="visorNavListEl">
                                <span className={"progressBall"}><ProgressBall isVisited={isVisited} isTop={first === page} isBottom={last === page} /> </span>
                                <a style={{ paddingLeft: marginPage }}
                                    className={navItemSelected === page ? "indexElementTitle selectedNavItemVisor" : "indexElementTitle"}
                                    href="#">

                                    {(this.props.navItemsById[page].customSize === 0) ?
                                        <i className="material-icons">{isSlide(this.props.navItemsById[page].type) ? "slideshow" : "insert_drive_file"}</i>
                                        : <img className="svgIcon" src={iconPDF} alt={'PDF'}/>}
                                    <span>{this.props.viewToolbars[page].viewName}</span>
                                </a>
                            </li>);

                        }
                        return null;
                    })}

                </ul>
            </div>
        );
    }
    getCurrentNavItem(ids) {
        let navs = ids.filter(isPage);
        return navs.length > 0 ? navs[navs.length - 1] : 0;
    }

    calculateProgress = () => {
        let progress = {};
        let pending = [];
        this.props.navItemsIds.map(nav => {
            let navItsEx = Object.keys(this.props.exercises);
            let ind = navItsEx.indexOf(nav);
            if (ind === -1) { // This means it is a section with no content => We need to find out if all its children are complete
                pending.push(nav);
            } else {
                let scoreInfoVisited = this.props.scoreInfo.visited;
                if (scoreInfoVisited) {
                    progress[nav] = scoreInfoVisited[ind];
                } else {
                    progress[nav] = false;
                }

            }
        });
        pending.reverse().map(nav=>{
            let complete = 0;
            let children = this.props.navItemsById[nav].children.filter(child => {
                return !this.props.navItemsById[child].hidden;
            });
            children.map((child) => {
                complete += (progress[child] ? 1 : 0);
            });
            complete = complete === children.length;
            progress[nav] = complete;
        });
        return progress;
    };

}

VisorSideNav.propTypes = {
    /**
     * Changes current view
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
     * Course title
     */
    courseTitle: PropTypes.string,
    /**
     * Dictionary that contains all views and contained views. The key for each value is the identifier of the view
     */
    currentViews: PropTypes.array.isRequired,
    /**
     * Dictionary that contains all views. The key for each value is the identifier of the view
     */
    navItemsById: PropTypes.object.isRequired,
    /**
     * Objects Array that contains all created views (identified by its *id*)
     */
    navItemsIds: PropTypes.array.isRequired,
    /**
     * Exercises
     */
    exercises: PropTypes.object.isRequired,
    /**
     * Score information
     */
    scoreInfo: PropTypes.object.isRequired,
    /**
   * Show course's score
   */
    showScore: PropTypes.bool,
    /**
     * View toolbars
     */
    viewToolbars: PropTypes.object,
};
