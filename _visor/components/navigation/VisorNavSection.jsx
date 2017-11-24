import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ediphy from '../../../core/editor/main';
import { isSlide, isSection } from '../../../common/utils';

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
                        this.props.changePage(this.props.pageName);
                    } else {
                        this.setState({ toggled: !this.state.toggled });
                    }}}>
                    <button className={this.props.navItemSelected === this.props.pageName ? "indexElementTitle visorNavListEl selectedNavItemVisor" : "indexElementTitle visorNavListEl"} style={{ paddingLeft: marginUl }} >
                        {this.state.toggled ?
                            (<i onClick={(e)=>{this.setState({ toggled: !this.state.toggled });}} className="material-icons">keyboard_arrow_down</i>) : (<i onClick={(e)=>{this.setState({ toggled: !this.state.toggled });}} className="material-icons">keyboard_arrow_right</i>)}

                        <span> {name} </span>
                    </button>
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
                        <button style={{ paddingLeft: margin }}
                            className={this.props.navItemSelected === page ? "indexElementTitle selectedNavItemVisor" : "indexElementTitle"}>
                            {isSlide(this.props.navItemsById[page].type) ? (<i className="material-icons">slideshow</i>) : (<i className="material-icons">insert_drive_file</i>)}
                            <span>{this.props.navItemsById[page].name}</span>
                        </button>
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
