import React, { Component } from 'react';
import PropTypes from 'prop-types';
import iconPDF from './../../../dist/images/file-pdf.svg';
import VisorNavSection from './VisorNavSection';
import { isSlide, isPage, isSection } from '../../../common/utils';

export default class VisorSideNav extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let navItemSelected = this.getCurrentNavItem(this.props.currentViews);
        return(
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
    /**
     * Indica si la barra de navegación está recogida o expandida
     */
    toggled: PropTypes.bool,
};
