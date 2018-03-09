import React, { Component } from 'react';
import PropTypes from 'prop-types';
import iconPDF from './../../../dist/images/file-pdf.svg';
import VisorNavSection from './VisorNavSection';
import NavScore from '../scorm/NavScore';
import ProgressBall from './ProgressBall';

import { isSlide, isPage, isSection } from '../../../common/utils';
export default class VisorSideNav extends Component {
    constructor(props) {
        super(props);
        this.calculateProgress = this.calculateProgress.bind(this);
    }

    render() {
        let navItemSelected = this.getCurrentNavItem(this.props.currentViews);
        let navItsEx = Object.keys(this.props.exercises);
        let visited = this.props.scoreInfo.visited || [];
        let prog = this.calculateProgress();
        return(
            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <li className="sidebar-brand" id="tituloCurso">
                        <h1>{this.props.courseTitle}</h1>
                    </li>
                    <NavScore scoreInfo={this.props.scoreInfo}/>

                    {this.props.navItemsIds.map(page => {
                        let pageObj = this.props.navItemsById[page];
                        let level = pageObj.level;
                        let marginPage = level * 10 + 21 + "px";
                        if(level === 1 && !pageObj.hidden) {
                            if (isSection(page)) {
                                return (<VisorNavSection display
                                    key={page}
                                    pageName={page}
                                    navItemsById={this.props.navItemsById}
                                    navItemSelected={navItemSelected}
                                    exercisesPages={navItsEx}
                                    progress={prog}
                                    navItemsIds={this.props.navItemsIds}
                                    changeCurrentView={(pageNum) => {this.props.changeCurrentView(pageNum);}} />);
                            }
                            let isVisited = false;
                            let indN = this.props.navItemsIds.indexOf(page);
                            let first = indN === 0;
                            let last = indN === this.props.navItemsIds.length - 1;

                            if (visited.length > 0) {
                                isVisited = prog[page];
                            }
                            return (<li key={page}
                                onClick={(e)=>{this.props.changeCurrentView(page);}}
                                className="visorNavListEl">
                                <span className={"progressBall"}><ProgressBall isVisited={isVisited} isTop={first} isBottom={last} /> </span>
                                <a style={{ paddingLeft: marginPage }}
                                    className={navItemSelected === page ? "indexElementTitle selectedNavItemVisor" : "indexElementTitle"}
                                    href="#">

                                    {(this.props.navItemsById[page].customSize === 0) ?
                                        <i className="material-icons">{isSlide(this.props.navItemsById[page].type) ? "slideshow" : "insert_drive_file"}</i>
                                        : <img className="svgIcon" src={iconPDF}/>}
                                    <span>{this.props.navItemsById[page].name}</span>
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

    calculateProgress() {
        let progress = {};
        let pending = [];
        this.props.navItemsIds.map(nav => {
            let navItsEx = Object.keys(this.props.exercises);
            let ind = navItsEx.indexOf(nav);
            let complete = false;
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
            console.log(children);
            children.map((child) => {
                complete += (progress[child] ? 1 : 0);
            });
            console.log('LENGTH', children.length, "COMPLETE", complete);
            complete = complete === children.length;
            progress[nav] = complete;
        });
        return progress;
    }
}

VisorSideNav.propTypes = {
    /**
     * Cambia la vista actual
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
     * Título del curso
     */
    courseTitle: PropTypes.string.isRequired,
    /**
     Diccionario que contiene todas las vistas y vistas contenidas, accesibles por su *id*
     */
    currentViews: PropTypes.array.isRequired,
    /**
     * Diccionario que contiene todas las vistas, accesibles por su *id*
     */
    navItemsById: PropTypes.object.isRequired,
    /**
     * Array que contiene todas las vistas y vistas contenidas, accesibles por su *id*
     */
    navItemsIds: PropTypes.array.isRequired,
};
