import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, BreadcrumbItem } from 'react-bootstrap';
import i18n from 'i18next';
import { isView, isContainedView } from '../../../common/utils';

export default class VisorHeader extends Component {

    /*
     * This method is used to calculate actual position for title indexes
     * It is used the array of titles, the actual position in the iteration, and the level stored in nav properties
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

    render() {

        let titles = this.props.titles || [];
        let element = !isView(this.props.currentView) ? this.props.containedViews[this.props.currentView] : this.props.navItems[this.props.currentView];
        let currentStatus = element.header ? element.header.display : undefined;
        let docTitle = element.name;
        let subTitle = i18n.t('subtitle');
        let pagenumber = element.unitNumber;
        if (element !== undefined && element.header) {
            docTitle = element.header.elementContent.documentTitle !== "" && (element.header.elementContent.documentTitle !== element.name) ? element.header.elementContent.documentTitle : element.name;
            subTitle = element.header.elementContent.documentSubTitle !== "" && (element.header.elementContent.documentSubTitle !== i18n.t('subtitle')) ? element.header.elementContent.documentSubTitle : i18n.t('subtitle');
            pagenumber = element.header.elementContent.numPage !== "" && (element.header.elementContent.numPage !== element.unitNumber) ? element.header.elementContent.numPage : element.unitNumber;
        }

        let content;
        let unidad = "";

        // breadcrumb
        if(!isContainedView(this.props.currentView)) {
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
                }
            }
        }
        let hide = true;
        for (let i in currentStatus) {
            if (currentStatus[i] !== 'hidden') {
                hide = false;
                break;
            }
        }
        return (
            <div className="title">
                <div style={{ backgroundColor: 'white', display: hide ? 'none' : 'initial' }}>
                    <div className="caja">
                        <div className="cab"
                            style={{ backgroundColor: 'transparent', visibility: (currentStatus === 'hidden') ? 'hidden' : 'inherit' }}>
                            <div className="cabtabla_numero"
                                contentEditable={false}
                                suppressContentEditableWarning
                                style={{ display: (currentStatus.pageNumber === 'hidden') ? 'none' : 'block' }}>
                                {pagenumber}
                            </div>
                            <div className="tit_ud_cap">
                                {/* Course title*/}
                                <h1 style={{ display: (currentStatus.courseTitle === 'hidden') ? 'none' : 'block' }}>{this.props.courseTitle}</h1>
                                {/* NavItem title */}
                                <h2 style={{ display: (currentStatus.documentTitle === 'hidden') ? 'none' : 'block' }}>{docTitle}</h2>
                                {/* NavItem subtitle */}
                                <h3 style={{ display: (currentStatus.documentSubTitle === 'hidden') ? 'none' : 'block' }}>{subTitle}</h3>
                                {/* breadcrumb */}
                                <div className="contenido" style={{ display: (currentStatus.breadcrumb === 'hidden') ? 'none' : 'block' }}>
                                    { content }
                                </div>
                            </div>
                            <div style={{ display: 'none' }} className="clear" />
                        </div>
                    </div>
                    <br style={{ clear: 'both', visibility: 'inherit' }}/>
                </div>
            </div>
        );
    }

}

VisorHeader.propTypes = {
    /**
     * Array que contiene el título desglosado de la página. Ej: `['Sección 1'. 'Página 1']`
     */
    titles: PropTypes.array.isRequired,
    /**
     * Título del curso
     */
    courseTitle: PropTypes.string.isRequired,
    /**
     * Diccionario que contiene todas las vistas creadas, accesibles por su *id*
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Vista actual
     */
    currentView: PropTypes.any,
    /**
     * Diccionario que contiene todas las vistas contenidas, accesibles por su *id*
     */
    containedViews: PropTypes.object.isRequired,
    /**
      * Current nav Item
      */
    navItem: PropTypes.object,
};
