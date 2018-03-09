import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ediphy from '../../../core/editor/main';
import { isSlide, isSection } from '../../../common/utils';
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
        let name = this.props.navItemsById[this.props.pageName].name;
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
                        exercisesPages={this.props.exercisesPages}
                        progress={this.props.progress}
                        navItemsById={this.props.navItemsById}
                        navItemsIds={this.props.navItemsIds}
                        changeCurrentView={(pageNum) => {this.props.changeCurrentView(pageNum);}} />);
                }
                let isVisited = this.props.progress[page];
                let first = false;
                let last = false;
                let indN = this.props.navItemsIds.indexOf(page);
                first = indN === 0;
                last = indN === this.props.navItemsIds.length - 1;

                return (<li key={page}
                    onClick={(e)=>{this.props.changeCurrentView(page);}}
                    className={this.state.toggled ? "visorNavListEl" : "visorNavListEl hiddenNavVisor"}>
                    <span className={"progressBall"}><ProgressBall isVisited={isVisited} isTop={first} isBottom={last} /></span>
                    <a style={{ paddingLeft: margin }}
                        className={this.props.navItemSelected === page ? "indexElementTitle selectedNavItemVisor" : "indexElementTitle"}
                        href="#">

                        {(this.props.navItemsById[page].customSize === 0) ?
                            <i className="material-icons">{isSlide(this.props.navItemsById[page].type) ? "slideshow" : "insert_drive_file"}</i>
                            : <img className="svgIcon" src={iconPDF}/>}
                        <span>{this.props.navItemsById[page].name}</span>
                    </a>
                </li>);

            }
            return null;
        });
        let first = false;
        let last = false;
        let indN = this.props.navItemsIds.indexOf(this.props.pageName);
        first = indN === 0;
        last = indN === this.props.navItemsIds.length - 1;

        return (
            <ul className={classes}>
                <li className="visorNavListEl" onClick={(e)=>{
                    if (Ediphy.Config.sections_have_content) {
                        this.props.changeCurrentView(this.props.pageName);
                    } else {
                        this.setState({ toggled: !this.state.toggled });
                    }}}>
                    <span className={"progressBall"}><ProgressBall isTop={first} isBottom={last} isVisited={isSectionVisited}/></span>
                    <a className={this.props.navItemSelected === this.props.pageName ? "indexElementTitle visorNavListEl selectedNavItemVisor" : "indexElementTitle visorNavListEl"} style={{ paddingLeft: marginUl }} href="#">

                        {this.state.toggled ?
                            (<i onClick={(e)=>{this.setState({ toggled: !this.state.toggled });}} className="material-icons">keyboard_arrow_down</i>) : (<i onClick={(e)=>{this.setState({ toggled: !this.state.toggled });}} className="material-icons">keyboard_arrow_right</i>)}

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
};
