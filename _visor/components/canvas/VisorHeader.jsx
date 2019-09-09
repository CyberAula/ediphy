import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, BreadcrumbItem } from 'react-bootstrap';
import { isContainedView } from '../../../common/utils';

export default class VisorHeader extends Component {

    render() {

        let currentStatus = true;// element.header ? element.header.display : undefined;
        let element = this.props.viewToolbar;
        let docTitle = "";
        let subTitle = "";
        let pagenumber = "";
        if (element !== undefined) {
            docTitle = element.documentTitleContent !== "" ? element.documentTitleContent : element.viewName;
            subTitle = element.documentSubtitleContent;
            pagenumber = element.numPageContent;
        }

        let content;
        // breadcrumb
        if(!isContainedView(this.props.currentView)) {
            if (element !== undefined) {
                if (element.breadcrumb === 'reduced') {
                    let titleList = this.props.titles;
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
        let hide = false; // true;
        /* for (let i in currentStatus) {
            if (currentStatus[i] !== 'hidden') {
                hide = false;
                break;
            }
        }*/
        return (
            <div className="title">
                <div style={{ backgroundColor: 'white', display: hide ? 'none' : 'initial' }}>
                    <div className="caja">
                        <div className="cab"
                            style={{ backgroundColor: 'transparent', visibility: (currentStatus === 'hidden') ? 'hidden' : 'inherit' }}>
                            <div className="cabtabla_numero" style={{ display: (element.numPage === 'hidden') ? 'none' : 'block' }}>
                                {pagenumber}
                            </div>
                            <div className="tit_ud_cap">
                                {/* Course title*/}
                                <h1 style={{ display: (element.courseTitle === 'hidden') ? 'none' : 'block' }}>{this.props.courseTitle}</h1>
                                {/* NavItem title */}
                                <h2 style={{ display: (element.documentTitle === 'hidden') ? 'none' : 'block' }}>{docTitle}</h2>
                                {/* NavItem subtitle */}
                                <h3 style={{ display: (element.documentSubtitle === 'hidden') ? 'none' : 'block' }}>{subTitle}</h3>
                                {/* breadcrumb */}
                                <div className="contenido" style={{ display: (element.breadcrumb === 'hidden') ? 'none' : 'block' }}>
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
     * Array that contains the title elements of the page. E.g: `['Section 1'. 'Page 1']`
     */
    titles: PropTypes.array.isRequired,
    /**
     * Course title
     */
    courseTitle: PropTypes.string,
    /**
     * Current view
     */
    currentView: PropTypes.any,
    /**
    * Page toolbar
    */
    viewToolbar: PropTypes.object,
};
