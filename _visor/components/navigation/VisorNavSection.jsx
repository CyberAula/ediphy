import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ediphy from '../../../core/editor/main';
import { isSlide, isSection, findDescendantNavItems } from '../../../common/utils';
import iconPDF from './../../../dist/images/file-pdf.svg';
import ProgressBall from './ProgressBall';
export default class VisorNavSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggled: true,
        };
    }

    render() {
        let children = this.props.navItemsById[this.props.pageName].children;
        let marginUl = (this.props.navItemsById[this.props.pageName].level * 10 + 11) + "px";
        let name = this.props.viewToolbars[this.props.pageName].viewName;
        let classes = this.props.display ? "visorNavListEl" : "visorNavListEl hiddenNavVisor";
        let isSectionVisited = this.props.progress[this.props.pageName];

        let childrenNavs = children.map(page => {
            let pageObj = this.props.navItemsById[page];
            let margin = pageObj.level * 10 + 21 + "px";
            if (!pageObj.hidden) {
                if (isSection(page)) {
                    return (<VisorNavSection display={this.state.toggled}
                        key={page}
                        pageName={page}
                        navItemSelected={this.props.navItemSelected}
                        progress={this.props.progress}
                        navItemsById={this.props.navItemsById}
                        navItemsIds={this.props.navItemsIds}
                        viewToolbars={this.props.viewToolbars}
                        first={this.props.first} last={this.props.last}
                        changeCurrentView={(pageNum) => {this.props.changeCurrentView(pageNum);}} />);
                }
                let isVisited = this.props.progress[page];

                return (<li key={page} id={'nav-' + page}
                    onClick={(e)=>{this.props.changeCurrentView(page);}}
                    className={this.state.toggled ? "visorNavListEl" : "visorNavListEl hiddenNavVisor"}>
                    <span className={"progressBall"}><ProgressBall isVisited={isVisited} isTop={page === this.props.first} isBottom={page === this.props.last} /></span>
                    <a style={{ paddingLeft: margin }}
                        className={this.props.navItemSelected === page ? "indexElementTitle selectedNavItemVisor" : "indexElementTitle"}
                        href="#">

                        {(this.props.navItemsById[page].customSize === 0) ?
                            <i className="material-icons">{isSlide(this.props.navItemsById[page].type) ? "slideshow" : "insert_drive_file"}</i>
                            : <img className="svgIcon" src={iconPDF}/>}
                        <span>{this.props.viewToolbars[page].viewName}</span>
                    </a>
                </li>);

            }
            return null;
        });
        let descendants = findDescendantNavItems(this.props.navItemsById, this.props.pageName);
        let last = (descendants.indexOf(this.props.last) > -1 && !this.state.toggled) ? this.props.pageName : this.props.last;
        return (
            <ul className={classes} id={'nav-' + this.props.pageName}>
                <li className=" " onClick={(e)=>{
                    if (Ediphy.Config.sections_have_content) {
                        this.props.changeCurrentView(this.props.pageName);
                    } else {
                        this.setState({ toggled: !this.state.toggled });
                    }}}>
                    <span className={"progressBall"}><ProgressBall isTop={this.props.pageName === this.props.first} isBottom={this.props.pageName === last} isVisited={isSectionVisited}/></span>
                    <a className={this.props.navItemSelected === this.props.pageName ? "indexElementTitle selectedNavItemVisor" : "indexElementTitle  "} style={{ paddingLeft: marginUl }} href="#">
                        {this.state.toggled ?
                            (<i onClick={(e)=>{this.setState({ toggled: !this.state.toggled });}} className="material-icons arrowSection">keyboard_arrow_down</i>) : (<i onClick={(e)=>{this.setState({ toggled: !this.state.toggled });}} className="material-icons arrowSection">keyboard_arrow_right</i>)}

                        <span> {name} </span>
                    </a>
                </li>

                { childrenNavs }

            </ul>
        );
    }
}

VisorNavSection.propTypes = {
    /**
     * Indica si está desplegada o replegada
     */
    display: PropTypes.bool,
    /**
     * Nombre de la sección
     */
    pageName: PropTypes.string.isRequired,
    /**
     * Diccionario que contiene todas las vistas, accesibles por su *id*
     */
    navItemsById: PropTypes.object.isRequired,
    /**
     * Vista seleccionada actualmente
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Cambia la vista actual
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
   * List of all the course navItems in order
   */
    navItemsIds: PropTypes.object.isRequired,
    /**
   * First navitem visible
   */
    first: PropTypes.string,
    /**
   * Last navitem visible
   */
    last: PropTypes.string,
    /**
   * Calculated completed pages
   */
    progress: PropTypes.object,

};
