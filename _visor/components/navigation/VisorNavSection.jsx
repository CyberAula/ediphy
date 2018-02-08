import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ediphy from '../../../core/editor/main';
import { isSlide, isSection } from '../../../common/utils';
import iconPDF from './../../../dist/images/file-pdf.svg';

export default class VisorNavSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggled: true,
        };
    }

    render() {
        let children = this.props.navItemsById[this.props.pageName].children;
        let marginUl = (this.props.navItemsById[this.props.pageName].level * 10) + "px";
        let name = this.props.navItemsById[this.props.pageName].name;
        let classes = this.props.display ? "visorNavListEl" : "visorNavListEl hiddenNavVisor";
        return (
            <ul className={classes}>
                <li className="visorNavListEl" onClick={(e)=>{
                    if (Ediphy.Config.sections_have_content) {
                        this.props.changeCurrentView(this.props.pageName);
                    } else {
                        this.setState({ toggled: !this.state.toggled });
                    }}}>
                    <a className={this.props.navItemSelected === this.props.pageName ? "indexElementTitle visorNavListEl selectedNavItemVisor" : "indexElementTitle visorNavListEl"} style={{ paddingLeft: marginUl }} href="#">
                        {this.state.toggled ?
                            (<i onClick={(e)=>{this.setState({ toggled: !this.state.toggled });}} className="material-icons">keyboard_arrow_down</i>) : (<i onClick={(e)=>{this.setState({ toggled: !this.state.toggled });}} className="material-icons">keyboard_arrow_right</i>)}

                        <span> {name} </span>
                    </a>
                </li>

                { children.map(page => {
                    let margin = this.props.navItemsById[page].level * 10 + 10 + "px";
                    if (isSection(page)) {
                        return (<VisorNavSection display={this.state.toggled}
                            key={page}
                            pageName={page}
                            navItemSelected={this.props.navItemSelected}
                            navItemsById={this.props.navItemsById}
                            changeCurrentView={(pageNum) => {this.props.changeCurrentView(pageNum);}} />);
                    }
                    return (<li key={page}
                        onClick={(e)=>{this.props.changeCurrentView(page);}}
                        className={this.state.toggled ? "visorNavListEl" : "visorNavListEl hiddenNavVisor"}>
                        <a style={{ paddingLeft: margin }}
                            className={this.props.navItemSelected === page ? "indexElementTitle selectedNavItemVisor" : "indexElementTitle"}
                            href="#">
                            {(this.props.navItemsById[page].customSize === 0) ?
                                <i className="material-icons">{isSlide(this.props.navItemsById[page].type) ? "slideshow" : "insert_drive_file"}</i>
                                : <img className="svgIcon" src={iconPDF}/>}
                            <span>{this.props.navItemsById[page].name}</span>
                        </a>
                    </li>);

                })
                }

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
