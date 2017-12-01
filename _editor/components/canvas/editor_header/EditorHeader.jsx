import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, BreadcrumbItem } from 'react-bootstrap';
import i18n from 'i18next';
import './_editorHeader.scss';
import CVInfo from "./CVInfo";

/**
 *  EditorHeaderComponent
 *  It shows the current page's title
 */
export default class EditorHeader extends Component {
    /**
     * Renders React Component
     * @returns {code}
     */
    render() {
        if (this.props.navItem || this.props.containedView) {
            let titles = this.props.titles || [];
            let navItem = this.props.containedView !== 0 ? this.props.containedView : this.props.navItem;
            let currentStatus = (navItem.header) ? navItem.header.display : undefined;
            let docTitle = navItem.name;
            let subTitle = i18n.t('subtitle');
            let pagenumber = this.props.navItem.unitNumber;

            if (navItem !== undefined && navItem.id !== 0 && navItem.header) {
                docTitle = navItem.header.elementContent.documentTitle !== "" && (navItem.header.elementContent.documentTitle !== navItem.name) ? navItem.header.elementContent.documentTitle : navItem.name;
                subTitle = navItem.header.elementContent.documentSubTitle !== "" && (navItem.header.elementContent.documentSubTitle !== i18n.t('subtitle')) ? navItem.header.elementContent.documentSubTitle : i18n.t('subtitle');
                pagenumber = navItem.header.elementContent.numPage !== "" && (navItem.header.elementContent.numPage !== navItem.unitNumber) ? navItem.header.elementContent.numPage : navItem.unitNumber;
            }

            let content;
            let unidad = "";
            // breadcrumb
            if (this.props.containedView === 0) {
                if (currentStatus !== undefined) {
                    if (currentStatus.breadcrumb === 'reduced') {
                        let titleList = this.props.titles;

                        let actualTitle = titleList[titleList.length - 1];
                        unidad = titleList[0];
                        content = React.createElement("div", { className: "subheader" },
                            React.createElement(Breadcrumb, { style: { margin: 0, backgroundColor: 'inherit' } },
                                titleList.map((item, index) => {
                                    if (index !== titleList.length) {
                                        return React.createElement(BreadcrumbItem, { key: index }, item);
                                    }
                                    return null;
                                })
                            )
                        );

                    } else if (currentStatus.breadcrumb === 'expanded') {
                        let titlesComponents = "";
                        let titles_length = this.props.titles.length;
                        content = React.createElement("div", { className: "subheader" },
                            this.props.titles.map((text, index) => {
                                if (index === 0) {
                                    unidad = text;
                                } else {
                                    let nivel = (index > 4) ? 6 : index + 2;
                                    return React.createElement("h" + nivel, {
                                        key: index,
                                        style: { marginTop: '0px' },
                                    }, /* this.getActualIndex(titles_length, index) + */text);
                                }
                                return null;
                            })
                        );
                    }

                }
            }
            if (navItem.id !== 0) {
                let hide = true;
                for (let i in currentStatus) {
                    if (currentStatus[i] !== 'hidden') {
                        hide = false;
                        break;
                    }
                }

                return (
                    <div className="title" onClick={(e) => {
                        this.props.onBoxSelected(-1);
                        e.stopPropagation();
                    }}>
                        <div style={{
                            backgroundColor: 'transparent',
                            display: (!hide && titles.length !== 0) ? 'initial' : 'none',
                        }}>
                            {/* <div className={this.props.showButtons ? "caja selectedTitle selectedBox" : "caja"} > */}
                            <div className={"caja"}>
                                <div className="cab">

                                    <div className="cabtabla_numero"
                                        style={{ display: (currentStatus.pageNumber === 'hidden') ? 'none' : 'block' }}
                                    >{pagenumber}</div>

                                    <div className="tit_ud_cap">
                                        {/* Course title*/}
                                        <h1
                                            style={{ display: (currentStatus.courseTitle === 'hidden') ? 'none' : 'block' }}>{this.props.courseTitle}</h1>
                                        {/* NavItem title */}
                                        <h2
                                            style={{ display: (currentStatus.documentTitle === 'hidden') ? 'none' : 'block' }}>{docTitle}{this.props.containedView !== 0 ? (
                                                <CVInfo containedViews={this.props.containedViews} navItems={this.props.navItems}
                                                    containedView={this.props.containedView} toolbars={this.props.toolbars}
                                                    boxes={this.props.boxes}/>) : null}</h2>
                                        {/* NavItem subtitle */}
                                        <h3
                                            style={{ display: (currentStatus.documentSubTitle === 'hidden') ? 'none' : 'block' }}>{subTitle}</h3>

                                        {/* breadcrumb */}
                                        <div className="contenido"
                                            style={{ display: (currentStatus.breadcrumb === 'hidden') ? 'none' : 'block' }}>
                                            {content}
                                        </div>
                                    </div>

                                    <div style={{ display: 'none' }} className="clear"/>
                                </div>
                            </div>

                        </div>
                    </div>
                );
            }
        }
        return null;

    }

    /** *
     * This method is used to calculate actual position for title indexes
     * It makes use of the array of titles, the current position in the iteration, and the level stored in nav properties
     * @param size
     * @param level
     * @returns {*} Index
     */
    getActualIndex(size = 1, level = 0) {
        // Default values are stored in this variables
        let actual_parent = this.props.navItems[this.props.navItem.parent];
        let actual_level = this.props.navItem;
        // Equal size to the index of level
        size = size - 1;

        if (size === undefined || level === undefined || this.props.titles.length === 0) {
            // This happens when you are in a root element

            return "";

        } else if (size === level) {
            // This happens when you are in the first level
            let actual_index = (actual_parent.children.indexOf(actual_level.id));
            if (actual_index !== -1) {
                return (actual_index + 1) + ". ";
            }
        } else {
            // This happens when you have several sections in the array
            // You iterate inversely in the array until you get to the level stored in nav properties
            let actual_index;
            let interating_level = level + 1;

            for (let n = actual_level.level; interating_level < n; n--) {
                actual_level = actual_parent;
                actual_parent = this.props.navItems[actual_level.parent];
            }

            let final_level = actual_parent.children.indexOf(actual_level.id) + 1;
            if (actual_parent !== undefined && actual_parent.children !== undefined) {
                return final_level + ". ";
            }
            return "";

        }
        return "";
    }

}

EditorHeader.propTypes = {
    /**
     * Array que contiene el título desglosado de la página. Ej: `['Sección 1'. 'Página 1']`
     */
    titles: PropTypes.array.isRequired,
    /**
     * Selecciona caja
     */
    onBoxSelected: PropTypes.func.isRequired,
    /**
     * Título del curso
     */
    courseTitle: PropTypes.string.isRequired,
    /**
     * Página actual, identificada por su *id*
     */
    navItem: PropTypes.any,
    /**
     * Diccionario que contiene todas las vistas creadas, accesibles por su *id*
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Vista contenida actual, identificada por su *id*
     */
    containedView: PropTypes.any,
    /**
     * Diccionario que contiene todas las vistas contenidas, accesibles por su *id*
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Diccionario que contiene todas las toolbars, accesibles por el *id* de su caja/vista
     */
    toolbars: PropTypes.object.isRequired,
    /**
     * Diccionario que contiene todas las cajas creadas, accesibles por su *id*
     */
    boxes: PropTypes.object.isRequired,
};
